const express = require('express');

const router = express.Router();

const authRequired = require('../middleware/authRequired');
const { getMe, updateBusinessProfile } = require('../controllers/userController');

router.get('/me', authRequired, getMe);
router.patch('/me/business-profile', authRequired, updateBusinessProfile);

module.exports = router;
