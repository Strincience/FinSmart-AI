/* ─── src/components/ChatWindow.jsx ─────────────────────────────────────────
   The scrollable area that holds all messages in the conversation.

   Behaviour:
   - When there are no messages, it shows the WelcomeScreen instead.
   - As messages arrive it renders each one using the Message component.
   - When isLoading is true it renders the TypingIndicator at the bottom.
   - It automatically scrolls to the bottom every time a new message is added
     or the loading indicator appears/disappears.

   Props:
     messages  (array)   — the array of message objects from App.jsx state
     isLoading (boolean) — whether the AI is currently generating a response
── ─────────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef } from 'react';
import Message         from './Message.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import WelcomeScreen   from './WelcomeScreen.jsx';

export default function ChatWindow({ messages, isLoading, onPromptClick }) {
  // We keep a ref to the invisible sentinel div at the bottom of the list.
  // scrollIntoView() on this element scrolls the window to the bottom.
  const bottomRef = useRef(null);

  // Auto-scroll effect: runs whenever messages or isLoading change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return (
    <main
      className="flex-1 overflow-y-auto px-4 py-4"
      // Constrain the readable line length for comfortable reading on large screens
      style={{ scrollbarGutter: 'stable' }}
    >
      {/* ── Empty state ───────────────────────────────────────────────── */}
      {messages.length === 0 && !isLoading && (
        <WelcomeScreen onPromptClick={onPromptClick} />
      )}

      {/* ── Message list ──────────────────────────────────────────────── */}
      {messages.length > 0 && (
        <div className="flex flex-col gap-5 max-w-3xl mx-auto">
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))}

          {/* Typing indicator shown while waiting for the AI */}
          {isLoading && <TypingIndicator />}

          {/* Invisible sentinel at the bottom — scrolled into view automatically */}
          <div ref={bottomRef} className="h-2" aria-hidden="true" />
        </div>
      )}

      {/* Handle the edge case: still loading but no messages yet (first query) */}
      {messages.length === 0 && isLoading && (
        <div className="flex justify-center pt-8">
          <div className="max-w-3xl w-full">
            <TypingIndicator />
          </div>
        </div>
      )}
    </main>
  );
}
