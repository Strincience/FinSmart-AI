// ─── src/routes/chat.js ──────────────────────────────────────────────────────
//
// Defines the routes for the /api/chat endpoint.
//
// This file is intentionally thin — all logic lives in the controller and
// middleware. The router just wires them together in order:
//
//   chatLimiter    → reject if too many requests from this IP
//   validateChat   → reject if the request body is invalid
//   handleChat     → process the message and return the AI reply
//
// This layered pattern (route → middleware → controller) is standard Express
// architecture and makes each concern independently testable.
// ─────────────────────────────────────────────────────────────────────────────

const express      = require('express');
const router       = express.Router();

const { chatLimiter }  = require('../middleware/rateLimiter');
const validateChat     = require('../middleware/validateChat');
const authRequired     = require('../middleware/authRequired');
const { handleChat }   = require('../controllers/chatController');

// POST /api/chat
// The full request path (including the /api prefix) is set in server.js
// when this router is mounted with: app.use('/api', chatRouter)
router.post('/chat', chatLimiter, authRequired, validateChat, handleChat);

// Health-check — quick way to confirm the API is alive
// GET /api/health → { status: "ok", timestamp: "..." }
router.get('/health', (req, res) => {
  res.json({
    status:    'ok',
    service:   'FinSmart AI Backend',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
