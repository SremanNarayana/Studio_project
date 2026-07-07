const SmsSettings = require('../models/SmsSettings');

const ALLOWED_VARIABLES = ['clientName', 'trackingId', 'stageName', 'trackingUrl'];

function normalizeIndianMobile(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  return null;
}

function renderTemplate(template, variables) {
  return String(template || '').replace(/{{\s*([a-zA-Z]+)\s*}}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(variables, key) ? String(variables[key]) : match
  );
}

async function getSmsSettings() {
  const settings = await SmsSettings.findOneAndUpdate(
    { key: 'default' }, { $setOnInsert: { key: 'default' } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  if (!settings.bookingMessageTemplate) {
    settings.bookingMessageTemplate = 'Momento Frames: Your booking is confirmed. Booking ID: {{trackingId}}. Use this ID on our website to track your project.';
    await settings.save();
  }
  return settings;
}

async function sendWithMsg91({ settings, booking, templateId, messageTemplate, variables, logLabel }) {
  const trackingUrl = `${settings.trackingBaseUrl.replace(/\/$/, '')}?id=${encodeURIComponent(booking.trackingNumber)}`;
  const allVariables = { clientName: booking.personalDetails.fullName, trackingId: booking.trackingNumber, trackingUrl, ...variables };
  const renderedMessage = renderTemplate(messageTemplate, allVariables);

  if (!settings.enabled) {
    console.log(`[SMS log-only:${logLabel}] ${booking.personalDetails.phoneNumber}: ${renderedMessage}`);
    return { sent: false, mode: 'log-only', message: renderedMessage };
  }
  if (!process.env.MSG91_AUTH_KEY || !templateId) {
    throw new Error('MSG91 is enabled but MSG91_AUTH_KEY or Template ID is missing');
  }
  const mobile = normalizeIndianMobile(booking.personalDetails.phoneNumber);
  if (!mobile) throw new Error('Client phone number is not a valid Indian mobile number');

  const recipient = { mobiles: mobile };
  const usedVariables = new Set([...messageTemplate.matchAll(/{{\s*([a-zA-Z]+)\s*}}/g)].map((match) => match[1]));
  for (const key of ALLOWED_VARIABLES) {
    if (usedVariables.has(key)) recipient[key] = String(allVariables[key]).slice(0, 40);
  }
  const response = await fetch('https://control.msg91.com/api/v5/flow', {
    method: 'POST',
    headers: { accept: 'application/json', authkey: process.env.MSG91_AUTH_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({ template_id: templateId, short_url: '0', realTimeResponse: '1', recipients: [recipient] }),
    signal: AbortSignal.timeout(10000),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.type === 'error') throw new Error(result.message || `MSG91 request failed with status ${response.status}`);
  return { sent: true, mode: 'msg91', requestId: result.request_id || result.requestId || null };
}

async function sendStageUpdateSms(booking, stageName) {
  const settings = await getSmsSettings();
  return sendWithMsg91({ settings, booking, templateId: settings.templateId, messageTemplate: settings.messageTemplate, variables: { stageName }, logLabel: 'stage' });
}

async function sendBookingCreatedSms(booking) {
  const settings = await getSmsSettings();
  return sendWithMsg91({ settings, booking, templateId: settings.bookingTemplateId, messageTemplate: settings.bookingMessageTemplate, variables: {}, logLabel: 'booking' });
}

module.exports = { ALLOWED_VARIABLES, getSmsSettings, renderTemplate, sendStageUpdateSms, sendBookingCreatedSms };
