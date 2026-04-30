/* ─── src/App.jsx ────────────────────────────────────────────────────────────
   The root component. It owns two pieces of state:
     - messages  : the full array of conversation turns shown in the chat window
     - isLoading : a boolean that shows the typing indicator while waiting for
                   the AI response from the backend

   It passes these down as props to child components. This pattern keeps all
   the "brain" in one place so you can see the entire data flow at a glance.
── ─────────────────────────────────────────────────────────────────────────── */

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import Header      from './components/Header.jsx';
import ChatWindow  from './components/ChatWindow.jsx';
import ChatInput   from './components/ChatInput.jsx';

// ── Session ID ────────────────────────────────────────────────────────────────
// We generate a single sessionId when the browser tab opens and keep it for
// the lifetime of the page. This is sent with every message so the backend
// can retrieve the conversation history from MongoDB for that user session.
const SESSION_ID = uuidv4();

export default function App() {
  // messages: array of { id, role, text, timestamp }
  //   role is either 'user' or 'assistant'
  const [messages, setMessages] = useState([]);

  // isLoading: true while we're waiting for the backend to reply
  const [isLoading, setIsLoading] = useState(false);

  // ── sendMessage ─────────────────────────────────────────────────────────────
  // This function is called by ChatInput when the user submits a query.
  // It:
  //   1. Appends the user's message to the local messages array immediately
  //      (so the UI feels instant)
  //   2. Sends the message to the Express backend via POST /api/chat
  //   3. Appends the AI's response once it arrives
  //   4. Handles errors gracefully by showing an error message in the chat
  const sendMessage = useCallback(async (userText) => {
    // Guard — don't send empty strings
    if (!userText.trim()) return;

    // Build the user message object
    const userMessage = {
      id:        uuidv4(),
      role:      'user',
      text:      userText.trim(),
      timestamp: new Date(),
    };

    // Append user message to the chat immediately
    setMessages((prev) => [...prev, userMessage]);

    // Show the typing indicator
    setIsLoading(true);

    try {
      // POST to the backend. The Vite proxy (vite.config.js) forwards this
      // to http://localhost:5000/api/chat automatically during development.
      const response = await axios.post('/api/chat', {
        message:   userText.trim(),
        sessionId: SESSION_ID,
      });

      // Build the assistant message from the response
      const assistantMessage = {
        id:        uuidv4(),
        role:      'assistant',
        text:      response.data.reply,
        timestamp: new Date(),
      };

      // Append the AI reply to the chat
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      // If anything goes wrong, show a friendly error message instead of
      // crashing or showing nothing. Check the browser console for details.
      console.error('FinSmart API error:', error);

      const errorMessage = {
        id:        uuidv4(),
        role:      'assistant',
        text:      'I\'m having trouble connecting right now. Please check that the backend server is running on port 5000, then try again.',
        timestamp: new Date(),
        isError:   true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      // Always hide the typing indicator when done, regardless of success/failure
      setIsLoading(false);
    }
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────────
  // The layout is a full-height flex column:
  //   Header (fixed height at top)
  //   ChatWindow (fills remaining space, scrollable)
  //   ChatInput (fixed height at bottom)
  return (
    <div className="flex flex-col h-full max-h-screen overflow-hidden">
      <Header />

      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onPromptClick={sendMessage}
      />

      <ChatInput
        onSend={sendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}
