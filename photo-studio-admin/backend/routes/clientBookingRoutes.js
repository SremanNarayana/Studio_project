const express = require('express');
const { createClientBooking, trackClientBooking } = require('../controllers/clientBookingController');
const { validatePublicBooking, validateTrackingLookup } = require('../middleware/validatePublicBooking');
const publicRateLimit = require('../middleware/publicRateLimit');

const router = express.Router();
router.use(publicRateLimit());
router.post('/', validatePublicBooking, createClientBooking);
router.post('/track', validateTrackingLookup, trackClientBooking);

module.exports = router;
