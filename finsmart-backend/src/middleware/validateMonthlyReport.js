function validateMonthlyReport(req, res, next) {
  const b = req.body || {};

  const y = Number(b.year);
  const mo = Number(b.month);
  if (!Number.isInteger(y) || y < 2000 || y > 2100) {
    return res.status(400).json({ error: 'year must be a valid integer.' });
  }
  if (!Number.isInteger(mo) || mo < 1 || mo > 12) {
    return res.status(400).json({ error: 'month must be 1–12.' });
  }

  const revKeys = ['totalMonthlyRevenue', 'revenueFromCreditSales', 'revenueCollectedFromPriorCredit'];
  const expKeys = [
    'costOfGoodsSold',
    'staffSalaries',
    'rentUtilities',
    'transportLogistics',
    'marketingAdvertising',
    'loanRepayments',
    'taxPayments',
    'miscellaneousExpenses',
  ];

  let errMsg = '';
  revKeys.concat(expKeys).forEach((k) => {
    const ok = Number(b[k]);
    if (!Number.isFinite(ok) || ok < 0) errMsg = `Field ${k} must be a non-negative number.`;
  });
  if (errMsg) return res.status(400).json({ error: errMsg });

  const nonNegRev = {};
  revKeys.forEach((k) => {
    nonNegRev[k] = Number(b[k]);
  });

  const nonNegExpParts = {};
  expKeys.forEach((k) => {
    nonNegExpParts[k] = Number(b[k]);
  });

  const sumComputed =
    nonNegExpParts.costOfGoodsSold +
    nonNegExpParts.staffSalaries +
    nonNegExpParts.rentUtilities +
    nonNegExpParts.transportLogistics +
    nonNegExpParts.marketingAdvertising +
    nonNegExpParts.loanRepayments +
    nonNegExpParts.taxPayments +
    nonNegExpParts.miscellaneousExpenses;

  const totalExpDeclared = Number(b.totalExpenses);
  if (!Number.isFinite(totalExpDeclared) || totalExpDeclared < 0) {
    return res.status(400).json({ error: 'totalExpenses invalid.' });
  }

  if (Math.abs(sumComputed - totalExpDeclared) > 5) {
    return res.status(400).json({
      error: 'totalExpenses must match the sum of expense categories (within margin).',
      detail: {
        sumOfCategories: sumComputed,
        totalExpensesProvided: totalExpDeclared,
      },
    });
  }

  const cashFields = ['openingCash', 'closingCash', 'cashAtHand', 'cashInBank'];
  for (const cf of cashFields) {
    const r = Number(b[cf]);
    if (!Number.isFinite(r)) {
      return res.status(400).json({ error: `${cf} must be a number.` });
    }
  }

  const intFields = [['customersServed', 0], ['newCustomers', 0], ['operatingDays', 0]];
  for (const [k, minv] of intFields) {
    const r = Math.round(Number(b[k]));
    if (!Number.isFinite(r) || r < minv) {
      return res.status(400).json({ error: `${k} must be a non-negative integer.` });
    }
  }

  if (typeof b.largeOneOff !== 'boolean') {
    return res.status(400).json({ error: 'largeOneOff must be boolean.' });
  }
  if (typeof b.newAssets !== 'boolean') {
    return res.status(400).json({ error: 'newAssets must be boolean.' });
  }

  if (b.largeOneOff && (!b.largeOneOffDescription || !String(b.largeOneOffDescription).trim())) {
    return res.status(400).json({ error: 'Describe the one-off expense when largeOneOff is true.' });
  }
  if (b.newAssets && (!b.newAssetsDescription || !String(b.newAssetsDescription).trim())) {
    return res.status(400).json({ error: 'Describe the asset when newAssets is true.' });
  }

  const doc = {
    year: y,
    month: mo,
    totalMonthlyRevenue: nonNegRev.totalMonthlyRevenue,
    revenueFromCreditSales: nonNegRev.revenueFromCreditSales,
    revenueCollectedFromPriorCredit: nonNegRev.revenueCollectedFromPriorCredit,
    costOfGoodsSold: nonNegExpParts.costOfGoodsSold,
    staffSalaries: nonNegExpParts.staffSalaries,
    rentUtilities: nonNegExpParts.rentUtilities,
    transportLogistics: nonNegExpParts.transportLogistics,
    marketingAdvertising: nonNegExpParts.marketingAdvertising,
    loanRepayments: nonNegExpParts.loanRepayments,
    taxPayments: nonNegExpParts.taxPayments,
    miscellaneousExpenses: nonNegExpParts.miscellaneousExpenses,
    totalExpenses: totalExpDeclared,
    openingCash: Number(b.openingCash),
    closingCash: Number(b.closingCash),
    cashAtHand: Number(b.cashAtHand),
    cashInBank: Number(b.cashInBank),
    customersServed: Math.round(Number(b.customersServed)),
    newCustomers: Math.round(Number(b.newCustomers)),
    operatingDays: Math.round(Number(b.operatingDays)),
    largeOneOff: b.largeOneOff,
    largeOneOffDescription:
      b.largeOneOff ? String(b.largeOneOffDescription).trim().slice(0, 4000) : '',
    largeOneOffAmount:
      b.largeOneOff ? Number(b.largeOneOffAmount) || 0 : 0,
    newAssets: b.newAssets,
    newAssetsDescription:
      b.newAssets ? String(b.newAssetsDescription).trim().slice(0, 4000) : '',
    newAssetsAmount: b.newAssets ? Number(b.newAssetsAmount) || 0 : 0,
    notes: b.notes ? String(b.notes).trim().slice(0, 10000) : '',
    biggestChallenge: b.biggestChallenge
      ? String(b.biggestChallenge).trim().slice(0, 5000)
      : '',
  };

  req.monthlyPayload = doc;
  next();
}

module.exports = validateMonthlyReport;
