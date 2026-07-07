const express = require('express');
const { trackClientBooking } = require('../controllers/clientBookingController');
const { validateTrackingLookup } = require('../middleware/validatePublicBooking');
const publicRateLimit = require('../middleware/publicRateLimit');

const router = express.Router();
router.use(publicRateLimit());
router.post('/track', validateTrackingLookup, trackClientBooking);

module.exports = router;
