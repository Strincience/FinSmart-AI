// ─── src/pipeline/stage1_preprocessor.js ─────────────────────────────────────
//
// STAGE 1: INPUT PREPROCESSING
//
// Transforms raw user input into a clean, normalised string ready for
// downstream NLP analysis.
//
// Operations (in order):
//   1. Strip HTML tags (XSS protection)
//   2. Normalise Unicode (consistent encoding)
//   3. Collapse multiple whitespace to single space
//   4. Trim leading/trailing whitespace
//   5. Expand Nigerian financial abbreviations
//   6. Hard-cap at 1000 characters
//
// This stage is intentionally light-touch: the Groq LLM handles imperfect
// grammar well, so we only normalise what helps downstream stages without
// removing contextual cues the model uses for intent inference.
// ─────────────────────────────────────────────────────────────────────────────

const MAX_LENGTH = 1000;

// Nigerian financial abbreviations → full forms
// Add more entries here as needed without touching any other file.
const ABBREVIATIONS = {
  'CBN':    'Central Bank of Nigeria',
  'FIRS':   'Federal Inland Revenue Service',
  'CAC':    'Corporate Affairs Commission',
  'SMEDAN': 'Small and Medium Enterprises Development Agency of Nigeria',
  'EFCC':   'Economic and Financial Crimes Commission',
  'BOI':    'Bank of Industry',
  'NDIC':   'Nigeria Deposit Insurance Corporation',
  'NHF':    'National Housing Fund',
  'BDC':    'Bureau de Change',
  'NAFEM':  'Nigerian Autonomous Foreign Exchange Market',
  'PAYE':   'Pay As You Earn',
  'VAT':    'Value Added Tax',
  'CIT':    'Company Income Tax',
  'NGN':    'Nigerian Naira',
  'POS':    'Point of Sale',
  'SME':    'small and medium enterprise',
  'MSME':   'micro, small and medium enterprise',
  'ABS':    'Asset Backed Securities',
};

/**
 * Expands known abbreviations in the input string.
 * Only expands whole-word matches (uses word boundaries) to avoid
 * expanding abbreviations that appear mid-word.
 */
function expandAbbreviations(text) {
  let result = text;
  for (const [abbr, full] of Object.entries(ABBREVIATIONS)) {
    // \b = word boundary so "CBN" matches but "XCBN" does not
    const regex = new RegExp(`\\b${abbr}\\b`, 'g');
    result = result.replace(regex, `${abbr} (${full})`);
  }
  return result;
}

/**
 * Main Stage 1 function.
 * @param {string} rawInput — the raw text from the user
 * @returns {{ cleanText: string, wasTruncated: boolean }}
 */
function preprocess(rawInput) {
  if (typeof rawInput !== 'string') {
    return { cleanText: '', wasTruncated: false };
  }

  let text = rawInput;

  // Step 1: Strip HTML tags
  text = text.replace(/<[^>]*>/g, '');

  // Step 2: Normalise Unicode (NFC = canonical decomposition then composition)
  text = text.normalize('NFC');

  // Step 3: Collapse multiple whitespace (spaces, tabs, newlines) to single space
  text = text.replace(/\s+/g, ' ');

  // Step 4: Trim
  text = text.trim();

  // Step 5: Expand abbreviations
  text = expandAbbreviations(text);

  // Step 6: Enforce length limit
  const wasTruncated = text.length > MAX_LENGTH;
  if (wasTruncated) {
    text = text.slice(0, MAX_LENGTH);
  }

  return { cleanText: text, wasTruncated };
}

module.exports = { preprocess };
