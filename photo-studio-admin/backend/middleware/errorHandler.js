const { sendError } = require('../utils/apiResponse');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return sendError(res, { statusCode: 400, message: `Invalid ${err.path}: ${err.value}` });
  }

  // Duplicate key (e.g. trackingNumber collision - shouldn't happen, but just in case)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(', ');
    return sendError(res, { statusCode: 409, message: `Duplicate value for field: ${field}` });
  }

  // Our own thrown ApiError
  if (err.statusCode) {
    return sendError(res, { statusCode: err.statusCode, message: err.message, errors: err.errors });
  }

  // Fallback: unexpected error
  return sendError(res, { statusCode: 500, message: 'Internal server error' });
}

function notFound(req, res) {
  return sendError(res, { statusCode: 404, message: `Route not found: ${req.originalUrl}` });
}

module.exports = { errorHandler, notFound };
