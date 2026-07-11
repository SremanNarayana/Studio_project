const Booking = require('../models/Booking');
const generateTrackingNumber = require('../utils/generateTrackingNumber');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { PROJECT_STAGES, STAGE_STATUS, APPROVAL_STATUS } = require('../config/constants');
const { sendStageUpdateSms, sendBookingCreatedSms } = require('../services/smsService');

function buildPaymentRemark(entry) {
  const amount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(entry.amount || 0);
  const date = entry.receivedOn ? new Date(entry.receivedOn).toLocaleDateString('en-IN') : 'today';
  return `Payment noted: ${amount} - ${entry.description} (${date})`;
}

// @desc    Create a new booking (tracking number auto-generated)
// @route   POST /api/bookings
const createBooking = asyncHandler(async (req, res) => {
  const trackingNumber = await generateTrackingNumber();

  const booking = await Booking.create({
    ...req.body,
    trackingNumber,
    approvalStatus: 'Approved',
  });

  let sms;
  try {
    sms = await sendBookingCreatedSms(booking);
  } catch (error) {
    console.error(`Booking created but SMS failed for ${booking.trackingNumber}:`, error.message);
    sms = { sent: false, mode: 'error', error: error.message };
  }

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Booking created successfully',
    data: booking,
    meta: { sms },
  });
});

// @desc    Get all bookings (paginated, filterable, sortable)
// @route   GET /api/bookings?page=&limit=&shootType=&paymentStatus=&currentStage=&sortBy=&order=
const getBookings = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.shootType) filter['eventDetails.shootType'] = req.query.shootType;
  if (req.query.paymentStatus) filter['payment.paymentStatus'] = req.query.paymentStatus;
  if (req.query.currentStage) filter.currentStage = req.query.currentStage;
  if (req.query.approvalStatus) {
    if (!APPROVAL_STATUS.includes(req.query.approvalStatus)) {
      throw new ApiError(400, `Invalid approvalStatus. Must be one of: ${APPROVAL_STATUS.join(', ')}`);
    }
    filter.approvalStatus = req.query.approvalStatus;
  }
  if (req.query.packageType) filter['package.type'] = req.query.packageType;
  if (req.query.dateFrom || req.query.dateTo) {
    filter['eventDetails.eventDate'] = {};
    if (req.query.dateFrom) filter['eventDetails.eventDate'].$gte = new Date(req.query.dateFrom);
    if (req.query.dateTo) filter['eventDetails.eventDate'].$lte = new Date(req.query.dateTo);
  }

  const sortField = req.query.sortBy || 'createdAt';
  const sortOrder = req.query.order === 'asc' ? 1 : -1;

  const [bookings, total] = await Promise.all([
    Booking.find(filter).sort({ [sortField]: sortOrder }).skip(skip).limit(limit),
    Booking.countDocuments(filter),
  ]);

  return sendSuccess(res, {
    message: 'Bookings fetched successfully',
    data: bookings,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

// @desc    Search bookings by tracking number, name, or phone
// @route   GET /api/bookings/search?q=
const searchBookings = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || !q.trim()) {
    throw new ApiError(400, 'Search query "q" is required');
  }

  const regex = new RegExp(q.trim(), 'i');
  const bookings = await Booking.find({
    $or: [
      { trackingNumber: regex },
      { 'personalDetails.fullName': regex },
      { 'personalDetails.phoneNumber': regex },
      { 'personalDetails.emailAddress': regex },
    ],
  }).sort({ createdAt: -1 });

  return sendSuccess(res, { message: 'Search results', data: bookings });
});

// @desc    Get a single booking by ID
// @route   GET /api/bookings/:id
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');
  return sendSuccess(res, { message: 'Booking fetched successfully', data: booking });
});

// @desc    Update a booking's details
// @route   PUT /api/bookings/:id
const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  // trackingNumber must never be overwritten by the client
  const { trackingNumber, projectTimeline, ...updatable } = req.body;

  Object.assign(booking, updatable);
  await booking.save();

  return sendSuccess(res, { message: 'Booking updated successfully', data: booking });
});

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');
  return sendSuccess(res, { message: 'Booking deleted successfully', data: { id: req.params.id } });
});

