import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

import { formatNaira } from '../../utils/formatNaira.js';

const mutedRevenue = '#4b7fa2';
const mutedExpense = '#6b7280';

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const p = payload[0]?.payload || {};
  return (
    <div className="rounded-lg border border-white/10 bg-navy-900/95 px-3 py-2 text-xs shadow-card">
      <p className="text-[11px] text-[#94a3b8] mb-1">{p.label}</p>
      <p className="text-teal-200">Revenue: {formatNaira(p.revenue)}</p>
      <p className="text-slate-300">Expenses: {formatNaira(p.expenses)}</p>
    </div>
  );
}

export default function RevenueExpenseChart({ chart }) {
  const data =
    chart?.map((row) => {
      const label = typeof row.label === 'string' ? row.label : '';
      const [Y, M] = label.split('-');
      const short = Y && M ? `${M}/${Y.slice(2)}` : label;
      return {
        label: short,
        revenue: row.revenue,
        expenses: row.expenses,
      };
    }) ?? [];

  if (!data.length) {
    return (
      <section className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
        <p className="text-sm text-[#8A9BB0] font-body">
          Log daily sales or monthly summaries to populate this chart.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-lg text-white">Revenue vs expenses</h2>
        <span className="text-xs text-[#8A9BB0] uppercase tracking-[0.12em] hidden sm:inline">
          Last 6 months
        </span>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(148,163,184,0.12)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#8A9BB0', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(148,163,184,0.2)' }}
            />
            <YAxis
              tick={{ fill: '#8A9BB0', fontSize: 11 }}
              axisLine={false}
              tickFormatter={(v) => {
                const abs = Math.abs(v);
                if (abs >= 1e6) return `₦${(v / 1e6).toFixed(1)}m`;
                if (abs >= 1e3) return `₦${Math.round(v / 1e3)}k`;
                return formatNaira(v);
              }}
              width={56}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(15,118,110,0.08)' }} />
            <Legend
              formatter={(value) =>
                (
                  <span className="text-xs text-[#cbd5f5] capitalize">{value}</span>
                )}
            />
            <Bar dataKey="revenue" name="Revenue" fill={mutedRevenue} radius={[8, 8, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill={mutedExpense} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
