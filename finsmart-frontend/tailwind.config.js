/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind only generates classes used in these files (keeps bundle small)
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      // ── Brand colour tokens ───────────────────────────────────────────
      // These let you write e.g. bg-navy-900, text-gold-400 in JSX
      colors: {
        navy: {
          50:  '#e8eef5',
          100: '#c5d4e5',
          200: '#9fb8d3',
          300: '#779bc0',
          400: '#5585b2',
          500: '#2f6ea5',
          600: '#1d5a92',
          700: '#0f437a',
          800: '#0D2137',   // ← primary brand navy (used in header, bg)
          900: '#070f1c',   // ← deepest navy (near-black)
        },
        teal: {
          400: '#4EC9B0',
          500: '#0B7A75',   // ← secondary teal accent
          600: '#085e5a',
        },
        gold: {
          300: '#F0C060',
          400: '#C9922C',   // ← AI response accent / highlights
          500: '#a87520',
        },
      },

      // ── Custom font families ──────────────────────────────────────────
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        mono:    ['"IBM Plex Mono"',    'monospace'],
        body:    ['Lato',               'sans-serif'],
      },

      // ── Keyframes for custom animations ──────────────────────────────
      keyframes: {
        // Smooth fade-up for new messages entering the chat window
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Blinking cursor for the AI typing indicator
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        // Gentle pulse for the loading dots
        dotPulse: {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%':           { transform: 'scale(1.0)', opacity: '1.0' },
        },
      },

      animation: {
        'fade-up':   'fadeUp 0.3s ease-out forwards',
        'blink':     'blink 1s step-end infinite',
        'dot-pulse': 'dotPulse 1.2s ease-in-out infinite',
      },

      transitionDuration: {
        150: '150ms',
      },

      boxShadow: {
        card:       '0 24px 60px rgba(2,12,26,0.55)',
        'card-inner':
          'inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 30px rgba(2,12,26,0.35)',
      },
    },
  },

  plugins: [],
};
