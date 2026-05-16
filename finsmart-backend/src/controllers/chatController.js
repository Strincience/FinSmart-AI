// ─── src/controllers/chatController.js (v2) ──────────────────────────────────
// Orchestrates the full 7-stage NLP pipeline for every chat request.

const Conversation = require('../models/Conversation');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const { preprocess }             = require('../pipeline/stage1_preprocessor');
const { classifyIntent }         = require('../pipeline/stage2_intentClassifier');
const { extractEntities }        = require('../pipeline/stage3_nerExtractor');
const { updateDialogueState,
        buildSessionSummary }    = require('../pipeline/stage4_dialogueState');
const { retrieveKnowledge,
        formatKnowledgeContext } = require('../pipeline/stage5_ragRetriever');
const { buildSystemPrompt }      = require('../pipeline/stage6_promptBuilder');

const MAX_TOKENS     = 1024;
const HISTORY_WINDOW = 20;
const genAI          = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function sessionKeyForUser(userId) {
  return `finuser:${userId}`;
}

async function handleChat(req, res) {
  const { message } = req.body;

  try {
    // Stage 1 — Preprocess
    const { cleanText, wasTruncated } = preprocess(message);
    if (!cleanText) return res.status(400).json({ error: 'Message is empty after preprocessing.' });

    // Stages 2 + 3 — run concurrently to reduce latency
    const [intent, entities] = await Promise.all([
      classifyIntent(cleanText),
      extractEntities(cleanText),
    ]);

    const userId = req.user.id;
    const sessionId = sessionKeyForUser(userId);

    // Retrieve or create conversation (one thread per authenticated user)
    let conversation = await Conversation.findOne({ sessionId });
    if (!conversation) {
      conversation = new Conversation({
        sessionId,
        userId,
        messages: [],
        metadata: {},
      });
    } else if (!conversation.userId) {
      conversation.userId = userId;
    }

    // Stage 4 — Dialogue state
    const updatedMetadata = updateDialogueState(conversation.metadata, { cleanText, intent, entities });
    const sessionSummary  = buildSessionSummary(updatedMetadata);

    // Stage 5 — RAG
    const kbDocs           = await retrieveKnowledge({ intent, entities });
    const knowledgeContext = formatKnowledgeContext(kbDocs);

    // Stage 6 — Build system prompt
    const systemPrompt = buildSystemPrompt({ knowledgeContext, sessionSummary, intent });

    // Stage 7 — Call Gemini
    const historySlice = conversation.messages
      .slice(-HISTORY_WINDOW)
      .map((m) => ({ role: m.role, content: m.content }));

    const geminiHistory = historySlice.map((m) => ({
      role:  m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const geminiModel = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
    });

    const chat      = geminiModel.startChat({ history: geminiHistory });
    const result    = await chat.sendMessage(cleanText);
    const replyText = result.response.text();
    if (!replyText) throw new Error('Gemini returned an empty response.');

    // Persist
    conversation.messages.push(
      { role: 'user',      content: cleanText },
      { role: 'assistant', content: replyText },
    );
    conversation.metadata = updatedMetadata;
    await conversation.save();

    return res.status(200).json({ reply: replyText, intent, truncated: wasTruncated });

  } catch (error) {
    console.error('Chat controller error:', error.message);
    let msg = 'Something went wrong. Please try again.';
    if (error.status === 401) msg = 'API authentication failed. Check your ANTHROPIC_API_KEY.';
    if (error.status === 429) msg = 'AI service is at capacity. Please wait and try again.';
    return res.status(500).json({ error: msg });
  }
}

module.exports = { handleChat };
