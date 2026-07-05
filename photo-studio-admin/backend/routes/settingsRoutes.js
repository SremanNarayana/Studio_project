const express = require('express');
const { getSettings, updateSettings } = require('../controllers/smsSettingsController');
const router = express.Router();
router.route('/sms').get(getSettings).put(updateSettings);
module.exports = router;
