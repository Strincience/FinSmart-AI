import MonthlyReportForm from '../components/monthly/MonthlyReportForm.jsx';

export default function MonthlyFinancePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-white mb-2">Monthly finance report</h1>
        <p className="text-sm text-[#8A9BB0] font-body max-w-3xl">
          A higher-altitude recap at month-end. Totals reconcile with categories automatically so you maintain one source of truth.
        </p>
      </div>
      <MonthlyReportForm />
    </div>
  );
}
