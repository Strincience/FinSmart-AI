// ─── src/middleware/rateLimiter.js ───────────────────────────────────────────
//
// Rate limiting protects the API in two ways:
//   1. Prevents a single user from accidentally (or deliberately) flooding the
//      Claude API with thousands of requests, running up large API costs.
//   2. Provides a basic defence against automated bots or abuse.
//
// We define TWO limiters with different tolerances:
//
//   generalLimiter — applied to all routes (broad protection)
//   chatLimiter    — applied only to POST /api/chat (stricter, since every
//                    request to this route triggers a paid Claude API call)
//
// HOW IT WORKS:
// express-rate-limit counts requests per IP address within a rolling time
// window. When the limit is exceeded it returns HTTP 429 with a JSON error.
// The React frontend's error handler in App.jsx will display this to the user.
// ─────────────────────────────────────────────────────────────────────────────

const rateLimit = require('express-rate-limit');

// ── General limiter — all routes ─────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15-minute window
   trustProxy: true,
  max:      200,              // max 200 requests per IP per 15 minutes
  standardHeaders: true,      // send RateLimit-* headers in responses
  legacyHeaders:   false,
  message: {
    error: 'Too many requests from this IP address. Please try again in 15 minutes.',
  },
});

// ── Chat-specific limiter — POST /api/chat only ───────────────────────────────
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1-minute window
   trustProxy: true,
  max:      20,          // max 20 chat messages per IP per minute
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    error: 'You are sending messages too quickly. Please wait a moment before trying again.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      30,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    error: 'Too many sign-in attempts from this IP. Please try again later.',
  },
});

module.exports = { generalLimiter, chatLimiter, authLimiter };
