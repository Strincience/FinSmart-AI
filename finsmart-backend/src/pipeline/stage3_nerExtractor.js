// ─── src/pipeline/stage3_nerExtractor.js ─────────────────────────────────────
//
// STAGE 3: FINANCIAL NAMED ENTITY RECOGNITION (NER)
//
// Extracts semantically meaningful financial entities from the user's message.
// These entities serve two purposes:
//   a) Personalise the AI response (use the user's own figures in calculations)
//   b) Enrich the Knowledge Base query in Stage 5 (RAG)
//
// ENTITY TYPES EXTRACTED:
//   - monetaryAmounts  : e.g. "₦50,000", "200k", "two million naira"
//   - timePeriods      : e.g. "last month", "Q3 2024", "this financial year"
//   - financialMetrics : e.g. "profit margin", "cash flow", "COGS"
//   - nigerianEntities : e.g. "CBN", "FIRS", "esusu", "ajo"
//
// APPROACH: LLM-based extraction via structured JSON prompt.
// The LLM is asked to return a JSON object. We parse and validate the output.
//
// FALLBACK: If extraction fails or JSON is malformed, we return empty arrays
// so the pipeline continues without breaking.
// ─────────────────────────────────────────────────────────────────────────────

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const NER_PROMPT = `You are a financial named entity extractor for a Nigerian SME advisory system.

Extract entities from the user's message and return ONLY a valid JSON object with these keys:
{
  "monetaryAmounts":  [],   // e.g. ["₦50,000", "200k", "2 million naira"]
  "timePeriods":      [],   // e.g. ["last month", "Q3 2024", "this year"]
  "financialMetrics": [],   // e.g. ["profit margin", "cash flow", "COGS", "VAT"]
  "nigerianEntities": []    // e.g. ["CBN", "FIRS", "esusu", "ajo", "SMEDAN"]
}

Rules:
- Return ONLY the raw JSON object. No markdown, no backticks, no explanation.
- If no entities found for a type, return an empty array [].
- Keep values exactly as they appear in the text.

User message:`;

/**
 * Extracts financial named entities from the preprocessed text.
 * @param {string} cleanText — preprocessed text from Stage 1
 * @returns {Promise<object>} — { monetaryAmounts, timePeriods, financialMetrics, nigerianEntities }
 */
async function extractEntities(cleanText) {
  const EMPTY_RESULT = {
    monetaryAmounts:  [],
    timePeriods:      [],
    financialMetrics: [],
    nigerianEntities: [],
  };

  try {
    const prompt = `${NER_PROMPT}\n${cleanText}`;
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    // Strip any accidental markdown code fences the model may add
    const cleaned = raw.replace(/```json|```/g, '').trim();

    const parsed = JSON.parse(cleaned);

    // Validate each key exists and is an array
    return {
      monetaryAmounts:  Array.isArray(parsed.monetaryAmounts)  ? parsed.monetaryAmounts  : [],
      timePeriods:      Array.isArray(parsed.timePeriods)       ? parsed.timePeriods       : [],
      financialMetrics: Array.isArray(parsed.financialMetrics)  ? parsed.financialMetrics  : [],
      nigerianEntities: Array.isArray(parsed.nigerianEntities)  ? parsed.nigerianEntities  : [],
    };

  } catch (error) {
    // NER failure is non-fatal — return empty entities and continue
    console.error('Stage 3 (NER) error:', error.message);
    return EMPTY_RESULT;
  }
}

module.exports = { extractEntities };
