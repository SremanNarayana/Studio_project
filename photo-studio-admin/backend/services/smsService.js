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
  return SmsSettings.findOneAndUpdate(
    { key: 'default' }, { $setOnInsert: { key: 'default' } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
}

async function sendStageUpdateSms(booking, stageName) {
  const settings = await getSmsSettings();
  const trackingUrl = `${settings.trackingBaseUrl.replace(/\/$/, '')}?id=${encodeURIComponent(booking.trackingNumber)}`;
  const variables = { clientName: booking.personalDetails.fullName, trackingId: booking.trackingNumber, stageName, trackingUrl };
  const renderedMessage = renderTemplate(settings.messageTemplate, variables);

  if (!settings.enabled) {
    console.log(`[SMS log-only] ${booking.personalDetails.phoneNumber}: ${renderedMessage}`);
    return { sent: false, mode: 'log-only', message: renderedMessage };
  }
  if (!process.env.MSG91_AUTH_KEY || !settings.templateId) {
    throw new Error('MSG91 is enabled but MSG91_AUTH_KEY or Template ID is missing');
  }
  const mobile = normalizeIndianMobile(booking.personalDetails.phoneNumber);
  if (!mobile) throw new Error('Client phone number is not a valid Indian mobile number');

  const recipient = { mobiles: mobile };
  const usedVariables = new Set([...settings.messageTemplate.matchAll(/{{\s*([a-zA-Z]+)\s*}}/g)].map((match) => match[1]));
  for (const key of ALLOWED_VARIABLES) {
    if (usedVariables.has(key)) recipient[key] = String(variables[key]).slice(0, 40);
  }
  const response = await fetch('https://control.msg91.com/api/v5/flow', {
    method: 'POST',
    headers: { accept: 'application/json', authkey: process.env.MSG91_AUTH_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({ template_id: settings.templateId, short_url: '0', realTimeResponse: '1', recipients: [recipient] }),
    signal: AbortSignal.timeout(10000),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.type === 'error') throw new Error(result.message || `MSG91 request failed with status ${response.status}`);
  return { sent: true, mode: 'msg91', requestId: result.request_id || result.requestId || null };
}

module.exports = { ALLOWED_VARIABLES, getSmsSettings, renderTemplate, sendStageUpdateSms };
