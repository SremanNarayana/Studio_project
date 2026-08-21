const crypto = require('crypto');
const Booking = require('../models/Booking');
const ReferralAccount = require('../models/ReferralAccount');
const ReferralReward = require('../models/ReferralReward');
const ApiError = require('../utils/ApiError');

const REWARD_POINTS = 100;
const RUPEES_PER_100_POINTS = 1000;

function normalizePhone(value) {
  return String(value || '').replace(/\D/g, '');
}

function normalizeCode(value) {
  return String(value || '').trim().toUpperCase().replace(/\s+/g, '');
}

function makeCode() {
  return `MAL-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

async function createReferralAccount(booking) {
  const phoneNumber = normalizePhone(booking.personalDetails.phoneNumber);
  const existing = await ReferralAccount.findOne({ phoneNumber });
  if (existing) return existing;

  // Retry only for the extremely unlikely case of a random-code collision.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await ReferralAccount.create({
        phoneNumber,
        customerName: booking.personalDetails.fullName,
        referralCode: makeCode(),
        completedBooking: booking._id,
      });
    } catch (error) {
      if (error?.code !== 11000) throw error;
      const account = await ReferralAccount.findOne({ phoneNumber });
      if (account) return account;
    }
  }
  throw new ApiError(500, 'Could not generate a unique referral code. Please try again.');
}

async function validateReferral({ referralCode, phoneNumber }) {
  const code = normalizeCode(referralCode);
  if (!code) return null;

  const account = await ReferralAccount.findOne({ referralCode: code });
  if (!account) throw new ApiError(400, 'Referral code is invalid');
  if (account.phoneNumber === normalizePhone(phoneNumber)) {
    throw new ApiError(400, 'Customers cannot use their own referral code');
  }
  const bookingsForPhoneCheck = await Booking.find({}, { 'personalDetails.phoneNumber': 1 }).lean();
  if (bookingsForPhoneCheck.some((booking) => normalizePhone(booking.personalDetails?.phoneNumber) === normalizePhone(phoneNumber))) {
    throw new ApiError(400, 'Referral codes are for new customers only');
  }
  return account;
}

async function grantReferralReward({ booking, referralCode, account: eligibleAccount = null }) {
  const code = normalizeCode(referralCode);
  if (!code) return null;
  const account = eligibleAccount || await validateReferral({ referralCode: code, phoneNumber: booking.personalDetails.phoneNumber });

  try {
    await ReferralReward.create({
      referrer: account._id,
      referredBooking: booking._id,
      points: REWARD_POINTS,
      referralCode: code,
      referredCustomerName: booking.personalDetails.fullName,
      referredPhoneNumber: normalizePhone(booking.personalDetails.phoneNumber),
      usedAt: new Date(),
    });
  } catch (error) {
    if (error?.code === 11000) {
      throw new ApiError(400, 'This booking has already received a referral reward');
    }
    throw error;
  }

  return ReferralAccount.findByIdAndUpdate(account._id, { $inc: { points: REWARD_POINTS } }, { new: true });
}

function accountSummary(account) {
  if (!account) return null;
  return {
    _id: account._id,
    referralCode: account.referralCode,
    points: account.points,
    rupeeValue: Math.floor(account.points / 100) * RUPEES_PER_100_POINTS,
  };
}

async function redeemPointsForBooking({ accountId, booking, points }) {
  const requested = Number(points);
  if (!Number.isInteger(requested) || requested <= 0 || requested % 100 !== 0) {
    throw new ApiError(400, 'Points must be a positive multiple of 100');
  }
  const owner = await ReferralAccount.findById(accountId);
  if (!owner || owner.phoneNumber !== normalizePhone(booking.personalDetails.phoneNumber)) {
    throw new ApiError(403, 'Referral points can only be redeemed by their owner');
  }
  const account = await ReferralAccount.findOneAndUpdate(
    { _id: accountId, points: { $gte: requested } },
    { $inc: { points: -requested } },
    { new: true }
  );
  if (!account) throw new ApiError(400, 'Insufficient referral points');
  const discount = (requested / 100) * RUPEES_PER_100_POINTS;
  booking.referralPointsRedeemed = (booking.referralPointsRedeemed || 0) + requested;
  booking.referralDiscountAmount = (booking.referralDiscountAmount || 0) + discount;
  booking.referralRedeemedFrom = account._id;
  booking.payment.totalAmount = Math.max((booking.payment.totalAmount || 0) - discount, 0);
  await booking.save();
  return { account, discount, points: requested };
}

module.exports = {
  REWARD_POINTS,
  RUPEES_PER_100_POINTS,
  normalizePhone,
  normalizeCode,
  createReferralAccount,
  validateReferral,
  grantReferralReward,
  accountSummary,
  redeemPointsForBooking,
};
