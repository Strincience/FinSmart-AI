// ─── src/controllers/chatController.js (v2) ──────────────────────────────────
// Orchestrates the full 7-stage NLP pipeline for every chat request.

const Groq         = require('groq-sdk');
const Conversation = require('../models/Conversation');

const { preprocess }             = require('../pipeline/stage1_preprocessor');
const { classifyIntent }         = require('../pipeline/stage2_intentClassifier');
const { extractEntities }        = require('../pipeline/stage3_nerExtractor');
const { updateDialogueState,
        buildSessionSummary }    = require('../pipeline/stage4_dialogueState');
const { retrieveKnowledge,
        formatKnowledgeContext } = require('../pipeline/stage5_ragRetriever');
const { buildSystemPrompt }      = require('../pipeline/stage6_promptBuilder');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL          = 'llama-3.3-70b-versatile';
const MAX_TOKENS     = 1024;
const HISTORY_WINDOW = 20;

async function handleChat(req, res) {
  const { message, sessionId } = req.body;

  try {
    // Stage 1 — Preprocess
    const { cleanText, wasTruncated } = preprocess(message);
    if (!cleanText) return res.status(400).json({ error: 'Message is empty after preprocessing.' });

    // Stages 2 + 3 — run concurrently to reduce latency
    const [intent, entities] = await Promise.all([
      classifyIntent(cleanText),
      extractEntities(cleanText),
    ]);

    // Retrieve or create conversation
    let conversation = await Conversation.findOne({ sessionId });
    if (!conversation) conversation = new Conversation({ sessionId, messages: [], metadata: {} });

    // Stage 4 — Dialogue state
    const updatedMetadata = updateDialogueState(conversation.metadata, { cleanText, intent, entities });
    const sessionSummary  = buildSessionSummary(updatedMetadata);

    // Stage 5 — RAG
    const kbDocs           = await retrieveKnowledge({ intent, entities });
    const knowledgeContext = formatKnowledgeContext(kbDocs);

    // Stage 6 — Build system prompt
    const systemPrompt = buildSystemPrompt({ knowledgeContext, sessionSummary, intent });

    // Stage 7 — Call Groq API
    const historySlice = conversation.messages
      .slice(-HISTORY_WINDOW)
      .map((m) => ({ role: m.role, content: m.content }));

    const groqResponse = await groq.chat.completions.create({
      model:    MODEL,
      max_tokens: MAX_TOKENS,
      messages: [
        { role: 'system', content: systemPrompt },
        ...historySlice,
        { role: 'user',   content: cleanText },
      ],
    });

    const replyText = groqResponse.choices[0]?.message?.content;
    if (!replyText) throw new Error('Groq API returned an empty response.');

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
    if (error.status === 401) msg = 'API authentication failed. Check your GROQ_API_KEY.';
    if (error.status === 429) msg = 'AI service is at capacity. Please wait and try again.';
    return res.status(500).json({ error: msg });
  }
}

module.exports = { handleChat };
