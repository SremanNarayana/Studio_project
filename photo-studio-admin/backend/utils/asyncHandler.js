// Wraps an async route handler and forwards any thrown error to Express's
// error-handling middleware, instead of needing try/catch in every controller.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
