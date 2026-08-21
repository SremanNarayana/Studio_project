require('dotenv').config();
const connectDB = require('../config/db');
const ReferralReward = require('../models/ReferralReward');

(async () => {
  await connectDB();
  const indexes = await ReferralReward.collection.indexes();
  for (const index of indexes) {
    if (index.key?.referralCode === 1 && index.unique) {
      await ReferralReward.collection.dropIndex(index.name);
      console.log(`Dropped legacy unique referral-code index: ${index.name}`);
    }
  }
  await ReferralReward.syncIndexes();
  console.log('Referral indexes migrated.');
  process.exit(0);
})().catch((error) => { console.error(error); process.exit(1); });
