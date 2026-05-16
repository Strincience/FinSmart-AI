import {
  CHALLENGE_OPTS,
  EXPENSE_BANDS,
  REVENUE_BANDS,
  TRACK_OPTIONS,
} from '../../../constants/businessOptions';

function BandCard({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-3 text-xs sm:text-sm font-body text-left transition-all duration-150 ease-out leading-snug
        ${selected ? 'border-teal-400 bg-teal-500/10 shadow-card' : 'border-white/[0.08] bg-white/[0.03] hover:border-teal-500/40'}
      `}
    >
      {label}
    </button>
  );
}

export default function StepFinanceSnapshot({ draft, update }) {
  function toggleChallenge(ch) {
    const set = new Set(draft.financialChallenges);
    if (set.has(ch)) set.delete(ch); else set.add(ch);
    update({ financialChallenges: [...set] });
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h2 className="font-display text-2xl text-white mb-1">Financial snapshot</h2>
        <p className="text-sm text-[#8A9BB0] font-body">
          Honest estimates are fine—we use this for your dashboard and guidance.
        </p>
      </div>

      <div className="space-y-3">
        <span className="block text-xs font-semibold uppercase tracking-wide text-teal-400">
          Estimated average monthly revenue
        </span>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {REVENUE_BANDS.map((b) => (
            <BandCard
              key={b.value}
              label={b.label}
              selected={draft.avgMonthlyRevenue === b.value}
              onClick={() => update({ avgMonthlyRevenue: b.value })}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <span className="block text-xs font-semibold uppercase tracking-wide text-teal-400">
          Estimated average monthly expenses
        </span>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {EXPENSE_BANDS.map((b) => (
            <BandCard
              key={b.value}
              label={b.label}
              selected={draft.avgMonthlyExpenses === b.value}
              onClick={() => update({ avgMonthlyExpenses: b.value })}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <span className="block text-xs font-semibold uppercase tracking-wide text-teal-400">
          Do you track your business finances today?
        </span>
        <div className="grid gap-3">
          {TRACK_OPTIONS.map((t) => (
            <BandCard
              key={t.value}
              label={t.label}
              selected={draft.tracksFinances === t.value}
              onClick={() => update({ tracksFinances: t.value })}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <span className="block text-xs font-semibold uppercase tracking-wide text-teal-400">
          Biggest financial challenges (pick all that apply)
        </span>
        <div className="grid sm:grid-cols-2 gap-3">
          {CHALLENGE_OPTS.map((c) => (
            <label
              key={c}
              className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all duration-150
                ${draft.financialChallenges.includes(c) ? 'border-teal-400 bg-teal-500/10' : 'border-white/[0.08] bg-white/[0.03]'}
              `}
            >
              <input
                type="checkbox"
                className="mt-1 rounded border-white/20 text-teal-500 focus:ring-teal-400 focus:ring-offset-navy-900"
                checked={draft.financialChallenges.includes(c)}
                onChange={() => toggleChallenge(c)}
              />
              <span className="text-sm text-[#e2e8f0] font-body">{c}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <span className="block text-xs font-semibold uppercase tracking-wide text-teal-400">
          Outstanding business loans?
        </span>
        <div className="flex gap-3">
          <BandCard label="Yes" selected={draft.outstandingLoans === true} onClick={() => update({ outstandingLoans: true })} />
          <BandCard label="No" selected={draft.outstandingLoans === false} onClick={() => update({ outstandingLoans: false })} />
        </div>
      </div>
    </div>
  );
}
