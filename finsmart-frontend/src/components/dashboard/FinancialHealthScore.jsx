export default function FinancialHealthScore({ score }) {
  const s = Math.round(Number(score) || 0);
  const clamped = Math.min(100, Math.max(0, s));
  const color =
    clamped < 40 ? '#ef4444' : clamped <= 70 ? '#fbbf24' : '#34d399';

  const r = 56;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;

  return (
    <section className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-card flex flex-col items-center justify-center text-center gap-4">
      <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8A9BB0]">
        Financial health score
      </h2>

      <div className="relative w-36 h-36 mx-auto">
        <svg viewBox="0 0 144 144" className="-rotate-90 w-36 h-36 drop-shadow-none">
          <circle
            cx="72"
            cy="72"
            r={r}
            stroke="rgba(148,163,184,0.18)"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="72"
            cy="72"
            r={r}
            stroke={color}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl text-white">{clamped}</span>
          <span className="text-xs text-[#8A9BB0] font-body mt-1">of 100</span>
        </div>
      </div>

      <p className="text-xs text-[#8A9BB0] font-body max-w-[240px]">
        Indicative score from your onboarding snapshot and tracked activity—not financial advice.
      </p>
    </section>
  );
}
