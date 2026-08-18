const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { ALLOWED_VARIABLES, getMsg91Configuration, getWhatsAppSettings } = require('../services/whatsappService');

const getSettings = asyncHandler(async (_req, res) => {
  const settings = await getWhatsAppSettings();
  const config = getMsg91Configuration();
  return sendSuccess(res, {
    data: {
      ...settings.toObject(),
      provider: 'msg91',
      authKeyConfigured: config.authKeyConfigured,
      integratedNumberConfigured: config.integratedNumberConfigured,
      allowedVariables: ALLOWED_VARIABLES,
    },
  });
});

const updateSettings = asyncHandler(async (req, res) => {
  const { enabled, stageTemplateName, bookingTemplateName, templateLanguage, messageTemplate, bookingMessageTemplate, trackingBaseUrl } = req.body;
  if (typeof enabled !== 'boolean') throw new ApiError(400, 'enabled must be true or false');
  if (!messageTemplate || messageTemplate.length > 1024) throw new ApiError(400, 'Message template is required and must be at most 1024 characters');
  if (!bookingMessageTemplate || bookingMessageTemplate.length > 1024) throw new ApiError(400, 'Booking message template is required and must be at most 1024 characters');
  if (trackingBaseUrl && !/^https?:\/\//i.test(trackingBaseUrl)) throw new ApiError(400, 'Tracking URL must start with http:// or https://');
  if (!/^[a-z]{2,3}(?:_[A-Z]{2})?$/.test(templateLanguage || '')) throw new ApiError(400, 'Template language must look like en_US');
  if (stageTemplateName && !/^[a-z0-9_]+$/.test(stageTemplateName)) throw new ApiError(400, 'Stage template name may contain only lowercase letters, numbers, and underscores');
  if (bookingTemplateName && !/^[a-z0-9_]+$/.test(bookingTemplateName)) throw new ApiError(400, 'Booking template name may contain only lowercase letters, numbers, and underscores');
  const unknown = [...`${messageTemplate} ${bookingMessageTemplate}`.matchAll(/{{\s*([a-zA-Z]+)\s*}}/g)].map((m) => m[1]).filter((name) => !ALLOWED_VARIABLES.includes(name));
  if (unknown.length) throw new ApiError(400, `Unknown WhatsApp variable: ${unknown[0]}`);
  if (enabled && !stageTemplateName?.trim()) throw new ApiError(400, 'Approved stage-update template name is required before enabling WhatsApp');
  if (enabled && !bookingTemplateName?.trim()) throw new ApiError(400, 'Approved booking template name is required before enabling WhatsApp');
  if (enabled && /{{\s*trackingUrl\s*}}/.test(`${messageTemplate} ${bookingMessageTemplate}`) && !trackingBaseUrl) {
    throw new ApiError(400, 'Tracking URL is required because a message template uses {{trackingUrl}}');
  }
  const config = getMsg91Configuration();
  if (enabled && (!config.authKeyConfigured || !config.integratedNumberConfigured)) {
    throw new ApiError(400, 'Configure the MSG91 auth key and integrated WhatsApp number on the backend before enabling WhatsApp');
  }

  const settings = await getWhatsAppSettings();
  Object.assign(settings, {
    enabled,
    stageTemplateName: stageTemplateName?.trim() || '',
    bookingTemplateName: bookingTemplateName?.trim() || '',
    templateLanguage: templateLanguage.trim(),
    messageTemplate: messageTemplate.trim(),
    bookingMessageTemplate: bookingMessageTemplate.trim(),
    trackingBaseUrl: (trackingBaseUrl || '').trim().replace(/\/$/, ''),
  });
  await settings.save();
  return sendSuccess(res, { message: 'WhatsApp settings saved', data: settings });
});

module.exports = { getSettings, updateSettings };
