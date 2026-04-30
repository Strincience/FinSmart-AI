/* ─── src/components/TypingIndicator.jsx ────────────────────────────────────
   A small animated component shown while the AI is generating a response.
   It mimics the "..." typing bubble seen in messaging apps, with three dots
   that pulse in sequence using the 'dot-pulse' keyframe in tailwind.config.js.

   This component receives no props.
── ─────────────────────────────────────────────────────────────────────────── */

import FinSmartLogo from './FinSmartLogo.jsx';

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 animate-fade-up">
      {/* Small logo avatar on the left, matching assistant messages */}
      <div className="flex-shrink-0">
        <FinSmartLogo size={32} />
      </div>

      {/* Bubble */}
      <div
        className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm"
        style={{
          background: 'linear-gradient(135deg, #0f2d45 0%, #0d2640 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderLeft: '3px solid #C9922C',
        }}
      >
        {/* Three dots, each delayed slightly to create the wave effect */}
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="block w-2 h-2 rounded-full"
            style={{
              backgroundColor: '#4EC9B0',
              animation: 'dotPulse 1.2s ease-in-out infinite',
              animationDelay: `${delay}ms`,
            }}
          />
        ))}

        <span
          className="ml-2 text-xs"
          style={{ color: '#8A9BB0', fontFamily: 'Lato, sans-serif' }}
        >
          FinSmart is thinking...
        </span>
      </div>
    </div>
  );
}
