const mongoose = require('mongoose');

// The unique referredBooking index makes a referral reward idempotent: even if
// two requests race, one booking can only ever grant one reward.
const referralRewardSchema = new mongoose.Schema(
  {
    referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'ReferralAccount', required: true, index: true },
    referredBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    points: { type: Number, required: true, default: 25 },
    // A code is a one-time reward: this unique index also protects against
    // simultaneous submissions attempting to redeem it twice.
    referralCode: { type: String, required: true, unique: true, uppercase: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ReferralReward', referralRewardSchema);
