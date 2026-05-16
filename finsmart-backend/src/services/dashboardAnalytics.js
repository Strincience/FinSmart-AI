function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}

function bandLabel(ratio, margin) {
  if (margin < 0 || ratio < 0.3) return 'Critical';
  if (ratio >= 0.85 && margin >= 0.05) return 'Healthy';
  return 'Watch';
}

function computeHealthScore({ profile, monthRevenue, monthExpenses, cashReceived, avgMargin6m }) {
  let score = 68;

  if (profile?.outstandingLoans) score -= 8;
  if (profile?.tracksFinances === 'no') score -= 10;
  else if (profile?.tracksFinances === 'yes_manual') score += 2;

  const ch = profile?.financialChallenges;
  if (Array.isArray(ch) && ch.length >= 5) score -= 6;
  else if (Array.isArray(ch) && ch.includes('Managing cash flow')) score -= 5;

  const denom = Math.max(monthRevenue, 1);
  const margin = (monthRevenue - monthExpenses) / denom;
  if (margin > 0.2) score += 10;
  else if (margin > 0.08) score += 4;
  else if (margin < 0) score -= 18;

  const cashRatio = monthRevenue > 0 ? clamp(cashReceived / denom, 0, 1.5) : 1;
  if (cashRatio < 0.45) score -= 10;
  else if (cashRatio < 0.7) score -= 4;
  else if (cashRatio >= 0.95 && monthRevenue > 0) score += 4;

  if (typeof avgMargin6m === 'number') {
    if (avgMargin6m > 0.12) score += 4;
    else if (avgMargin6m < -0.05) score -= 8;
  }

  return Math.round(clamp(score, 0, 100));
}

const mongoose = require('mongoose');

async function monthTotals(DailyEntry, userId, year, month1to12) {
  const y = year;
  const m = month1to12;
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999));

  const agg = await DailyEntry.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: null,
        revenue: { $sum: '$totalSales' },
        expenses: { $sum: '$totalExpenses' },
        cashReceived: { $sum: '$cashReceived' },
      },
    },
  ]);

  if (!agg.length) {
    return { revenue: 0, expenses: 0, cashReceived: 0 };
  }
  const [a] = agg;
  return {
    revenue: a.revenue,
    expenses: a.expenses,
    cashReceived: a.cashReceived,
  };
}

async function lastSixMonthsSeries(DailyEntry, userId, anchorYear, anchorMonth) {
  const pts = [];
  let y = anchorYear;
  let mo = anchorMonth;

  for (let i = 0; i < 6; i++) {
    const totals = await monthTotals(DailyEntry, userId, y, mo);
    pts.unshift({
      year: y,
      month: mo,
      label: `${y}-${String(mo).padStart(2, '0')}`,
      revenue: totals.revenue,
      expenses: totals.expenses,
    });

    mo -= 1;
    if (mo === 0) {
      mo = 12;
      y -= 1;
    }
  }

  return pts;
}

module.exports = {
  bandLabel,
  clamp,
  computeHealthScore,
  monthTotals,
  lastSixMonthsSeries,
};
