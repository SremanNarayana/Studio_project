const { body, validationResult } = require('express-validator');
const { SHOOT_TYPES } = require('../config/constants');
const { sendError } = require('../utils/apiResponse');

function handleValidation(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return sendError(res, {
      statusCode: 400,
      message: 'Validation failed',
      errors: result.array().map((error) => error.msg),
    });
  }
  return next();
}

const validatePublicBooking = [
  body('fullName').isString().trim().isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  body('phoneNumber')
    .isString()
    .trim()
    .matches(/^\+?[0-9 ()-]{7,20}$/)
    .withMessage('Phone number looks invalid'),
  body('emailAddress').optional({ checkFalsy: true }).trim().isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('instagram').optional({ checkFalsy: true }).isString().trim().isLength({ max: 100 }).withMessage('Instagram must be at most 100 characters'),
  body('shootType').isIn(SHOOT_TYPES).withMessage('Invalid shoot type'),
  body('eventDate')
    .isISO8601({ strict: true })
    .withMessage('Invalid event date')
    .custom((value) => {
      const eventDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) throw new Error('Event date cannot be in the past');
      return true;
    }),
  body('eventTime').optional({ checkFalsy: true }).matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('Event time must use HH:mm format'),
  body('venueName').optional({ checkFalsy: true }).isString().trim().isLength({ max: 150 }).withMessage('Venue name must be at most 150 characters'),
  body('venueAddress').optional({ checkFalsy: true }).isString().trim().isLength({ max: 500 }).withMessage('Venue address must be at most 500 characters'),
  handleValidation,
];

const validateTrackingLookup = [
  body('trackingNumber').isString().trim().matches(/^MP-\d{2}-\d{3,}$/i).withMessage('Invalid tracking ID'),
  body('phoneNumber').isString().trim().matches(/^\+?[0-9 ()-]{7,20}$/).withMessage('Phone number looks invalid'),
  handleValidation,
];

module.exports = { validatePublicBooking, validateTrackingLookup };
