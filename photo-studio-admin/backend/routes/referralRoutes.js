const express = require('express');
const router = express.Router();
const { listReferralAccounts, getReferralUsage, redeemReferralPoints } = require('../controllers/referralController');

router.get('/', listReferralAccounts);
router.get('/:id/usage', getReferralUsage);
router.post('/:id/redeem', redeemReferralPoints);

module.exports = router;
