/**
 * Standard success envelope: { success, message, data, meta? }
 * `meta` is used for pagination info (page, limit, total, totalPages).
 */
function sendSuccess(res, { statusCode = 200, message = 'Success', data = null, meta = null }) {
  const body = { success: true, message, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}

/**
 * Standard error envelope: { success, message, errors? }
 * `errors` carries field-level validation messages when available.
 */
function sendError(res, { statusCode = 500, message = 'Something went wrong', errors = null }) {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
}

module.exports = { sendSuccess, sendError };
