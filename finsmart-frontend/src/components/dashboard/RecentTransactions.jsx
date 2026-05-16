import { format } from 'date-fns';

import { formatNaira } from '../../utils/formatNaira.js';

export default function RecentTransactions({ rows }) {
  if (!rows?.length) {
    return (
      <section className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-6">
        <h2 className="font-display text-lg text-white mb-2">Recent entries</h2>
        <p className="text-sm text-[#8A9BB0] font-body">No daily sales logged yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 shadow-card">
      <h2 className="font-display text-lg text-white mb-4">Recent daily entries</h2>

      <div className="overflow-x-auto rounded-lg border border-white/[0.07]">
        <table className="min-w-full text-sm font-body">
          <thead className="bg-white/[0.03]">
            <tr className="text-left text-[#8A9BB0] text-xs uppercase tracking-[0.1em]">
              <th className="py-3 px-4 font-medium">Date</th>
              <th className="py-3 px-4 font-medium">Sales</th>
              <th className="py-3 px-4 font-medium">Expenses</th>
              <th className="py-3 px-4 font-medium">Cash in</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row._id} className="border-t border-white/[0.06] hover:bg-white/[0.015] transition-colors duration-150">
                <td className="py-3 px-4 text-[#e2e8f0]">{format(new Date(row.date), 'd MMM yyyy')}</td>
                <td className="py-3 px-4 text-emerald-200">{formatNaira(row.totalSales)}</td>
                <td className="py-3 px-4 text-rose-200">{formatNaira(row.totalExpenses)}</td>
                <td className="py-3 px-4 text-slate-200">{formatNaira(row.cashReceived)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
