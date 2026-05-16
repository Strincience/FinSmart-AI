const { DAILY_EXPENSE_CATEGORIES } = require('../constants/expenseCategories');

const MAX_LINES = 10;

function parseISODate(d) {
  if (!d || typeof d !== 'string') return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d.trim());
  if (!m) return null;
  const dt = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  if (Number.isNaN(+dt)) return null;
  return dt;
}

function validateDailyEntry(req, res, next) {
  const b = req.body || {};
  const date = parseISODate(b.date);
  if (!date) return res.status(400).json({ error: 'date must be YYYY-MM-DD.' });

  const totals = {};
  ['totalSales', 'totalExpenses', 'cashReceived', 'outstandingCredit'].forEach((k) => {
    const n = Number(b[k]);
    if (!Number.isFinite(n) || n < 0) {
      totals[k] = NaN;
    } else {
      totals[k] = n;
    }
  });

  if (Object.values(totals).some((n) => Number.isNaN(n))) {
    return res.status(400).json({
      error: 'totalSales, totalExpenses, cashReceived, and outstandingCredit must be non-negative numbers.',
    });
  }

  let salesLines = Array.isArray(b.salesLines) ? b.salesLines : [];
  if (salesLines.length > MAX_LINES) {
    return res.status(400).json({ error: `salesLines supports at most ${MAX_LINES} rows.` });
  }

  salesLines = salesLines.map((row) => {
    const qty = Number(row.quantity);
    const unitPrice = Number(row.unitPrice);
    const lineTotal = Number(row.total ?? row.lineTotal ?? (qty * unitPrice));
    return {
      name: String(row.name || '').trim(),
      quantity: qty,
      unitPrice,
      lineTotal,
    };
  });

  const badSale = salesLines.find(
    (r) =>
      !r.name ||
      !Number.isFinite(r.quantity) ||
      r.quantity < 0 ||
      !Number.isFinite(r.unitPrice) ||
      r.unitPrice < 0 ||
      !Number.isFinite(r.lineTotal) ||
      r.lineTotal < 0
  );
  if (badSale) return res.status(400).json({ error: 'Invalid sales breakdown row.' });

  let expenseLines = Array.isArray(b.expenseLines) ? b.expenseLines : [];
  if (expenseLines.length > MAX_LINES) {
    return res.status(400).json({ error: `expenseLines supports at most ${MAX_LINES} rows.` });
  }

  expenseLines = expenseLines.map((row) => ({
    category: row.category,
    description: row.description ? String(row.description).trim() : '',
    amount: Number(row.amount),
  }));

  const badExp = expenseLines.find(
    (r) =>
      !DAILY_EXPENSE_CATEGORIES.includes(r.category) ||
      !Number.isFinite(r.amount) ||
      r.amount < 0
  );
  if (badExp) return res.status(400).json({ error: 'Invalid expense breakdown row or category.' });

  const notes = b.notes != null ? String(b.notes).trim().slice(0, 5000) : '';

  req.dailyPayload = {
    date,
    totalSales: totals.totalSales,
    salesLines,
    totalExpenses: totals.totalExpenses,
    expenseLines,
    cashReceived: totals.cashReceived,
    outstandingCredit: totals.outstandingCredit,
    notes,
  };

  next();
}

module.exports = validateDailyEntry;
