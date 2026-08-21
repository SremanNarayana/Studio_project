const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const ReferralAccount = require('../models/ReferralAccount');
const ReferralReward = require('../models/ReferralReward');
const Booking = require('../models/Booking');
const { accountSummary, redeemPointsForBooking } = require('../services/referralService');

const listReferralAccounts = asyncHandler(async (req, res) => {
  const accounts = await ReferralAccount.find().sort({ createdAt: -1 }).lean();
  const data = await Promise.all(accounts.map(async (a) => ({
    ...a,
    ...accountSummary(a),
    usageCount: await ReferralReward.countDocuments({ referrer: a._id }),
  })));
  return sendSuccess(res, { message: 'Referral accounts fetched successfully', data });
});

const getReferralUsage = asyncHandler(async (req, res) => {
  const account = await ReferralAccount.findById(req.params.id).lean();
  if (!account) throw new ApiError(404, 'Referral account not found');
  const usage = await ReferralReward.find({ referrer: account._id })
    .populate('referredBooking', 'trackingNumber eventDetails createdAt')
    .sort({ usedAt: -1 }).lean();
  return sendSuccess(res, { message: 'Referral usage fetched successfully', data: { account: { ...account, ...accountSummary(account) }, usage } });
});

const redeemReferralPoints = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.body.bookingId);
  if (!booking) throw new ApiError(404, 'Booking not found');
  const result = await redeemPointsForBooking({ accountId: req.params.id, booking, points: req.body.points });
  return sendSuccess(res, { message: 'Referral points redeemed successfully', data: { booking, ...result, referral: accountSummary(result.account) } });
});

module.exports = { listReferralAccounts, getReferralUsage, redeemReferralPoints };
