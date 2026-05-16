# FinSmart AI — Frontend

> Conversational AI-Based System to Foster Financial Intelligence Among Small and Medium-Sized Entrepreneurs in Nigeria.

---

## Project Overview

FinSmart AI is a single-page web application that gives Nigerian SME operators an always-available, conversational financial advisor. Users type natural language questions about their business finances — budgeting, profit margins, cash flow, fraud prevention, loans, and more — and receive clear, structured, pedagogically designed guidance powered by a Large Language Model (LLM) on the backend.

This repository contains the **React + Tailwind CSS frontend only**. The Express.js backend lives in a separate folder (to be created in the next iteration).

---

## Tech Stack

| Layer        | Technology        | Version  | Purpose                                      |
|--------------|-------------------|----------|----------------------------------------------|
| Framework    | React             | 18.x     | Component-based UI                           |
| Styling      | Tailwind CSS      | 3.x      | Utility-first responsive styling             |
| Build tool   | Vite              | 5.x      | Dev server, hot reload, production bundler   |
| HTTP client  | Axios             | 1.x      | Sends POST requests to the Express backend   |
| Markdown     | react-markdown    | 9.x      | Renders AI responses with bold/bullets/etc.  |
| ID generator | uuid              | 10.x     | Creates unique IDs for each message          |

---

## File Structure

```
finsmart-frontend/
│
├── public/
│   └── favicon.svg               ← SVG icon (also used as browser favicon)
│
├── src/
│   ├── components/
│   │   ├── FinSmartLogo.jsx      ← Reusable SVG logo component
│   │   ├── Header.jsx            ← Top navigation bar
│   │   ├── WelcomeScreen.jsx     ← Empty-state with prompt suggestions
│   │   ├── ChatWindow.jsx        ← Scrollable message list area
│   │   ├── Message.jsx           ← Individual user / assistant bubble
│   │   ├── TypingIndicator.jsx   ← Animated "AI is thinking..." dots
│   │   └── ChatInput.jsx         ← Textarea + Send button at the bottom
│   │
│   ├── App.jsx                   ← Root component — owns all state
│   ├── main.jsx                  ← React entry point (mounts App into #root)
│   └── index.css                 ← Tailwind directives + CSS variables
│
├── index.html                    ← HTML shell (Vite injects JS here)
├── vite.config.js                ← Vite config + dev proxy to backend
├── tailwind.config.js            ← Custom colours, fonts, animations
├── postcss.config.js             ← Required by Tailwind
├── package.json                  ← Dependencies and scripts
└── README.md                     ← This file
```

---

## How Data Flows

```
User types a message
       │
       ▼
  ChatInput.jsx  ──onSend──▶  App.jsx (sendMessage)
                                   │
                            Append user message
                            to messages[] state
                                   │
                            POST /api/chat  ──────▶  Express backend
                                                        (port 5000)
                                   │
                            ◀──── { reply: "..." }
                                   │
                            Append assistant message
                            to messages[] state
                                   │
                                   ▼
                          ChatWindow renders
                          all messages via
                          Message.jsx
```

The Vite dev proxy (in `vite.config.js`) transparently forwards any request from the React app at `localhost:3000/api/*` to `localhost:5000/api/*`, so you never hard-code backend URLs in your React code.

---

## Prerequisites

Before you begin, make sure you have the following installed on your machine:

