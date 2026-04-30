/* ─── src/components/Message.jsx ────────────────────────────────────────────
   Renders a single message bubble. The visual treatment depends on role:

   USER messages:
     - Right-aligned
     - Solid navy-blue pill
     - White text, monospace font (distinct from the assistant)

   ASSISTANT messages:
     - Left-aligned
     - Gradient dark-navy panel with a subtle gold-left border
     - Rendered as markdown (bold, bullet points, etc. from the AI response)
     - Small FinSmart logo avatar

   Props:
     message — object with { id, role, text, timestamp, isError? }
── ─────────────────────────────────────────────────────────────────────────── */

import ReactMarkdown from 'react-markdown';
import FinSmartLogo from './FinSmartLogo.jsx';

// Helper: format a Date object to "HH:MM" time string
function formatTime(date) {
  return date instanceof Date
    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';
}

export default function Message({ message }) {
  const isUser      = message.role === 'user';
  const isError     = !!message.isError;

  return (
    // Outer row — flex direction flips depending on role
    <div
      className={`
        flex items-end gap-3 w-full
        animate-fade-up
        ${isUser ? 'flex-row-reverse' : 'flex-row'}
      `}
    >
      {/* ── Avatar ──────────────────────────────────────────────────── */}
      {isUser ? (
        // User avatar — simple monogram circle
        <div
          className="
            flex-shrink-0 w-8 h-8 rounded-full
            flex items-center justify-center
            text-xs font-bold text-white
            select-none
          "
          style={{ background: 'linear-gradient(135deg, #1d5a92, #0f437a)' }}
          aria-hidden="true"
        >
          ME
        </div>
      ) : (
        // Assistant avatar — FinSmart logo
        <div className="flex-shrink-0">
          <FinSmartLogo size={32} />
        </div>
      )}

      {/* ── Bubble ──────────────────────────────────────────────────── */}
      <div
        className={`
          relative max-w-[75%] rounded-2xl px-4 py-3
          ${isUser
            ? 'rounded-br-sm'     // small notch toward avatar
            : 'rounded-bl-sm'
          }
        `}
        style={
          isUser
            ? {
                background: 'linear-gradient(135deg, #1d5a92 0%, #0f437a 100%)',
                boxShadow: '0 2px 12px rgba(13,33,55,0.5)',
              }
            : isError
            ? {
                background: 'rgba(139,32,32,0.25)',
                border: '1px solid rgba(139,32,32,0.4)',
              }
            : {
                background: 'linear-gradient(135deg, #0f2d45 0%, #0d2640 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderLeft: '3px solid #C9922C',
                boxShadow: '0 2px 16px rgba(0,0,0,0.3)',
              }
        }
      >
        {isUser ? (
          // User text — plain, monospace for a "typed" feel
          <p
            className="text-sm text-white leading-relaxed"
            style={{ fontFamily: '"IBM Plex Mono", monospace', wordBreak: 'break-word' }}
          >
            {message.text}
          </p>
        ) : (
          // Assistant text — rendered as Markdown for rich formatting
          <div
            className="
              text-sm leading-relaxed
              prose prose-invert prose-sm
              max-w-none
              prose-p:my-1
              prose-ul:my-1 prose-li:my-0.5
              prose-strong:text-gold-300
              prose-headings:text-white
              prose-code:text-teal-400
            "
            style={{
              color: isError ? '#fca5a5' : '#d1dce8',
              fontFamily: 'Lato, sans-serif',
            }}
          >
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
        )}

        {/* Timestamp */}
        <p
          className={`text-[10px] mt-1.5 select-none ${isUser ? 'text-right' : 'text-left'}`}
          style={{ color: 'rgba(255,255,255,0.28)' }}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
