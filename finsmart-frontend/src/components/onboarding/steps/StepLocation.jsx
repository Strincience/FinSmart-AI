import { NIGERIAN_STATES } from '../../../constants/nigerianStates.js';
import { SALES_CHANNELS } from '../../../constants/businessOptions';

function Toggle({ selected, label, value, group, onPick }) {
  return (
    <button
      type="button"
      onClick={() => onPick(group, value)}
      className={`rounded-xl border px-4 py-3 text-sm font-body transition-all duration-150 ease-out
        ${selected ? 'border-teal-400 bg-teal-500/10 shadow-card' : 'border-white/[0.08] bg-white/[0.03] hover:border-teal-500/40'}
      `}
    >
      {label}
    </button>
  );
}

export default function StepLocation({ draft, update }) {
  function setAccounting(yes, name = '') {
    update({
      usesAccountingSoftware: yes,
      accountingSoftwareName: yes ? name : '',
    });
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h2 className="font-display text-2xl text-white mb-1">Location &amp; operations</h2>
        <p className="text-sm text-[#8A9BB0] font-body">
          How does your business show up in the world day to day?
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-teal-400 mb-2">
          State of operation
        </label>
        <select
          value={draft.stateOfOperation}
          onChange={(e) => update({ stateOfOperation: e.target.value })}
          className="input-finsmart"
        >
          <option value="">Select state</option>
          {NIGERIAN_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <span className="block text-xs font-semibold uppercase tracking-wide text-teal-400">
          Primary sales channel
        </span>
        <div className="grid sm:grid-cols-3 gap-3">
          {SALES_CHANNELS.map((ch) => (
            <Toggle
              key={ch.value}
              group="primarySalesChannel"
              value={ch.value}
              label={ch.label}
              selected={draft.primarySalesChannel === ch.value}
              onPick={(_, val) => update({ primarySalesChannel: val })}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <span className="block text-xs font-semibold uppercase tracking-wide text-teal-400">
          Registered with CAC?
        </span>
        <div className="flex gap-3">
          <Toggle
            group="cac"
            value
            label="Yes"
            selected={draft.hasCAC === true}
            onPick={() => update({ hasCAC: true })}
          />
          <Toggle
            group="cac"
            value={false}
            label="No"
            selected={draft.hasCAC === false}
            onPick={() => update({ hasCAC: false })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <span className="block text-xs font-semibold uppercase tracking-wide text-teal-400">
          Do you currently use accounting software?
        </span>
        <div className="flex flex-wrap gap-3">
          <Toggle
            group="acct"
            value
            label="Yes"
            selected={draft.usesAccountingSoftware === true}
            onPick={() => setAccounting(true, draft.accountingSoftwareName)}
          />
          <Toggle
            group="acct"
            value={false}
            label="No"
            selected={draft.usesAccountingSoftware === false}
            onPick={() => setAccounting(false)}
          />
        </div>
        {draft.usesAccountingSoftware === true && (
          <input
            type="text"
            value={draft.accountingSoftwareName}
            onChange={(e) => update({ accountingSoftwareName: e.target.value })}
            placeholder="Which software?"
            className="input-finsmart mt-2"
          />
        )}
      </div>
    </div>
  );
}
