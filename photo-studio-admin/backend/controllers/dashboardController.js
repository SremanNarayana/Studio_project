const Booking = require('../models/Booking');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

// @desc    Aggregate dashboard summary cards + recent bookings table
// @route   GET /api/dashboard
const getDashboardData = asyncHandler(async (req, res) => {
  const now = new Date();
  const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom) : null;
  const dateTo = req.query.dateTo ? new Date(req.query.dateTo) : null;
  const bookingFilter = dateFrom && dateTo && !Number.isNaN(dateFrom.getTime()) && !Number.isNaN(dateTo.getTime())
    ? { createdAt: { $gte: dateFrom, $lt: dateTo } }
    : {};

  const [
    totalBookings,
    upcomingShoots,
    completedProjects,
    pendingDeliveries,
    revenueAgg,
    pendingBalanceAgg,
    recentBookings,
  ] = await Promise.all([
    Booking.countDocuments(bookingFilter),
    Booking.countDocuments({ ...bookingFilter, 'eventDetails.eventDate': { $gte: now } }),
    Booking.countDocuments({ ...bookingFilter, projectTimeline: { $elemMatch: { stageName: 'Delivery', status: 'Completed' } } }),
    Booking.countDocuments({ ...bookingFilter, projectTimeline: { $not: { $elemMatch: { stageName: 'Delivery', status: 'Completed' } } } }),
    Booking.aggregate([
      { $match: bookingFilter },
      { $group: { _id: null, sum: { $sum: '$payment.advancePayment' } } },
    ]),
    Booking.aggregate([
      { $match: bookingFilter },
      { $group: { _id: null, sum: { $sum: '$payment.balancePayment' } } },
    ]),
    Booking.find(bookingFilter)
      .sort({ createdAt: -1 })
      .limit(10)
      .select(
        'trackingNumber personalDetails.fullName eventDetails.eventDate eventDetails.shootType currentStage payment.balancePayment'
      ),
  ]);

  const totalRevenue = revenueAgg[0]?.sum || 0;
  const pendingBalancePayments = pendingBalanceAgg[0]?.sum || 0;

  return sendSuccess(res, {
    message: 'Dashboard data fetched successfully',
    data: {
      cards: {
        totalBookings,
        upcomingShoots,
        completedProjects,
        pendingDeliveries,
        totalRevenue,
        pendingBalancePayments,
      },
      recentBookings,
    },
  });
});

module.exports = { getDashboardData };
