// ─── src/controllers/chatController.js ───────────────────────────────────────
//
// This is the heart of the backend. It handles POST /api/chat requests.
//
// WHAT IT DOES (step by step):
//
//   Step 1 — Extract the validated message and sessionId from req.body.
//
//   Step 2 — Look up the conversation document in MongoDB by sessionId.
//             If none exists, create a new empty document for this session.
//
//   Step 3 — Build the conversation history array for the Claude API.
//             We pass at most the last 20 messages (10 user + 10 assistant)
//             to avoid exceeding the context window on long conversations.
//
//   Step 4 — Call the Anthropic Claude API with:
//               - The system prompt (from src/config/systemPrompt.js)
//               - The conversation history (from MongoDB)
//               - The new user message
//
//   Step 5 — Extract the reply text from the Claude response.
//
//   Step 6 — Save both the user's message and the assistant's reply to
//             MongoDB so future requests for this sessionId have context.
//
//   Step 7 — Return the reply as JSON to the React frontend.
//
// ERROR HANDLING:
//   Any error (DB error, Claude API error, network error) is caught, logged
//   to the server console, and returned as a 500 JSON response. The React
//   frontend's catch block in App.jsx will display this gracefully.
// ─────────────────────────────────────────────────────────────────────────────

const Anthropic     = require('@anthropic-ai/sdk');
const Conversation  = require('../models/Conversation');
const SYSTEM_PROMPT = require('../config/systemPrompt');

// ── Instantiate the Anthropic client once ─────────────────────────────────────
// It reads the ANTHROPIC_API_KEY from process.env automatically.
const anthropic = new Anthropic();

// ── Constants ─────────────────────────────────────────────────────────────────
const MODEL          = 'claude-sonnet-4-5';  // The Claude model to use
const MAX_TOKENS     = 1024;                  // Max tokens in each reply
const HISTORY_WINDOW = 20;                    // Max messages passed to API (10 turns)

// ── Main controller function ──────────────────────────────────────────────────
async function handleChat(req, res) {
  const { message, sessionId } = req.body;

  try {
    // ── Step 2: Retrieve or create the conversation document ────────────────
    // findOneAndUpdate with upsert:true finds the document if it exists, or
    // creates a new one if it doesn't — all in a single atomic DB operation.
    let conversation = await Conversation.findOne({ sessionId });

    if (!conversation) {
      conversation = new Conversation({
        sessionId,
        messages: [],
      });
    }

    // ── Step 3: Build the history slice for the Claude API ──────────────────
    // We take the LAST N messages from the stored array.
    // This implements the "sliding window" context management described in
    // Chapter 3 (Section 3.6.4 — Dialogue State Tracking).
    const historySlice = conversation.messages
      .slice(-HISTORY_WINDOW)
      .map((msg) => ({
        role:    msg.role,
        content: msg.content,
      }));

    // Append the new user message to the history we'll pass to Claude
    const messagesForClaude = [
      ...historySlice,
      { role: 'user', content: message },
    ];

    // ── Step 4: Call the Claude API ─────────────────────────────────────────
    const claudeResponse = await anthropic.messages.create({
      model:      MODEL,
      max_tokens: MAX_TOKENS,
      system:     SYSTEM_PROMPT,
      messages:   messagesForClaude,
    });

    // ── Step 5: Extract the reply text ──────────────────────────────────────
    // The Claude API returns content as an array of blocks.
    // We extract the first text block's text field.
    const replyText = claudeResponse.content[0]?.text;

    if (!replyText) {
      throw new Error('Claude API returned an empty response.');
    }

    // ── Step 6: Persist both messages to MongoDB ─────────────────────────────
    conversation.messages.push(
      { role: 'user',      content: message   },
      { role: 'assistant', content: replyText }
    );

    await conversation.save();

    // ── Step 7: Send the reply to the frontend ───────────────────────────────
    return res.status(200).json({ reply: replyText });

  } catch (error) {
    // Log the full error on the server side for debugging
    console.error('❌  Chat controller error:', error.message);

    // Determine a user-friendly error message based on error type
    let userMessage = 'Something went wrong while generating a response. Please try again.';

    if (error.status === 401) {
      userMessage = 'API authentication failed. Please check your ANTHROPIC_API_KEY in the .env file.';
    } else if (error.status === 429) {
      userMessage = 'The AI service is currently at capacity. Please wait a moment and try again.';
    } else if (error.code === 'ECONNREFUSED') {
      userMessage = 'Could not connect to the AI service. Please check your internet connection.';
    }

    return res.status(500).json({ error: userMessage });
  }
}

module.exports = { handleChat };
