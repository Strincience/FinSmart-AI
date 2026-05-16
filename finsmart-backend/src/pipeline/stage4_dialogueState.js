// ─── src/pipeline/stage4_dialogueState.js ────────────────────────────────────
//
// STAGE 4: DIALOGUE STATE TRACKING
//
// Maintains an up-to-date snapshot of the conversation state that helps
// the prompt builder (Stage 6) and the LLM produce contextually coherent
// responses across multiple turns.
//
// STATE TRACKED (stored in conversation.metadata in MongoDB):
//   - language        : "English" | "Pidgin" (detected from vocabulary)
//   - discussedTopics : array of intent categories covered so far
//   - mentionedValues : array of monetary amounts mentioned across turns
//   - turnCount       : total number of user turns in this session
//
// WHY THIS MATTERS:
// Without state tracking each turn looks independent. With it, the AI can say
// "As we discussed earlier when you mentioned ₦80,000..." — creating the
// experience of a genuine ongoing advisory relationship.
// ─────────────────────────────────────────────────────────────────────────────

// Vocabulary patterns that suggest the user is writing in Nigerian Pidgin
const PIDGIN_MARKERS = [
  'abeg', 'wetin', 'na so', 'abi', 'dem', 'dey', 'nai',
  'wahala', 'no be', 'e don', 'how far', 'comot', 'shey',
];

/**
 * Detects whether the user's message appears to be in Nigerian Pidgin.
 * @param {string} text
 * @returns {"Pidgin" | "English"}
 */
function detectLanguage(text) {
  const lower = text.toLowerCase();
  const hasPidgin = PIDGIN_MARKERS.some((marker) => lower.includes(marker));
  return hasPidgin ? 'Pidgin' : 'English';
}

/**
 * Updates the session metadata object based on the current turn's analysis.
 *
 * The updated metadata is saved back to MongoDB by the chat controller
 * (it's part of the Conversation document).
 *
 * @param {object} existingMetadata — the current metadata from the DB document
 * @param {object} params
 *   @param {string} params.cleanText      — preprocessed user message
 *   @param {string} params.intent         — classified intent from Stage 2
 *   @param {object} params.entities       — extracted entities from Stage 3
 * @returns {object} updatedMetadata
 */
function updateDialogueState(existingMetadata, { cleanText, intent, entities }) {
  // Start from existing metadata or initialise fresh
  const meta = existingMetadata || {
    language:        'English',
    discussedTopics: [],
    mentionedValues: [],
    turnCount:       0,
  };

  // Update language detection (latest message wins)
  meta.language = detectLanguage(cleanText);

  // Add this turn's intent to the discussed topics list (no duplicates)
  if (intent && !meta.discussedTopics.includes(intent)) {
    meta.discussedTopics.push(intent);
  }

  // Accumulate monetary amounts mentioned (keep unique values, cap at 20)
  if (entities?.monetaryAmounts?.length) {
    const combined = [...new Set([...meta.mentionedValues, ...entities.monetaryAmounts])];
    meta.mentionedValues = combined.slice(-20);
  }

  // Increment turn counter
  meta.turnCount = (meta.turnCount || 0) + 1;

  return meta;
}

/**
 * Builds a short session summary string that gets injected into the prompt.
 * This tells the LLM what it "knows" about the user already.
 *
 * @param {object} metadata
 * @returns {string}
 */
function buildSessionSummary(metadata) {
  if (!metadata) return '';

  const parts = [];

  if (metadata.turnCount > 1) {
    parts.push(`This is turn ${metadata.turnCount} of an ongoing conversation.`);
  }

  if (metadata.discussedTopics?.length > 0) {
    parts.push(`Topics discussed so far: ${metadata.discussedTopics.join(', ')}.`);
  }

  if (metadata.mentionedValues?.length > 0) {
    parts.push(`Financial figures the user has mentioned: ${metadata.mentionedValues.join(', ')}.`);
  }

  if (metadata.language === 'Pidgin') {
    parts.push('The user appears to be communicating in Nigerian Pidgin — respond in simple, friendly English that is easy for Pidgin speakers to understand.');
  }

  return parts.join(' ');
}

module.exports = { updateDialogueState, buildSessionSummary };
