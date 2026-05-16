// ─── src/pipeline/stage2_intentClassifier.js ─────────────────────────────────
//
// STAGE 2: INTENT CLASSIFICATION
//
// Determines which of the 8 financial intent categories the user's query
// belongs to, using zero-shot classification via the Groq LLM.
//
// The 8 categories match the Knowledge Base intentTags exactly, so the
// classified intent is used directly as a query parameter in Stage 5 (RAG).
//
// APPROACH: Zero-shot classification via structured prompt.
// We ask the LLM to respond with ONLY the category name — no explanation.
// This keeps latency low (small response) and output parsing trivial.
//
// FALLBACK: If the LLM returns something unexpected, we default to
// "General Financial Education" so the pipeline never breaks.
// ─────────────────────────────────────────────────────────────────────────────

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// The 8 canonical intent categories (must match KnowledgeBase.intentTags values)
const INTENT_CATEGORIES = [
  'Budgeting & Planning',
  'Bookkeeping',
  'Profit & Loss',
  'Cash Flow',
  'Fraud & Security',
  'Credit & Loans',
  'Tax & Compliance',
  'General Financial Education',
];

const FALLBACK_INTENT = 'General Financial Education';

const CLASSIFICATION_PROMPT = `You are a financial query classifier for a Nigerian SME advisory system.

Classify the user's question into EXACTLY ONE of these categories:
${INTENT_CATEGORIES.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Rules:
- Respond with ONLY the category name. Nothing else.
- No punctuation, no explanation, no number prefix.
- If unsure, respond: General Financial Education

User question:`;

/**
 * Classifies the user's message into one of the 8 financial intent categories.
 * @param {string} cleanText — preprocessed text from Stage 1
 * @returns {Promise<string>} — one of the 8 INTENT_CATEGORIES strings
 */
async function classifyIntent(cleanText) {
  try {
    const prompt = `${CLASSIFICATION_PROMPT}\n${cleanText}`;
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    // Validate the returned value against the known category list
    const cleaned = String(raw || '')
      .replace(/^["'\s]+|["'\s]+$/g, '')
      .replace(/^\d+\.\s*/, '')
      .replace(/[.]+$/g, '')
      .trim();

    const matched = INTENT_CATEGORIES.find((cat) => cat.toLowerCase() === cleaned.toLowerCase());

    return matched ?? FALLBACK_INTENT;

  } catch (error) {
    // Classification failure is non-fatal — use the fallback intent
    console.error('Stage 2 (Intent Classification) error:', error.message);
    return FALLBACK_INTENT;
  }
}

module.exports = { classifyIntent, INTENT_CATEGORIES };
