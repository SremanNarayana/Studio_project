require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Booking = require('../models/Booking');
const { createReferralAccount } = require('../services/referralService');

async function run() {
  await connectDB();
  const completedBookings = await Booking.find({
    projectTimeline: { $elemMatch: { stageName: 'Delivery', status: 'Completed' } },
  }).sort({ createdAt: 1 });

  let issued = 0;
  for (const booking of completedBookings) {
    const before = await require('../models/ReferralAccount').exists({
      phoneNumber: String(booking.personalDetails.phoneNumber || '').replace(/\D/g, ''),
    });
    await createReferralAccount(booking);
    if (!before) issued += 1;
  }

  console.log(`Referral backfill complete: ${issued} code(s) issued; ${completedBookings.length} completed booking(s) checked.`);
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error('Referral backfill failed:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
