# FinSmart AI — Backend

> Express.js API server — handles chat requests, calls the Anthropic Claude API, and stores conversation history in MongoDB.

---

## File Structure

```
finsmart-backend/
│
├── src/
│   ├── config/
│   │   ├── db.js              ← MongoDB connection (called once at startup)
│   │   └── systemPrompt.js    ← The full FinSmart AI system prompt for Claude
│   │
│   ├── controllers/
│   │   └── chatController.js  ← Core logic: history → Claude API → MongoDB → response
│   │
│   ├── middleware/
│   │   ├── rateLimiter.js     ← Limits requests per IP (protects API costs)
│   │   └── validateChat.js    ← Validates request body before it hits Claude
│   │
│   ├── models/
│   │   └── Conversation.js    ← Mongoose schema for conversation history
│   │
│   ├── routes/
│   │   └── chat.js            ← Wires middleware + controller to POST /api/chat
│   │
│   └── server.js              ← Entry point — starts Express and MongoDB
│
├── .env.example               ← Copy this to .env and fill in your secrets
├── .gitignore                 ← Keeps .env and node_modules out of Git
├── package.json               ← Dependencies and npm scripts
└── README.md                  ← This file
```

---

## Request Flow

```
React Frontend
  POST /api/chat  { message, sessionId }
          │
          ▼
   generalLimiter      (max 200 req / 15 min per IP)
          │
          ▼
   chatLimiter         (max 20 req / 1 min per IP — chat route only)
          │
          ▼
   validateChat        (checks message & sessionId, strips HTML)
          │
          ▼
   handleChat (controller)
     ├─ Find/create Conversation in MongoDB by sessionId
     ├─ Slice last 20 messages as context window
     ├─ POST to Anthropic Claude API
     ├─ Save user + assistant messages to MongoDB
     └─ Return { reply: "..." } to frontend
```

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9+
- An **Anthropic account** with an API key
- A **MongoDB Atlas** account (free tier is sufficient)

---

## Step-by-Step Setup

### Step 1 — Navigate into the backend folder

```bash
cd finsmart-backend
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Get your Anthropic API Key

1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Sign in or create a free account
3. Navigate to **API Keys** in the left sidebar
4. Click **Create Key**, give it a name (e.g. "FinSmart Dev")
5. Copy the key — it starts with `sk-ant-api03-...`

> Keep this key secret. Never paste it into your code files or commit it to Git.

### Step 4 — Set up MongoDB Atlas (free tier)

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Sign in or create a free account
3. Click **Build a Database** → choose the **Free (M0)** tier
4. Choose a cloud provider (AWS is fine) and a region close to Nigeria (e.g. `eu-west-1`)
5. Set a **username** and **password** — remember these
6. Under **Network Access**, click **Add IP Address** → **Allow Access from Anywhere** (for development)
7. Once the cluster is created, click **Connect** → **Drivers**
8. Copy the connection string — it looks like:
   ```
   mongodb+srv://yourUsername:yourPassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
9. Replace `<password>` with your actual password, and add your database name before the `?`:
   ```
   mongodb+srv://yourUsername:yourPassword@cluster0.xxxxx.mongodb.net/finsmart?retryWrites=true&w=majority
   ```

### Step 5 — Create your .env file

Copy the example file:
```bash
cp .env.example .env
```

Then open `.env` in any text editor and fill in your values:

```env
PORT=5000
ANTHROPIC_API_KEY=sk-ant-api03-your-real-key-here
MONGODB_URI=mongodb+srv://yourUser:yourPass@cluster0.xxxxx.mongodb.net/finsmart?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:3000
```

### Step 6 — Start the development server

```bash
npm run dev
```

You should see:

```
✅  MongoDB connected: cluster0.xxxxx.mongodb.net

🚀  FinSmart AI Backend is running
    Local:    http://localhost:5000
    API:      http://localhost:5000/api/chat
    Health:   http://localhost:5000/api/health

    Waiting for requests from the React frontend...
```

### Step 7 — Test the API is working

Open your browser and visit: `http://localhost:5000/api/health`

You should see:
```json
{
  "status": "ok",
  "service": "FinSmart AI Backend",
  "timestamp": "2026-04-30T10:00:00.000Z"
}
```

### Step 8 — Start the frontend

In a **separate terminal**, start the React frontend:
```bash
cd ../finsmart-frontend
npm run dev
```

Now visit `http://localhost:3000` — you can type a financial question and receive a real AI response!

---

## Available Scripts

| Command       | What it does                                                       |
|---------------|--------------------------------------------------------------------|
| `npm run dev` | Starts the server with nodemon (auto-restarts when you save a file) |
| `npm start`   | Starts the server once (for production use)                        |

---

## API Endpoints

### `POST /api/chat`

Processes a user message and returns the AI response.

**Request:**
```json
{
  "message":   "How do I calculate my profit margin?",
  "sessionId": "a1b2c3d4-e5f6-..."
}
```

**Success Response (200):**
```json
{
  "reply": "To calculate your **profit margin**, use this formula:\n\n**Profit Margin = (Net Profit ÷ Revenue) × 100%**\n\n..."
}
```

**Error Response (400 — validation failed):**
```json
{
  "error": "Message cannot be empty."
}
```

**Error Response (429 — rate limited):**
```json
{
  "error": "You are sending messages too quickly. Please wait a moment before trying again."
}
```

**Error Response (500 — server error):**
```json
{
  "error": "Something went wrong while generating a response. Please try again."
}
```

### `GET /api/health`

Quick uptime check — no authentication required.

**Response (200):**
```json
{
  "status": "ok",
  "service": "FinSmart AI Backend",
  "timestamp": "2026-04-30T10:00:00.000Z"
}
```

---

## Customising the AI Behaviour

All AI personality, scope, tone, and safety rules are in one file:

```
src/config/systemPrompt.js
```

Edit this file to:
- Add new financial topics the AI should cover
- Change the tone (more formal, more casual)
- Add or remove safety guardrails
- Add few-shot examples for better response formatting

No other file needs to change when you update the system prompt.

---

## How Conversation History Works

Each browser session gets a unique `sessionId` (a UUID generated by the React frontend and kept for the lifetime of the tab). Every message is saved to MongoDB under that sessionId.

On each new request, the controller:
1. Loads the conversation document from MongoDB
2. Slices the **last 20 messages** (10 user + 10 assistant turns)
3. Passes these as context to the Claude API

This means Claude "remembers" the last 10 turns of the conversation. Older messages are kept in MongoDB for records but are not sent to the API.

---

## Iterative Development Status

| Cycle | What is built                                  | Status      |
|-------|------------------------------------------------|-------------|
| 1     | React + Tailwind frontend                      | ✅ Done      |
| 2     | Express.js backend + Claude API + MongoDB      | ✅ This cycle |
| 3     | WhatsApp webhook integration                   | 🔜 Next     |

---

*Built as part of a Final Year Computer Science Project — Lead City University, Ibadan, 2026.*
*Student: Oluwademilade David AKIODE (LCU/UG/22/24423)*
