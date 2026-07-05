const express = require('express');
const router = express.Router();

const {
  createBooking,
  getBookings,
  searchBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  updateStage,
  updateApproval,
} = require('../controllers/bookingController');

const { validateCreateBooking, validateUpdateBooking } = require('../middleware/validateBooking');

// IMPORTANT: /search must come before /:id, otherwise Express treats
// "search" as an :id param and routes it to getBookingById instead.
router.get('/search', searchBookings);

router.route('/').post(validateCreateBooking, createBooking).get(getBookings);

router
  .route('/:id')
  .get(getBookingById)
  .put(validateUpdateBooking, updateBooking)
  .delete(deleteBooking);

router.patch('/:id/stage', updateStage);
router.patch('/:id/approval', updateApproval);

module.exports = router;
