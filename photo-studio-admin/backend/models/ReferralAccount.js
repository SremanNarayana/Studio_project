const mongoose = require('mongoose');

// One loyalty account per customer phone number. A phone number is used because
// it is already mandatory on every booking and is less likely than a name to
// identify two different customers as the same person.
const referralAccountSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, required: true, trim: true },
    referralCode: { type: String, required: true, unique: true, uppercase: true, index: true },
    points: { type: Number, default: 0, min: 0 },
    completedBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ReferralAccount', referralAccountSchema);
