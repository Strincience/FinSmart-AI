import { formatNaira } from '../../utils/formatNaira.js';

function StatCard({ label, value, hint, accent }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-navy-900/50 p-4 shadow-card-inner">
      <p className="text-xs uppercase tracking-[0.12em] text-[#8A9BB0] mb-3">{label}</p>
      <p className={`font-display text-2xl ${accent}`}>{value}</p>
      {hint && <p className="text-[11px] text-[#8A9BB0] mt-2 font-body">{hint}</p>}
    </div>
  );
}

export default function MonthAtAGlance({ totals, cashFlowStatus }) {
  const netPos = totals.netProfit >= 0;

  return (
    <section>
      <h2 className="font-display text-lg text-white mb-4">This month at a glance</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total revenue" value={formatNaira(totals.revenue)} />
        <StatCard label="Total expenses" value={formatNaira(totals.expenses)} />
        <StatCard
          label="Net profit"
          value={formatNaira(totals.netProfit)}
          accent={netPos ? 'text-emerald-400' : 'text-red-400'}
        />
        <StatCard label="Cash flow status" value={cashFlowStatus} hint="Cash collected vs signals" accent="text-gold-300" />
      </div>
    </section>
  );
}
