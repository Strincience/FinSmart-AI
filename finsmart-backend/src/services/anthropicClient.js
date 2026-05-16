const Anthropic = require('@anthropic-ai/sdk');

let cachedClient = null;

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
    const err = new Error('ANTHROPIC_API_KEY environment variable is missing or empty.');
    err.status = 401;
    throw err;
  }

  if (!cachedClient) {
    cachedClient = new Anthropic({ apiKey: apiKey.trim() });
  }
  return cachedClient;
}

function extractTextFromAnthropicMessage(message) {
  const blocks = message?.content;
  if (!Array.isArray(blocks)) return '';
  return blocks
    .filter((b) => b && b.type === 'text' && typeof b.text === 'string')
    .map((b) => b.text)
    .join('')
    .trim();
}

async function createTextCompletion({ system, messages, max_tokens, model, temperature }) {
  const anthropic = getAnthropicClient();
  const chosenModel = model || process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest';

  const resp = await anthropic.messages.create({
    model: chosenModel,
    max_tokens: max_tokens ?? 1024,
    temperature: temperature ?? 0.2,
    system: system || '',
    messages,
  });

  return {
    raw: resp,
    text: extractTextFromAnthropicMessage(resp),
  };
}

module.exports = {
  getAnthropicClient,
  createTextCompletion,
  extractTextFromAnthropicMessage,
};

