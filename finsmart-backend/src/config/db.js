// ─── src/config/db.js ────────────────────────────────────────────────────────
//
// This file contains one exported function: connectDB().
// It is called once when the server starts (in server.js).
// Mongoose handles the connection pool internally — you don't need to call it
// again for individual requests.
//
// If the connection fails, the process exits so you know immediately rather
// than having the server run silently without a database.
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require('mongoose');

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options silence deprecation warnings from older Mongoose versions
      serverSelectionTimeoutMS: 5000, // fail fast if Atlas is unreachable
    });

    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌  MongoDB connection failed:', error.message);
    // Exit with a non-zero code so the shell/process manager knows it crashed
    process.exit(1);
  }
}

module.exports = connectDB;
