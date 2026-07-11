const { body, validationResult } = require('express-validator');
const { SHOOT_TYPES, PACKAGES, REQUIREMENTS } = require('../config/constants');
const { sendError } = require('../utils/apiResponse');

// Rules reused for both create (all required) and update (all optional).
const bookingRules = (isUpdate = false) => {
  const wrap = (chain) => (isUpdate ? chain.optional() : chain);

  return [
    wrap(body('personalDetails.fullName').trim()).notEmpty().withMessage('Full name is required'),
    wrap(body('personalDetails.phoneNumber').trim())
      .notEmpty()
      .withMessage('Phone number is required')
      .isLength({ min: 7, max: 15 })
      .withMessage('Phone number looks invalid'),
    body('personalDetails.emailAddress').optional({ checkFalsy: true }).isEmail().withMessage('Invalid email address'),

    wrap(body('eventDetails.shootType'))
      .notEmpty()
      .withMessage('Shoot type is required')
      .isIn(SHOOT_TYPES)
      .withMessage('Invalid shoot type'),
    wrap(body('eventDetails.eventDate')).notEmpty().withMessage('Event date is required').isISO8601().withMessage('Invalid event date'),

    body('requirements').optional().isArray().withMessage('Requirements must be an array'),
    body('requirements.*').optional().isIn(REQUIREMENTS).withMessage('Invalid requirement value'),

    wrap(body('package.type'))
      .notEmpty()
      .withMessage('Package selection is required')
      .isIn(PACKAGES)
      .withMessage('Invalid package'),

    body('payment.totalAmount').optional().isFloat({ min: 0 }).withMessage('Total amount must be a positive number'),
    body('payment.paymentEntries').optional().isArray().withMessage('Payment entries must be an array'),
    body('payment.paymentEntries.*.amount').optional().isFloat({ min: 0 }).withMessage('Payment amount must be a positive number'),
    body('payment.paymentEntries.*.description').optional().trim().notEmpty().withMessage('Payment description is required'),
    body('payment.paymentEntries.*.receivedOn').optional({ checkFalsy: true }).isISO8601().withMessage('Payment date must be valid'),
  ];
};

function handleValidation(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array().map((e) => e.msg);
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors });
  }
  next();
}

module.exports = {
  validateCreateBooking: [...bookingRules(false), handleValidation],
  validateUpdateBooking: [...bookingRules(true), handleValidation],
};
