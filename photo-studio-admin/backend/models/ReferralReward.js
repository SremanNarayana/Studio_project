const mongoose = require('mongoose');

// The unique referredBooking index makes a referral reward idempotent: even if
// two requests race, one booking can only ever grant one reward.
const referralRewardSchema = new mongoose.Schema(
  {
    referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'ReferralAccount', required: true, index: true },
    referredBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    points: { type: Number, required: true, default: 25 },
    referralCode: { type: String, required: true, uppercase: true, index: true },
    referredCustomerName: { type: String, required: true, trim: true },
    referredPhoneNumber: { type: String, required: true, index: true },
    usedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ReferralReward', referralRewardSchema);
