const express = require('express');
const { getSettings, updateSettings } = require('../controllers/whatsappSettingsController');
const router = express.Router();
router.route('/whatsapp').get(getSettings).put(updateSettings);
module.exports = router;
