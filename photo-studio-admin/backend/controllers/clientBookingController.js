const Booking = require('../models/Booking');
const generateTrackingNumber = require('../utils/generateTrackingNumber');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const ReferralAccount = require('../models/ReferralAccount');
const { validateReferral, grantReferralReward, normalizeCode, accountSummary, createReferralAccount } = require('../services/referralService');

function normalizePhone(value) {
  return String(value || '').replace(/\D/g, '');
}

async function safeTrackingView(booking) {
  const paymentEntries = booking.payment?.paymentEntries?.length
    ? booking.payment.paymentEntries
    : (booking.payment?.advancePayment || 0) > 0
      ? [{
          amount: booking.payment.advancePayment,
          description: 'Previous payment',
          receivedOn: booking.updatedAt || booking.createdAt,
        }]
      : [];

  const referral = await ReferralAccount.findOne({ phoneNumber: normalizePhone(booking.personalDetails.phoneNumber) });
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
    referral: accountSummary(referral),
  };
}

// @route POST /api/client/bookings
const createClientBooking = asyncHandler(async (req, res) => {
  const trackingNumber = await generateTrackingNumber();
  const phoneNumber = normalizePhone(req.body.phoneNumber);
  const referralCodeUsed = normalizeCode(req.body.referralCode);
  const eligibleAccount = await validateReferral({ referralCode: referralCodeUsed, phoneNumber });
  const booking = await Booking.create({
    trackingNumber,
    approvalStatus: 'Pending',
    personalDetails: {
      fullName: req.body.fullName,
      phoneNumber,
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
    requirements: req.body.requirements || [],
    package: {
      type: 'Custom',
      customDescription: 'To be assigned by the studio after approval',
    },
    payment: { totalAmount: 0, paymentEntries: [] },
    adminNotes: req.body.enquiryNotes || '',
    referralCodeUsed,
  });
  const referrer = await grantReferralReward({ booking, referralCode: referralCodeUsed, account: eligibleAccount });

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Booking request received and awaiting studio approval',
    data: {
      trackingNumber: booking.trackingNumber,
      approvalStatus: booking.approvalStatus,
      eventDate: booking.eventDetails.eventDate,
      referralApplied: Boolean(referrer),
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

  // Older completed projects may have finished before referral accounts were
  // introduced. Issue the code during lookup as well, so every completed
  // customer can see their code in Track My Project.
  const delivery = booking.projectTimeline?.find((stage) => stage.stageName === 'Delivery');
  if (delivery?.status === 'Completed') await createReferralAccount(booking);

  return sendSuccess(res, {
    message: 'Booking status fetched successfully',
    data: await safeTrackingView(booking),
  });
});

module.exports = { createClientBooking, trackClientBooking };
