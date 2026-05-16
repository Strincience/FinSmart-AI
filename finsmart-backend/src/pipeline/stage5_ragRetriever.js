// ─── src/pipeline/stage5_ragRetriever.js ─────────────────────────────────────
//
// STAGE 5: RETRIEVAL-AUGMENTED GENERATION (RAG)
//
// Queries the MongoDB KnowledgeBase collection to find domain-specific,
// verified financial content relevant to the user's query.
//
// This retrieved content is injected into the system prompt in Stage 6,
// grounding the LLM's response in accurate, Nigeria-contextualised financial
// knowledge rather than relying solely on the model's parametric memory.
//
// WHY RAG?
// LLMs may contain inaccuracies about Nigerian-specific regulations (CBN
// policies, FIRS VAT rules, etc.) or may not reflect recent changes.
// RAG gives us control over the factual content of every response.
//
// QUERY STRATEGY:
// 1. Match documents whose intentTags array contains the classified intent
// 2. Within those results, prioritise documents whose content contains
//    keywords extracted from the NER entities
// 3. Return top 2–3 documents
//
// FALLBACK: If no KB documents are found, the pipeline continues — the
// LLM will respond from its parametric knowledge alone, with appropriate
// disclaimer language added by the prompt builder.
// ─────────────────────────────────────────────────────────────────────────────

const KnowledgeBase = require('../models/KnowledgeBase');

const MAX_RESULTS = 3;

/**
 * Retrieves relevant knowledge base documents for the current query.
 *
 * @param {object} params
 *   @param {string}   params.intent   — classified intent from Stage 2
 *   @param {object}   params.entities — extracted entities from Stage 3
 * @returns {Promise<Array>} — array of KB documents (may be empty)
 */
async function retrieveKnowledge({ intent, entities }) {
  try {
    // Build a keyword list from extracted entities for secondary scoring
    const keywords = [
      ...(entities.financialMetrics  || []),
      ...(entities.nigerianEntities  || []),
    ].filter(Boolean);

    // Primary query: match by intent tag
    // MongoDB $in operator checks if the intentTags array contains the intent
    let query = { intentTags: { $in: [intent] } };

    // If we have keywords, add a text search filter to narrow results further.
    // We search across definition, explanation, and title fields.
    // Note: this uses a simple regex — a production system would use a
    // MongoDB Atlas full-text search index for better performance.
    if (keywords.length > 0) {
      const regexes = keywords.map((kw) => new RegExp(kw, 'i'));
      query = {
        intentTags: { $in: [intent] },
        $or: [
          { title:       { $in: regexes } },
          { definition:  { $in: regexes } },
          { explanation: { $in: regexes } },
        ],
      };
    }

    let docs = await KnowledgeBase
      .find(query)
      .limit(MAX_RESULTS)
      .lean();   // .lean() returns plain JS objects (faster, no Mongoose overhead)

    // If keyword-narrowed query returns nothing, fall back to intent-only query
    if (docs.length === 0 && keywords.length > 0) {
      docs = await KnowledgeBase
        .find({ intentTags: { $in: [intent] } })
        .limit(MAX_RESULTS)
        .lean();
    }

    return docs;

  } catch (error) {
    console.error('Stage 5 (RAG) error:', error.message);
    return [];  // non-fatal — pipeline continues without KB content
  }
}

/**
 * Formats the retrieved KB documents into a string block ready for injection
 * into the system prompt.
 *
 * @param {Array} docs — array of KnowledgeBase documents
 * @returns {string}
 */
function formatKnowledgeContext(docs) {
  if (!docs || docs.length === 0) {
    return '';
  }

  const sections = docs.map((doc, i) => {
    const parts = [`[KB ${i + 1}] ${doc.title}`];

    if (doc.definition)   parts.push(`Definition: ${doc.definition}`);
    if (doc.explanation)  parts.push(`Explanation: ${doc.explanation}`);
    if (doc.examples?.length)     parts.push(`Examples: ${doc.examples.join(' | ')}`);
    if (doc.actionSteps?.length)  parts.push(`Action Steps: ${doc.actionSteps.join(' | ')}`);
    if (doc.misconceptions?.length) parts.push(`Common Misconceptions: ${doc.misconceptions.join(' | ')}`);

    return parts.join('\n');
  });

  return sections.join('\n\n---\n\n');
}

module.exports = { retrieveKnowledge, formatKnowledgeContext };
