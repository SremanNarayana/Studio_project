const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { ALLOWED_VARIABLES, getSmsSettings } = require('../services/smsService');

const getSettings = asyncHandler(async (_req, res) => {
  const settings = await getSmsSettings();
  return sendSuccess(res, { data: { ...settings.toObject(), authKeyConfigured: Boolean(process.env.MSG91_AUTH_KEY), allowedVariables: ALLOWED_VARIABLES } });
});

const updateSettings = asyncHandler(async (req, res) => {
  const { enabled, templateId, messageTemplate, trackingBaseUrl } = req.body;
  if (typeof enabled !== 'boolean') throw new ApiError(400, 'enabled must be true or false');
  if (!messageTemplate || messageTemplate.length > 500) throw new ApiError(400, 'Message template is required and must be at most 500 characters');
  if (!trackingBaseUrl || !/^https?:\/\//i.test(trackingBaseUrl)) throw new ApiError(400, 'Tracking URL must start with http:// or https://');
  const unknown = [...messageTemplate.matchAll(/{{\s*([a-zA-Z]+)\s*}}/g)].map((m) => m[1]).filter((name) => !ALLOWED_VARIABLES.includes(name));
  if (unknown.length) throw new ApiError(400, `Unknown SMS variable: ${unknown[0]}`);
  if (enabled && !templateId?.trim()) throw new ApiError(400, 'MSG91 Template ID is required before enabling SMS');

  const settings = await getSmsSettings();
  Object.assign(settings, { enabled, templateId: templateId?.trim() || '', messageTemplate: messageTemplate.trim(), trackingBaseUrl: trackingBaseUrl.trim().replace(/\/$/, '') });
  await settings.save();
  return sendSuccess(res, { message: 'SMS settings saved', data: settings });
});

module.exports = { getSettings, updateSettings };
