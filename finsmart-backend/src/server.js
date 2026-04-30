// ─── src/server.js ───────────────────────────────────────────────────────────
//
// This is the main entry point for the Express.js backend.
// It does the following in order:
//
//   1. Loads environment variables from the .env file
//   2. Creates the Express app
//   3. Registers global middleware (CORS, JSON parsing, rate limiting)
//   4. Mounts the API routes
//   5. Connects to MongoDB
//   6. Starts listening on the configured port
//
// To run:
//   npm run dev     ← development (nodemon auto-restarts on file changes)
//   npm start       ← production
// ─────────────────────────────────────────────────────────────────────────────

// Step 1 — Load environment variables FIRST, before any other imports
// This makes process.env.PORT, process.env.ANTHROPIC_API_KEY, etc. available
require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const connectDB  = require('./config/db');
const chatRouter = require('./routes/chat');
const { generalLimiter } = require('./middleware/rateLimiter');

// ── Create the Express application ───────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 5000;

// ── Global Middleware ─────────────────────────────────────────────────────────

// CORS — allow requests from the React frontend only.
// In development the frontend runs on http://localhost:3000.
// In production, update FRONTEND_URL in .env to your Vercel deployment URL.
app.use(
  cors({
    origin:      process.env.FRONTEND_URL || 'http://localhost:3000',
    methods:     ['GET', 'POST'],
    credentials: false,
  })
);

app.use(express.json({ limit: '10kb' }));



app.use(generalLimiter);


app.use('/api', chatRouter);

// ── 404 Handler — catch requests for undefined routes ────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found.` });
});

// ── Global Error Handler — catches any unhandled errors in route handlers ─────
// This is Express's special 4-argument error handler (err, req, res, next).
// It must be defined AFTER all routes.
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'An unexpected server error occurred.' });
});

// ── Start the server ─────────────────────────────────────────────────────────
// We connect to MongoDB first. If that fails, connectDB() calls process.exit()
// so the server never starts without a working database connection.
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log('');
    console.log('🚀  FinSmart AI Backend is running');
    console.log(`    Local:    http://localhost:${PORT}`);
    console.log(`    API:      http://localhost:${PORT}/api/chat`);
    console.log(`    Health:   http://localhost:${PORT}/api/health`);
    console.log('');
    console.log('    Waiting for requests from the React frontend...');
    console.log('');
  });
}

startServer();
