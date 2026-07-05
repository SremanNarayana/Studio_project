const mongoose = require('mongoose');

/**
 * Why a separate Counter collection instead of counting existing bookings?
 * - Counting documents (Booking.countDocuments() + 1) breaks the moment a
 *   booking is deleted: the next number can collide with an existing one.
 * - This pattern (a dedicated counter doc per year, incremented atomically
 *   with findOneAndUpdate) guarantees unique, gapless, race-condition-safe
 *   numbers even if two admins create a booking at the same instant.
 */
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. "MP-26"
  seq: { type: Number, default: 0 },
});

module.exports = mongoose.model('Counter', counterSchema);
