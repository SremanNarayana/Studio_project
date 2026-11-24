const Booking = require('../models/Booking');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

function monthKey(date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

const getAnalytics = asyncHandler(async (req, res) => {
  const requested = Number.parseInt(req.query.months, 10);
  const months = [1, 6, 12, 24].includes(requested) ? requested : 12;
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - months + 1, 1));
  const nextThirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom) : null;
  const dateTo = req.query.dateTo ? new Date(req.query.dateTo) : null;
  const bookingFilter = dateFrom && dateTo
    && !Number.isNaN(dateFrom.getTime())
    && !Number.isNaN(dateTo.getTime())
    && dateFrom < dateTo
    ? { createdAt: { $gte: dateFrom, $lt: dateTo } }
    : {};
  const trendFilter = bookingFilter.createdAt ? bookingFilter : { createdAt: { $gte: start } };

  const [summary, monthlyRaw, shootTypes, stages, payments, approvals, upcomingThirtyDays, completedProjects] = await Promise.all([
    Booking.aggregate([{ $match: bookingFilter }, { $group: {
      _id: null,
      totalBookings: { $sum: 1 },
      totalContractValue: { $sum: '$payment.totalAmount' },
      totalCollected: { $sum: '$payment.advancePayment' },
      outstandingBalance: { $sum: '$payment.balancePayment' },
      averageBookingValue: { $avg: '$payment.totalAmount' },
    } }]),
    Booking.aggregate([
      { $match: trendFilter },
      { $group: {
        _id: months === 1 && bookingFilter.createdAt
          ? null
          : { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        bookings: { $sum: 1 },
        value: { $sum: '$payment.totalAmount' },
        collected: { $sum: '$payment.advancePayment' },
      } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
    Booking.aggregate([{ $match: bookingFilter }, { $group: { _id: '$eventDetails.shootType', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Booking.aggregate([{ $match: bookingFilter }, { $group: { _id: '$currentStage', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Booking.aggregate([{ $match: bookingFilter }, { $group: { _id: '$payment.paymentStatus', count: { $sum: 1 }, value: { $sum: '$payment.totalAmount' } } }, { $sort: { count: -1 } }]),
    Booking.aggregate([{ $match: bookingFilter }, { $group: { _id: '$approvalStatus', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Booking.countDocuments({ ...bookingFilter, 'eventDetails.eventDate': { $gte: now, $lte: nextThirtyDays } }),
    Booking.countDocuments({ ...bookingFilter, projectTimeline: { $elemMatch: { stageName: 'Delivery', status: 'Completed' } } }),
  ]);

  const rawByMonth = new Map(monthlyRaw.filter((row) => row._id).map((row) => [
    `${row._id.year}-${String(row._id.month).padStart(2, '0')}`, row,
  ]));
  const monthly = months === 1 && bookingFilter.createdAt
    ? [{
        key: 'this-month',
        label: req.query.monthLabel || 'This month',
        bookings: monthlyRaw[0]?.bookings || 0,
        value: monthlyRaw[0]?.value || 0,
        collected: monthlyRaw[0]?.collected || 0,
      }]
    : Array.from({ length: months }, (_, index) => {
      const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - months + 1 + index, 1));
      const key = monthKey(date);
      const row = rawByMonth.get(key);
      return {
        key,
        label: date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit', timeZone: 'UTC' }),
        bookings: row?.bookings || 0,
        value: row?.value || 0,
        collected: row?.collected || 0,
      };
      });

  const totals = summary[0] || {};
  return sendSuccess(res, {
    message: 'Analytics fetched successfully',
    data: {
      periodMonths: months,
      summary: {
        totalBookings: totals.totalBookings || 0,
        totalContractValue: totals.totalContractValue || 0,
        totalCollected: totals.totalCollected || 0,
        outstandingBalance: totals.outstandingBalance || 0,
        averageBookingValue: Math.round(totals.averageBookingValue || 0),
        completionRate: totals.totalBookings ? Math.round((completedProjects / totals.totalBookings) * 100) : 0,
        upcomingThirtyDays,
      },
      monthly,
      shootTypes: shootTypes.map((item) => ({ label: item._id || 'Unknown', count: item.count })),
      stages: stages.map((item) => ({ label: item._id || 'Unknown', count: item.count })),
      payments: payments.map((item) => ({ label: item._id || 'Unknown', count: item.count, value: item.value })),
      approvals: approvals.map((item) => ({ label: item._id || 'Unknown', count: item.count })),
    },
  });
});

module.exports = { getAnalytics };
