/* ─── src/components/ChatInput.jsx ──────────────────────────────────────────
   The input area fixed to the bottom of the page.

   Features:
   - A growing textarea (auto-expands up to 6 lines as the user types)
   - Submit on Enter key (Shift+Enter inserts a newline, as expected)
   - Submit button with an arrow icon
   - Both are disabled while isLoading is true
   - A character count warning appears when approaching the 1000-char limit

   Props:
     onSend    (function) — called with the message string when submitted
     isLoading (boolean)  — disables input while the AI is responding
── ─────────────────────────────────────────────────────────────────────────── */

import { useState, useRef, useCallback } from 'react';

const MAX_CHARS = 1000;

export default function ChatInput({ onSend, isLoading }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // ── Submit handler ─────────────────────────────────────────────────────────
  const handleSubmit = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    onSend(trimmed);
    setText('');

    // Reset textarea height after clearing
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [text, isLoading, onSend]);

  // ── Key handler — Enter to submit, Shift+Enter for newline ────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();   // prevent default newline
      handleSubmit();
    }
  };

  // ── Auto-grow the textarea as the user types ───────────────────────────────
  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length > MAX_CHARS) return;   // hard cap

    setText(value);

    // Reset to auto, then set to scrollHeight so it grows/shrinks naturally
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      // Clamp to roughly 6 lines (144px)
      el.style.height = `${Math.min(el.scrollHeight, 144)}px`;
    }
  };

  const charsLeft    = MAX_CHARS - text.length;
  const isNearLimit  = charsLeft <= 100;
  const canSubmit    = text.trim().length > 0 && !isLoading;

  return (
    <footer
      className="flex-shrink-0 px-4 py-3 border-t border-white/[0.06]"
      style={{
        background: 'linear-gradient(180deg, rgba(7,15,28,0) 0%, rgba(7,15,28,0.97) 20%)',
      }}
    >
      {/* Inner container — constrain width to match ChatWindow */}
      <div className="max-w-3xl mx-auto">
        {/* ── Textarea + Send button row ───────────────────────────── */}
        <div
          className="flex items-end gap-3 rounded-2xl px-4 py-3"
          style={{
            background: 'rgba(13,33,55,0.85)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 0 0 0 transparent',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          // Highlight the border on focus-within
          onFocusCapture={(e) => {
            e.currentTarget.style.borderColor = 'rgba(11,122,117,0.55)';
            e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(11,122,117,0.12)';
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)';
            e.currentTarget.style.boxShadow   = 'none';
          }}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
            placeholder="Ask me anything about your business finances..."
            className="
              flex-1 resize-none bg-transparent border-none
              text-sm text-white placeholder-gray-600
              leading-relaxed
              disabled:opacity-40
            "
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '0.85rem',
              minHeight: '24px',
              maxHeight: '144px',
              overflow: 'auto',
            }}
            aria-label="Type your financial question"
          />

          {/* Send button */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="
              flex-shrink-0 w-9 h-9 rounded-xl
              flex items-center justify-center
              transition-all duration-200
              disabled:opacity-30 disabled:cursor-not-allowed
              hover:scale-105 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-teal-500
            "
            style={
              canSubmit
                ? { background: 'linear-gradient(135deg, #0B7A75, #085e5a)', boxShadow: '0 2px 10px rgba(11,122,117,0.4)' }
                : { background: 'rgba(255,255,255,0.06)' }
            }
            aria-label="Send message"
          >
            {/* Arrow-up icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 text-white"
            >
              <path
                fillRule="evenodd"
                d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* ── Character count + hint row ────────────────────────── */}
        <div className="flex justify-between items-center mt-1.5 px-1">
          {/* Keyboard hint */}
          <span className="text-[11px]" style={{ color: '#4a5a6a' }}>
            Press <kbd className="px-1 py-0.5 rounded text-[10px]" style={{ background: 'rgba(255,255,255,0.08)', color: '#8A9BB0' }}>Enter</kbd> to send
            &nbsp;·&nbsp;
            <kbd className="px-1 py-0.5 rounded text-[10px]" style={{ background: 'rgba(255,255,255,0.08)', color: '#8A9BB0' }}>Shift+Enter</kbd> for new line
          </span>

          {/* Character count — only shown when approaching the limit */}
          {isNearLimit && (
            <span
              className="text-[11px]"
              style={{ color: charsLeft <= 20 ? '#f87171' : '#C9922C' }}
            >
              {charsLeft} chars left
            </span>
          )}
        </div>

        {/* ── Disclaimer ────────────────────────────────────────── */}
        <p className="text-center text-[10px] mt-2" style={{ color: '#2e3e4e' }}>
          FinSmart AI may make mistakes. Verify important financial information with a qualified professional.
        </p>
      </div>
    </footer>
  );
}
