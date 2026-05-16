import DailyEntryForm from '../components/daily/DailyEntryForm.jsx';

export default function DailySalesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-white mb-2">Daily sales entry</h1>
        <p className="text-sm text-[#8A9BB0] font-body max-w-2xl">
          Capture revenue, expenses, and how much cash touched your pocket today—the dashboard turns this into actionable signals.
        </p>
      </div>
      <DailyEntryForm />
    </div>
  );
}
