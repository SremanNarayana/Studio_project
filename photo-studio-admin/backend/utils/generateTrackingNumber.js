const Counter = require('../models/Counter');

/**
 * Generates the next tracking number in the format MP-{YY}-{001}.
 * Uses findOneAndUpdate with $inc + upsert so the increment is atomic at the
 * database level - safe even under concurrent booking creation.
 */
async function generateTrackingNumber() {
  const yearSuffix = String(new Date().getFullYear()).slice(-2); // "26"
  const counterId = `MP-${yearSuffix}`;

  const counter = await Counter.findOneAndUpdate(
    { _id: counterId },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const paddedSeq = String(counter.seq).padStart(3, '0'); // "001"
  return `${counterId}-${paddedSeq}`; // "MP-26-001"
}

module.exports = generateTrackingNumber;