- **Node.js** v18 or higher — download from [nodejs.org](https://nodejs.org)
- **npm** v9+ (comes bundled with Node.js)

To verify:
```bash
node --version   # should print v18.x.x or higher
npm --version    # should print 9.x.x or higher
```

---

## Local Setup (Step by Step)

### Step 1 — Navigate into the frontend folder

```bash
cd finsmart-frontend
```

### Step 2 — Install all dependencies

This reads `package.json` and downloads all libraries into a `node_modules/` folder.

```bash
npm install
```

You should see a summary like `added 150 packages` with no errors.

### Step 3 — Start the development server

```bash
npm run dev
```

Vite will start and print something like:

```
  VITE v5.x.x  ready in 400ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Step 4 — Open in your browser

Go to **http://localhost:3000** in Chrome, Firefox, or Edge.

> **Note:** The chat input and suggestion cards will work visually, but actual AI responses require the Express.js backend to be running on port 5000. If the backend is not running, submitting a message will show a friendly error bubble in the chat — this is expected behaviour.

---

## Available Scripts

| Command         | What it does                                                  |
|-----------------|---------------------------------------------------------------|
| `npm run dev`   | Starts the Vite development server with hot reload on port 3000 |
| `npm run build` | Compiles and optimises the app into a `dist/` folder for deployment |
| `npm run preview` | Serves the production `dist/` build locally for testing     |

---

## Connecting to the Backend

The frontend expects an Express.js backend running at `http://localhost:5000` with the following endpoint:

### `POST /api/chat`

**Request body:**
```json
{
  "message":   "How do I calculate my profit margin?",
  "sessionId": "some-unique-uuid-string"
}
```

**Response body:**
```json
{
  "reply": "To calculate your profit margin, use the formula:\n\n**Profit Margin = (Net Profit / Revenue) × 100%**\n\n..."
}
```

The backend is built with Node.js + Express.js and will be developed in the next iteration of this project.

---

## Design System

### Colour Palette

| Token           | Hex       | Usage                              |
|-----------------|-----------|------------------------------------|
| `navy-800`      | `#0D2137` | Primary background, header         |
| `navy-900`      | `#070f1c` | Deep background, footer            |
| `teal-500`      | `#0B7A75` | Accent, online status, send button |
| `gold-400`      | `#C9922C` | AI message left border, highlights |
| `gold-300`      | `#F0C060` | Hover states, spark in logo        |

### Typography

| Font               | Usage                                  |
|--------------------|----------------------------------------|
| Playfair Display   | Display headings (app name, welcome H1) |
| IBM Plex Mono      | User message text (gives a "typed" feel) |
| Lato               | UI copy, labels, AI response body text  |

### Custom Animations (defined in `tailwind.config.js`)

| Class           | Effect                                          |
|-----------------|-------------------------------------------------|
| `animate-fade-up` | New messages slide up and fade in            |
| `animate-blink`   | Cursor blink (available for future use)      |
| `animate-dot-pulse` | Three-dot typing indicator wave animation  |

---

## Iterative Development Plan

This codebase follows the **iterative prototyping** approach described in Chapter 3 of the project report.

| Cycle | What was built                                  | Status      |
|-------|-------------------------------------------------|-------------|
| 1     | Frontend scaffold, layout, chat UI, mock state  | ✅ This cycle |
| 2     | Express.js backend, Claude API integration, MongoDB session management | 🔜 Next |
| 3     | WhatsApp webhook, NLP pipeline, UAT refinements | 🔜 Later    |

---

## Academic Context

This frontend is the **Presentation Tier** of the three-tier architecture described in the project's Chapter 3 (Section 3.4.2):

> *"The Presentation Tier is implemented as a Single-Page Application (SPA) using the React.js JavaScript library... Styling is implemented using Tailwind CSS... HTTP communication between the React frontend and the Node.js backend is managed using the Axios library."*

---

## Troubleshooting

**"npm install" fails with permission errors**
Run with `sudo npm install` on Linux/Mac, or run your terminal as Administrator on Windows.

**Port 3000 already in use**
Change the port in `vite.config.js`: `server: { port: 3001 }`.

**Messages send but AI doesn't respond**
Make sure your Express.js backend is running on port 5000. Check the browser console (F12 → Console) for the exact error.

**Fonts not loading**
You need an internet connection on first load for Google Fonts. The fonts are then cached by the browser.

---

*Built as part of a Final Year Computer Science Project — Lead City University, Ibadan, 2026.*
*Student: Oluwademilade David AKIODE (LCU/UG/22/24423)*
*Supervisor: Dr. John Dewole*
