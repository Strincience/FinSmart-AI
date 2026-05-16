const DailyEntry = require('../models/DailyEntry');
const User = require('../models/User');
const {
  computeHealthScore,
  bandLabel,
  monthTotals,
  lastSixMonthsSeries,
} = require('../services/dashboardAnalytics');

async function getSummary(req, res) {
  try {
    const rawMonth = req.query.month;
    let y;
    let m;
    if (!rawMonth || typeof rawMonth !== 'string' || !/^(\d{4})-(\d{2})$/.test(rawMonth.trim())) {
      const now = new Date();
      y = now.getUTCFullYear();
      m = now.getUTCMonth() + 1;
    } else {
      const parts = rawMonth.trim().split('-').map(Number);
      y = parts[0];
      m = parts[1];
    }

    const user = await User.findById(req.user.id);
    const profile = user?.businessProfile || {};

    const totals = await monthTotals(DailyEntry, req.user.id, y, m);
    const netProfit = totals.revenue - totals.expenses;
    const margin = totals.revenue > 0 ? netProfit / totals.revenue : 0;
    const cashRatio = totals.revenue > 0 ? totals.cashReceived / totals.revenue : 1;

    const chart = await lastSixMonthsSeries(DailyEntry, req.user.id, y, m);
    const marginsSix = chart.map((p) => {
      const d = p.revenue - p.expenses;
      return p.revenue > 0 ? d / p.revenue : 0;
    });
    const avgMargin6m = marginsSix.length
      ? marginsSix.reduce((a, b) => a + b, 0) / marginsSix.length
      : 0;

    const score = computeHealthScore({
      profile,
      monthRevenue: totals.revenue,
      monthExpenses: totals.expenses,
      cashReceived: totals.cashReceived,
      avgMargin6m,
    });

    const cashFlowStatus = bandLabel(cashRatio, margin);

    const recent = await DailyEntry.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    const businessName =
      profile.businessName || user?.name || 'your business';

    res.json({
      meta: { year: y, month: m, businessName },
      totals: {
        revenue: totals.revenue,
        expenses: totals.expenses,
        netProfit,
        cashReceived: totals.cashReceived,
      },
      cashFlowStatus,
      score,
      chart,
      recentTransactions: recent,
    });
  } catch (err) {
    console.error('getSummary error:', err);
    res.status(500).json({ error: 'Could not load dashboard.' });
  }
}

module.exports = { getSummary };
