import { useEffect, useState } from 'react';

import client from '../api/client';
import FinancialHealthScore from '../components/dashboard/FinancialHealthScore.jsx';
import MonthAtAGlance from '../components/dashboard/MonthAtAGlance.jsx';
import QuickActions from '../components/dashboard/QuickActions.jsx';
import RecentTransactions from '../components/dashboard/RecentTransactions.jsx';
import RevenueExpenseChart from '../components/dashboard/RevenueExpenseChart.jsx';
import WelcomeBanner from '../components/dashboard/WelcomeBanner.jsx';

function monthQueryParam() {
  const d = new Date();
  const mm = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  return mm;
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: res } = await client.get('/dashboard/summary', {
          params: { month: monthQueryParam() },
        });
        if (!cancelled) {
          setData(res);
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.error || 'Could not load dashboard.');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-100 text-sm font-body">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-[#8A9BB0] font-body">Loading dashboard…</div>
    );
  }

  const { meta, totals, cashFlowStatus, score, chart, recentTransactions } = data;

  return (
    <div className="space-y-10">
      <WelcomeBanner businessName={meta.businessName || 'friend'} />

      <div className="grid xl:grid-cols-[260px,minmax(0,1fr)] gap-10 items-start">
        <FinancialHealthScore score={score} />
        <div className="space-y-8">
          <MonthAtAGlance totals={totals} cashFlowStatus={cashFlowStatus} />
          <RevenueExpenseChart chart={chart} />
          <RecentTransactions rows={recentTransactions} />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
