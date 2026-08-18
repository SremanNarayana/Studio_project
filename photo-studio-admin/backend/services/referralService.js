const crypto = require('crypto');
const Booking = require('../models/Booking');
const ReferralAccount = require('../models/ReferralAccount');
const ReferralReward = require('../models/ReferralReward');
const ApiError = require('../utils/ApiError');

const REWARD_POINTS = 25;
const RUPEES_PER_50_POINTS = 10;

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
  const alreadyRedeemed = await ReferralReward.exists({ referralCode: code });
  if (alreadyRedeemed) throw new ApiError(400, 'This referral code has already been used');
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
    });
  } catch (error) {
    if (error?.code === 11000) {
      throw new ApiError(400, 'This referral code has already been used');
    }
    throw error;
  }

  return ReferralAccount.findByIdAndUpdate(account._id, { $inc: { points: REWARD_POINTS } }, { new: true });
}

function accountSummary(account) {
  if (!account) return null;
  return {
    referralCode: account.referralCode,
    points: account.points,
    rupeeValue: Math.floor(account.points / 50) * RUPEES_PER_50_POINTS,
  };
}

module.exports = {
  REWARD_POINTS,
  RUPEES_PER_50_POINTS,
  normalizePhone,
  normalizeCode,
  createReferralAccount,
  validateReferral,
  grantReferralReward,
  accountSummary,
};
