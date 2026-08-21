require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Counter = require('../models/Counter');
const ReferralAccount = require('../models/ReferralAccount');
const ReferralReward = require('../models/ReferralReward');
const GalleryImage = require('../models/GalleryImage');

if (process.env.CONFIRM_RESET !== 'RESET_PHOTOGRAPHY_DB') {
  console.error('Refusing to reset data. Set CONFIRM_RESET=RESET_PHOTOGRAPHY_DB to continue.');
  process.exit(1);
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const results = await Promise.all([
    Booking.deleteMany({}),
    Counter.deleteMany({}),
    ReferralAccount.deleteMany({}),
    ReferralReward.deleteMany({}),
    GalleryImage.deleteMany({}),
  ]);
  console.log(`Reset complete. Deleted ${results.reduce((sum, result) => sum + result.deletedCount, 0)} documents.`);
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error(`Reset failed: ${error.message}`);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
