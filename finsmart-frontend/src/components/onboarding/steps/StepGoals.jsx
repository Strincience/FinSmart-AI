import { ENGAGEMENT_OPTS, GOAL_OPTS, LANGUAGE_OPTS } from '../../../constants/businessOptions';

export default function StepGoals({ draft, update }) {
  function toggleGoal(g) {
    const set = new Set(draft.primaryGoals);
    if (set.has(g)) set.delete(g); else set.add(g);
    update({ primaryGoals: [...set] });
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h2 className="font-display text-2xl text-white mb-1">Goals &amp; preferences</h2>
        <p className="text-sm text-[#8A9BB0] font-body">
          We tune FinSmart to match how you work and what matters most.
        </p>
      </div>

      <div className="space-y-3">
        <span className="block text-xs font-semibold uppercase tracking-wide text-teal-400">
          What should FinSmart help you with most? (Pick all that apply)
        </span>
        <div className="grid sm:grid-cols-2 gap-3">
          {GOAL_OPTS.map((g) => (
            <label
              key={g}
              className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all duration-150
                ${draft.primaryGoals.includes(g) ? 'border-teal-400 bg-teal-500/10' : 'border-white/[0.08] bg-white/[0.03]'}
              `}
            >
              <input
                type="checkbox"
                className="mt-1 rounded border-white/20 text-teal-500 focus:ring-teal-400 focus:ring-offset-navy-900"
                checked={draft.primaryGoals.includes(g)}
                onChange={() => toggleGoal(g)}
              />
              <span className="text-sm text-[#e2e8f0] font-body">{g}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <span className="block text-xs font-semibold uppercase tracking-wide text-teal-400">
          How often do you want to engage?
        </span>
        <div className="grid sm:grid-cols-2 gap-3">
          {ENGAGEMENT_OPTS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => update({ engagementFrequency: e })}
              className={`rounded-xl border px-4 py-3 text-sm font-body text-left transition-all duration-150
                ${draft.engagementFrequency === e ? 'border-teal-400 bg-teal-500/10 shadow-card' : 'border-white/[0.08] bg-white/[0.03]'}
              `}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <span className="block text-xs font-semibold uppercase tracking-wide text-teal-400">
          Preferred tone for AI responses
        </span>
        <div className="grid sm:grid-cols-2 gap-3">
          {LANGUAGE_OPTS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => update({ preferredLanguage: l })}
              className={`rounded-xl border px-4 py-3 text-sm font-body text-left transition-all duration-150
                ${draft.preferredLanguage === l ? 'border-teal-400 bg-teal-500/10 shadow-card' : 'border-white/[0.08] bg-white/[0.03]'}
              `}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
