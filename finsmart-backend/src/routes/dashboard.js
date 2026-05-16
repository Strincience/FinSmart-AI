const express = require('express');

const router = express.Router();

const authRequired = require('../middleware/authRequired');
const { getSummary } = require('../controllers/dashboardController');

router.use(authRequired);

router.get('/summary', getSummary);

module.exports = router;
