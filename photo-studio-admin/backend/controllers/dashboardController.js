const Booking = require('../models/Booking');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

// @desc    Aggregate dashboard summary cards + recent bookings table
// @route   GET /api/dashboard
const getDashboardData = asyncHandler(async (req, res) => {
  const now = new Date();

  const [
    totalBookings,
    upcomingShoots,
    completedProjects,
    pendingDeliveries,
    revenueAgg,
    pendingBalanceAgg,
    recentBookings,
  ] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ 'eventDetails.eventDate': { $gte: now } }),
    Booking.countDocuments({ currentStage: 'Delivery', 'payment.paymentStatus': 'Completed' }),
    Booking.countDocuments({ currentStage: { $ne: 'Delivery' } }),
    Booking.aggregate([{ $group: { _id: null, sum: { $sum: '$payment.advancePayment' } } }]),
    Booking.aggregate([{ $group: { _id: null, sum: { $sum: '$payment.balancePayment' } } }]),
    Booking.find()
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
