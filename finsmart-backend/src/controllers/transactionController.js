const DailyEntry = require('../models/DailyEntry');
const MonthlyReport = require('../models/MonthlyReport');

async function saveDaily(req, res) {
  try {
    const userId = req.user.id;
    const payload = req.dailyPayload;

    const doc = await DailyEntry.findOneAndUpdate(
      { userId, date: payload.date },
      { userId, ...payload },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json({ entry: doc });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An entry for this date already exists (duplicate).' });
    }
    console.error('saveDaily error:', err);
    return res.status(500).json({ error: 'Could not save daily entry.' });
  }
}

async function listDailyMonth(req, res) {
  try {
    const { month } = req.query;
    if (!month || typeof month !== 'string' || !/^(\d{4})-(\d{2})$/.test(month.trim())) {
      return res.status(400).json({ error: 'Query month must be YYYY-MM.' });
    }

    const [y, m] = month.split('-').map(Number);
    const start = new Date(Date.UTC(y, m - 1, 1));
    const end = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999));

    const entries = await DailyEntry.find({
      userId: req.user.id,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    return res.json({ entries });
  } catch (err) {
    console.error('listDailyMonth error:', err);
    return res.status(500).json({ error: 'Could not load daily entries.' });
  }
}

async function saveMonthly(req, res) {
  try {
    const userId = req.user.id;
    const p = req.monthlyPayload;

    const doc = await MonthlyReport.findOneAndUpdate(
      { userId, year: p.year, month: p.month },
      { userId, ...p },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json({ report: doc });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Report for this month already exists (duplicate).' });
    }
    console.error('saveMonthly error:', err);
    return res.status(500).json({ error: 'Could not save monthly report.' });
  }
}

async function listMonthlyYear(req, res) {
  try {
    const year = Number(req.params.year);
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      return res.status(400).json({ error: 'Invalid year.' });
    }

    const reports = await MonthlyReport.find({ userId: req.user.id, year }).sort({ month: 1 });
    return res.json({ reports });
  } catch (err) {
    console.error('listMonthlyYear error:', err);
    return res.status(500).json({ error: 'Could not load monthly reports.' });
  }
}

module.exports = { saveDaily, listDailyMonth, saveMonthly, listMonthlyYear };
