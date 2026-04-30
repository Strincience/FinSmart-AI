/* ─── src/components/Header.jsx ─────────────────────────────────────────────
   The top bar of the application. It displays:
     - The FinSmart logo (SVG)
     - The app name and tagline
     - A status badge showing "AI Online"

   This component receives no props — it is purely presentational.
── ─────────────────────────────────────────────────────────────────────────── */

import FinSmartLogo from './FinSmartLogo.jsx';

export default function Header() {
  return (
    <header
      className="
        flex-shrink-0
        flex items-center justify-between
        px-5 py-3
        border-b border-white/[0.07]
      "
      style={{
        background: 'linear-gradient(90deg, rgba(13,33,55,0.95) 0%, rgba(7,15,28,0.98) 100%)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* ── Left: logo + name ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <FinSmartLogo size={42} />

        <div className="flex flex-col leading-tight">
          {/* App name uses our display (serif) font for character */}
          <span
            className="text-white font-bold tracking-wide"
            style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.15rem' }}
          >
            FinSmart AI
          </span>

          {/* Tagline in small muted text */}
          <span className="text-xs font-body" style={{ color: '#8A9BB0' }}>
            Your financial intelligence companion
          </span>
        </div>
      </div>

      {/* ── Right: status badge ───────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {/* Animated green pulse dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
            style={{ backgroundColor: '#0B7A75' }}
          />
          <span
            className="relative inline-flex rounded-full h-2.5 w-2.5"
            style={{ backgroundColor: '#4EC9B0' }}
          />
        </span>

        <span className="text-xs font-body" style={{ color: '#4EC9B0', fontWeight: 500 }}>
          AI Online
        </span>
      </div>
    </header>
  );
}
