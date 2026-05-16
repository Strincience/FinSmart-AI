// ─── src/middleware/validateChat.js ──────────────────────────────────────────
//
// Validates the request body sent to POST /api/chat before it reaches the
// controller. If validation fails, a 400 response is returned immediately
// and the request never touches the Claude API.
//
// This protects against:
//   - Missing required fields
//   - Messages that are too long (saves API tokens)
//
// Usage: app.post('/api/chat', validateChat, chatController)
// ─────────────────────────────────────────────────────────────────────────────

const MAX_MESSAGE_LENGTH = 1000; // characters — matches the React frontend cap

function validateChat(req, res, next) {
  const { message, sessionId } = req.body;

  // ── Check: message must exist and be a non-empty string ──────────────────
  if (!message || typeof message !== 'string') {
    return res.status(400).json({
      error: 'Request body must include a "message" field (string).',
    });
  }

  if (message.trim().length === 0) {
    return res.status(400).json({
      error: 'Message cannot be empty.',
    });
  }

  // ── Check: message must not exceed the maximum length ────────────────────
  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      error: `Message exceeds the maximum length of ${MAX_MESSAGE_LENGTH} characters.`,
    });
  }

  let sid = '';
  if (typeof sessionId === 'string') sid = sessionId.trim();

  // ── Sanitise: strip HTML tags to prevent injection in logs ───────────────
  // Note: the Claude API response is rendered as Markdown (not raw HTML) in
  // the React frontend, so stripping tags from the input is sufficient here.
  req.body.message   = message.trim().replace(/<[^>]*>/g, '');
  req.body.sessionId = sid;

  // ── All checks passed — continue to the controller ───────────────────────
  next();
}

module.exports = validateChat;
