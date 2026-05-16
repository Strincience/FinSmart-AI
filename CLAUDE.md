# FinSmart AI — Project Context for Claude

## What This Project Is
A conversational AI system for financial intelligence among Nigerian SMEs.
Final year Computer Science project — Lead City University, Ibadan.
Student: Oluwademilade David AKIODE

## Tech Stack
- Frontend: React + Tailwind CSS + Vite (finsmart-frontend/)
- Backend:  Node.js + Express.js (finsmart-backend/)
- Database: MongoDB Atlas (Mongoose)
- AI:       Groq API (llama-3.3-70b-versatile)
- Messaging: WhatsApp Business Cloud API (planned)

## Architecture
The backend implements a 7-stage NLP pipeline:
1. stage1_preprocessor.js     — text normalisation, abbreviation expansion
2. stage2_intentClassifier.js — zero-shot intent classification (8 categories)
3. stage3_nerExtractor.js     — financial named entity recognition
4. stage4_dialogueState.js    — dialogue state tracking and session metadata
5. stage5_ragRetriever.js     — RAG retrieval from MongoDB knowledge base
6. stage6_promptBuilder.js    — dynamic system prompt assembly
7. Response generation via Groq API in chatController.js

## Key Files
- src/controllers/chatController.js — main pipeline orchestrator
- src/models/Conversation.js        — chat history schema
- src/models/KnowledgeBase.js       — financial KB schema
- src/data/seedKnowledgeBase.js     — seed script (npm run seed)
- src/pipeline/                     — all 6 NLP pipeline stage files

## Important Rules
- Never hardcode API keys — always use process.env
- .env is gitignored — .env.example has placeholder values only
- Backend runs on port 5000, frontend on port 3000
- Vite proxies /api/* from 3000 → 5000 automatically
- All pipeline stages are non-fatal — errors fall back gracefully
- Nigerian Naira symbol is ₦, not $

## Current Branch
- main = v1 (basic chat)
- v2-nlp-pipeline = v2 (full 7-stage pipeline, current working branch)

## Next Features to Build
(add here as you plan them)