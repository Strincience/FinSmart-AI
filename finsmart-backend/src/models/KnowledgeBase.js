// ─── src/models/KnowledgeBase.js ─────────────────────────────────────────────
//
// Mongoose schema for the Financial Knowledge Base (KB).
//
// Each document represents one financial topic. The KB is the source of
// truth that the RAG pipeline (Stage 5) queries to ground LLM responses.
//
// FIELDS:
//   topicId      — unique human-readable identifier (e.g. "profit-margin-basics")
//   title        — display name of the topic
//   intentTags   — array of intent categories this document is relevant to
//                  (must match values in INTENT_CATEGORIES in stage2_intentClassifier.js)
//   definition   — one-sentence plain-language definition
//   explanation  — detailed explanation (2–4 paragraphs)
//   examples     — array of concrete Nigerian business examples
//   misconceptions — common wrong beliefs about this topic
//   actionSteps  — what the user should do with this knowledge
//   references   — authoritative sources (CBN, FIRS, SMEDAN publications)
//
// TO ADD NEW KB ENTRIES:
//   Either add them to src/data/seedKnowledgeBase.js and run `npm run seed`,
//   or insert directly via MongoDB Atlas Data Explorer.
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require('mongoose');

const KnowledgeBaseSchema = new mongoose.Schema(
  {
    topicId: {
      type:     String,
      required: true,
      unique:   true,
      index:    true,
    },
    title: {
      type:     String,
      required: true,
    },
    // Must match values from INTENT_CATEGORIES in stage2_intentClassifier.js
    intentTags: {
      type:     [String],
      required: true,
      index:    true,
    },
    definition:     { type: String, default: '' },
    explanation:    { type: String, default: '' },
    examples:       { type: [String], default: [] },
    misconceptions: { type: [String], default: [] },
    actionSteps:    { type: [String], default: [] },
    references:     { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('KnowledgeBase', KnowledgeBaseSchema);
