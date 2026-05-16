import {
  BUSINESS_TYPES,
  EMPLOYEE_OPTIONS,
  INDUSTRIES,
  INDUSTRIES_COMING_SOON,
  YEARS_OPTIONS,
} from '../../../constants/businessOptions';

function ChoiceCard({ selected, disabled, badge, label, comingSoon, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`text-left rounded-xl border px-4 py-4 font-body text-sm transition-all duration-150 ease-out
        ${selected ? 'border-teal-400 bg-teal-500/10 shadow-card' : 'border-white/[0.08] bg-white/[0.03] hover:border-teal-500/40'}
        ${disabled || comingSoon ? 'opacity-55 cursor-not-allowed' : 'cursor-pointer hover:shadow-card'}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[#e2e8f0]">{label}</span>
        {badge && (
          <span className="text-[10px] uppercase tracking-wide text-gold-400 border border-gold-500/30 rounded-full px-2 py-0.5">
            {badge}
          </span>
        )}
      </div>
    </button>
  );
}

export default function StepBasics({ draft, update }) {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h2 className="font-display text-2xl text-white mb-1">Business basics</h2>
        <p className="text-sm text-[#8A9BB0] font-body">
          Tell us about your venture—this helps personalize your advisor.
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-teal-400 mb-2">
          Business name
        </label>
        <input
          type="text"
          value={draft.businessName}
          onChange={(e) => update({ businessName: e.target.value })}
          placeholder="e.g. Ada Stores"
          className="input-finsmart"
        />
      </div>

      <div className="space-y-3">
        <span className="block text-xs font-semibold uppercase tracking-wide text-teal-400">
          Business type
        </span>
        <div className="grid sm:grid-cols-3 gap-3">
          {BUSINESS_TYPES.map((bt) => (
            <ChoiceCard
              key={bt.value}
              label={bt.label}
              selected={draft.businessType === bt.value}
              onClick={() => update({ businessType: bt.value })}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <span className="block text-xs font-semibold uppercase tracking-wide text-teal-400">
          Industry
        </span>
        <div className="grid sm:grid-cols-3 gap-3">
          {INDUSTRIES.map((i) => (
            <ChoiceCard
              key={i.value}
              label={i.label}
              badge="Available"
              selected={draft.industry === i.value}
              onClick={() => update({ industry: i.value })}
            />
          ))}
          {INDUSTRIES_COMING_SOON.map((i) => (
            <ChoiceCard
              key={i.value}
              label={i.label}
              badge="Coming soon"
              comingSoon
              disabled
              selected={false}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <span className="block text-xs font-semibold uppercase tracking-wide text-teal-400">
          Years in operation
        </span>
        <div className="grid sm:grid-cols-2 gap-3">
          {YEARS_OPTIONS.map((o) => (
            <ChoiceCard
              key={o.value}
              label={o.label}
              selected={draft.yearsInOperation === o.value}
              onClick={() => update({ yearsInOperation: o.value })}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <span className="block text-xs font-semibold uppercase tracking-wide text-teal-400">
          Number of employees
        </span>
        <div className="grid sm:grid-cols-2 gap-3">
          {EMPLOYEE_OPTIONS.map((o) => (
            <ChoiceCard
              key={o.value}
              label={o.label}
              selected={draft.employeeCount === o.value}
              onClick={() => update({ employeeCount: o.value })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
