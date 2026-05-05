// ─── src/models/Conversation.js (v2) ─────────────────────────────────────────
// v2 adds a metadata subdocument for Stage 4 Dialogue State Tracking.

const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    role:    { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

const MetadataSchema = new mongoose.Schema(
  {
    language:        { type: String, default: 'English' },
    discussedTopics: { type: [String], default: [] },
    mentionedValues: { type: [String], default: [] },
    turnCount:       { type: Number,   default: 0 },
  },
  { _id: false }
);

const ConversationSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    messages:  [MessageSchema],
    metadata:  { type: MetadataSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', ConversationSchema);
