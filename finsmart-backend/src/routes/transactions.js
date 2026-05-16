const express = require('express');

const router = express.Router();

const authRequired = require('../middleware/authRequired');
const validateDailyEntry = require('../middleware/validateDailyEntry');
const validateMonthlyReport = require('../middleware/validateMonthlyReport');
const {
  saveDaily,
  listDailyMonth,
  saveMonthly,
  listMonthlyYear,
} = require('../controllers/transactionController');

router.use(authRequired);

router.post('/daily', validateDailyEntry, saveDaily);
router.get('/daily', listDailyMonth);

router.post('/monthly', validateMonthlyReport, saveMonthly);
router.get('/monthly/:year', listMonthlyYear);

module.exports = router;
