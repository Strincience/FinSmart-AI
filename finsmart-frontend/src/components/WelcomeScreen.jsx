/* ─── src/components/WelcomeScreen.jsx ──────────────────────────────────────
   Shown in the centre of the chat window when there are no messages yet.
   It introduces the assistant and provides four clickable prompt suggestions
   that the user can click to start a conversation instantly.

   Props:
     onPromptClick (function) — called with the prompt string when a suggestion
                                 card is clicked. This propagates up to App.jsx
                                 which calls sendMessage() directly.
── ─────────────────────────────────────────────────────────────────────────── */

import FinSmartLogo from './FinSmartLogo.jsx';

// Pre-written prompt suggestions — chosen to cover the four most common
// financial questions Nigerian SME operators tend to have.
const SUGGESTIONS = [
  {
    icon: '📊',
    title: 'Profit & Loss',
    prompt: 'How do I calculate my profit margin if I sell goods for ₦80,000 that cost me ₦50,000?',
  },
  {
    icon: '💰',
    title: 'Cash Flow',
    prompt: 'My business is profitable but I keep running out of cash. Why does this happen and how can I fix it?',
  },
  {
    icon: '📒',
    title: 'Bookkeeping',
    prompt: 'I am a small business owner with no accounting background. How do I start keeping basic financial records?',
  },
  {
    icon: '🔒',
    title: 'Fraud Prevention',
    prompt: 'How can I protect my business from fake bank alert scams in Nigeria?',
  },
];

export default function WelcomeScreen({ onPromptClick }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-8 text-center">
      {/* Logo */}
      <FinSmartLogo size={72} className="mb-5 drop-shadow-lg" />

      {/* Heading */}
      <h1
        className="text-3xl font-bold text-white mb-2"
        style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
      >
        Welcome to FinSmart AI
      </h1>

      {/* Sub-heading */}
      <p
        className="text-base max-w-md mb-1"
        style={{ color: '#8A9BB0', fontFamily: 'Lato, sans-serif' }}
      >
        Your conversational financial intelligence assistant — built for
        Nigerian small and medium-sized business owners.
      </p>

      <p
        className="text-sm max-w-xs mb-8"
        style={{ color: '#4EC9B0', fontFamily: 'Lato, sans-serif' }}
      >
        Ask me anything about your business finances.
      </p>

      {/* Gold divider rule */}
      <div
        className="w-12 h-0.5 rounded-full mb-8"
        style={{ background: 'linear-gradient(90deg, transparent, #C9922C, transparent)' }}
      />

      {/* Suggestion cards grid */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.title}
            onClick={() => onPromptClick(s.prompt)}
            className="
              group text-left p-4 rounded-xl
              border border-white/[0.08]
              transition-all duration-200
              hover:border-white/20
              hover:scale-[1.02]
              focus:outline-none focus:ring-1 focus:ring-teal-500
            "
            style={{
              background: 'linear-gradient(135deg, rgba(13,33,55,0.7) 0%, rgba(11,44,60,0.6) 100%)',
            }}
          >
            {/* Icon */}
            <span className="text-2xl block mb-2">{s.icon}</span>

            {/* Card title */}
            <span
              className="block text-sm font-bold text-white mb-1 group-hover:text-gold-300 transition-colors"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              {s.title}
            </span>

            {/* Prompt preview — truncated to one line */}
            <span
              className="block text-xs leading-snug line-clamp-2"
              style={{ color: '#8A9BB0' }}
            >
              {s.prompt}
            </span>
          </button>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="mt-8 text-xs max-w-sm" style={{ color: '#4a5a6a' }}>
        FinSmart AI provides financial education and general guidance only.
        For complex matters, please consult a qualified financial advisor or accountant.
      </p>
    </div>
  );
}