// @desc    Update a single project stage (status / completionDate / remarks)
// @route   PATCH /api/bookings/:id/stage
// @body    { stageName, status, completedDate?, remarks? }
const updateStage = asyncHandler(async (req, res) => {
  const { stageName, status, completedDate, remarks, paymentEntry } = req.body;

  if (!PROJECT_STAGES.includes(stageName)) {
    throw new ApiError(400, `Invalid stageName. Must be one of: ${PROJECT_STAGES.join(', ')}`);
  }
  if (status && !STAGE_STATUS.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${STAGE_STATUS.join(', ')}`);
  }
  if (paymentEntry) {
    if (!Number.isFinite(Number(paymentEntry.amount)) || Number(paymentEntry.amount) <= 0) {
      throw new ApiError(400, 'Payment amount must be greater than 0');
    }
    if (!String(paymentEntry.description || '').trim()) {
      throw new ApiError(400, 'Payment description is required when recording a payment');
    }
    if (paymentEntry.receivedOn && Number.isNaN(new Date(paymentEntry.receivedOn).getTime())) {
      throw new ApiError(400, 'Payment date is invalid');
    }
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  const stage = booking.projectTimeline.find((s) => s.stageName === stageName);
  if (!stage) throw new ApiError(404, `Stage "${stageName}" not found on this booking`);

  if (status) stage.status = status;
  if (completedDate !== undefined) stage.completedDate = completedDate;
  if (status === 'Completed' && !stage.completedDate) stage.completedDate = new Date();
  if (remarks !== undefined) stage.remarks = remarks;
  let normalizedPaymentEntry = null;
  if (paymentEntry) {
    normalizedPaymentEntry = {
      amount: Number(paymentEntry.amount),
      description: String(paymentEntry.description).trim(),
      receivedOn: paymentEntry.receivedOn ? new Date(paymentEntry.receivedOn) : new Date(),
    };
    booking.payment.paymentEntries.push(normalizedPaymentEntry);
    const paymentRemark = buildPaymentRemark(normalizedPaymentEntry);
    stage.remarks = stage.remarks ? `${stage.remarks}\n${paymentRemark}` : paymentRemark;
  }

  // Advance currentStage to the first non-completed stage, in defined order.
  const nextPending = PROJECT_STAGES.find((name) => {
    const s = booking.projectTimeline.find((t) => t.stageName === name);
    return s.status !== 'Completed';
  });
  booking.currentStage = nextPending || PROJECT_STAGES[PROJECT_STAGES.length - 1];

  await booking.save();

  let sms;
  try {
    sms = await sendStageUpdateSms(booking, stageName, normalizedPaymentEntry);
  } catch (error) {
    console.error(`Stage saved but SMS failed for ${booking.trackingNumber}:`, error.message);
    sms = { sent: false, mode: 'error', error: error.message };
  }

  return sendSuccess(res, { message: 'Stage updated successfully', data: booking, meta: { sms } });
});

// @desc    Approve or reject a client booking request
// @route   PATCH /api/bookings/:id/approval
// @body    { approvalStatus: "Approved" | "Rejected" }
const updateApproval = asyncHandler(async (req, res) => {
  const { approvalStatus } = req.body;
  if (!APPROVAL_STATUS.includes(approvalStatus) || approvalStatus === 'Pending') {
    throw new ApiError(400, 'approvalStatus must be Approved or Rejected');
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  booking.approvalStatus = approvalStatus;
  booking.approvalUpdatedAt = new Date();
  await booking.save();

  return sendSuccess(res, {
    message: `Booking ${approvalStatus.toLowerCase()} successfully`,
    data: booking,
  });
});

module.exports = {
  createBooking,
  getBookings,
  searchBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  updateStage,
  updateApproval,
};
