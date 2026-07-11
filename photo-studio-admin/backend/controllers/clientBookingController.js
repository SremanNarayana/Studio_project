const Booking = require('../models/Booking');
const generateTrackingNumber = require('../utils/generateTrackingNumber');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');

function normalizePhone(value) {
  return String(value || '').replace(/\D/g, '');
}

function safeTrackingView(booking) {
  const paymentEntries = booking.payment?.paymentEntries?.length
    ? booking.payment.paymentEntries
    : (booking.payment?.advancePayment || 0) > 0
      ? [{
          amount: booking.payment.advancePayment,
          description: 'Previous payment',
          receivedOn: booking.updatedAt || booking.createdAt,
        }]
      : [];

  return {
    trackingNumber: booking.trackingNumber,
    approvalStatus: booking.approvalStatus,
    personalDetails: {
      fullName: booking.personalDetails.fullName,
    },
    eventDetails: booking.eventDetails,
    currentStage: booking.currentStage,
    projectTimeline: booking.projectTimeline,
    payment: {
      totalAmount: booking.payment?.totalAmount || 0,
      paidAmount: booking.payment?.paidAmount ?? booking.payment?.advancePayment ?? 0,
      balancePayment: booking.payment?.balancePayment || 0,
      paymentStatus: booking.payment?.paymentStatus || 'Pending',
      paymentEntries,
    },
    estimatedDeliveryDate: booking.estimatedDeliveryDate,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
}

// @route POST /api/client/bookings
const createClientBooking = asyncHandler(async (req, res) => {
  const trackingNumber = await generateTrackingNumber();
  const booking = await Booking.create({
    trackingNumber,
    approvalStatus: 'Pending',
    personalDetails: {
      fullName: req.body.fullName,
      phoneNumber: normalizePhone(req.body.phoneNumber),
      emailAddress: req.body.emailAddress || '',
      instagram: req.body.instagram || '',
    },
    eventDetails: {
      shootType: req.body.shootType,
      eventDate: req.body.eventDate,
      eventTime: req.body.eventTime || '',
      venueName: req.body.venueName || '',
      venueAddress: req.body.venueAddress || '',
    },
    package: {
      type: 'Custom',
      customDescription: 'To be assigned by the studio after approval',
    },
    payment: { totalAmount: 0, paymentEntries: [] },
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Booking request received and awaiting studio approval',
    data: {
      trackingNumber: booking.trackingNumber,
      approvalStatus: booking.approvalStatus,
      eventDate: booking.eventDetails.eventDate,
    },
  });
});

// POST avoids putting the phone number into URLs, browser history, and logs.
// @route POST /api/client/bookings/track
const trackClientBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({
    trackingNumber: req.body.trackingNumber.toUpperCase(),
  });

  if (!booking) {
    throw new ApiError(404, 'Booking not found. Check the booking ID.');
  }

  return sendSuccess(res, {
    message: 'Booking status fetched successfully',
    data: safeTrackingView(booking),
  });
});

module.exports = { createClientBooking, trackClientBooking };
