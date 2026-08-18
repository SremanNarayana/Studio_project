const WhatsAppSettings = require('../models/WhatsAppSettings');

const ALLOWED_VARIABLES = ['clientName', 'trackingId', 'stageName', 'trackingUrl', 'paymentAmount', 'paymentDescription', 'paymentLine', 'totalPaid', 'balanceAmount', 'paymentStatus'];
const LEGACY_META_BOOKING_TEMPLATE = 'Hello {{clientName}}, your Malayaan Photography booking is confirmed. Booking ID: {{trackingId}}. Track it here: {{trackingUrl}}';
const LEGACY_META_STAGE_TEMPLATE = 'Hello {{clientName}}, booking {{trackingId}} is now at {{stageName}}. {{paymentLine}} Total paid: {{totalPaid}}. Balance: {{balanceAmount}}. Track: {{trackingUrl}}';
const MSG91_BOOKING_TEMPLATE = 'Hello {{clientName}}, your booking with Malayaan Photography is confirmed. Your booking ID is {{trackingId}}. We will keep you updated about the progress.';
const PREVIOUS_MSG91_STAGE_TEMPLATE = 'Hello {{clientName}}, booking {{trackingId}} has been updated to {{stageName}}. {{paymentLine}} Total paid: {{totalPaid}}. Balance: {{balanceAmount}}.';
const MSG91_STAGE_TEMPLATE = 'Hello {{clientName}}, this is an update from Malayaan Photography regarding your confirmed booking {{trackingId}}. The current project stage is {{stageName}}. Payment information: {{paymentLine}}. The total amount received so far is {{totalPaid}}, and the remaining balance is {{balanceAmount}}. Thank you for choosing Malayaan Photography.';

function normalizeIndianMobile(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  return null;
}

function getMsg91Configuration() {
  const authKey = String(process.env.MSG91_AUTH_KEY || '').trim();
  const integratedNumber = String(process.env.MSG91_WHATSAPP_INTEGRATED_NUMBER || '').replace(/\D/g, '');
  return {
    authKey,
    integratedNumber,
    authKeyConfigured: Boolean(authKey && authKey !== 'your_msg91_auth_key'),
    integratedNumberConfigured: /^\d{10,15}$/.test(integratedNumber),
  };
}

function renderTemplate(template, variables) {
  return String(template || '').replace(/{{\s*([a-zA-Z]+)\s*}}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(variables, key) ? String(variables[key]) : match
  );
}

async function getWhatsAppSettings() {
  const settings = await WhatsAppSettings.findOneAndUpdate(
    { key: 'default' },
    { $setOnInsert: { key: 'default' } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  let changed = false;
  if (settings.provider !== 'msg91') {
    settings.provider = 'msg91';
    changed = true;
  }
  if (settings.bookingMessageTemplate === LEGACY_META_BOOKING_TEMPLATE) {
    settings.bookingMessageTemplate = MSG91_BOOKING_TEMPLATE;
    changed = true;
  }
  if (settings.messageTemplate === LEGACY_META_STAGE_TEMPLATE || settings.messageTemplate === PREVIOUS_MSG91_STAGE_TEMPLATE) {
    settings.messageTemplate = MSG91_STAGE_TEMPLATE;
    changed = true;
  }
  if (settings.trackingBaseUrl === 'http://localhost:3000/track') {
    settings.trackingBaseUrl = '';
    changed = true;
  }
  if (changed) await settings.save();
  return settings;
}

function getTemplateComponents(messageTemplate, allVariables) {
  return Object.fromEntries(
    [...String(messageTemplate).matchAll(/{{\s*([a-zA-Z]+)\s*}}/g)].map((match, index) => [
      `body_${index + 1}`,
      { type: 'text', value: String(allVariables[match[1]] ?? '').slice(0, 1024) },
    ])
  );
}

async function sendWithMsg91({ settings, booking, templateName, messageTemplate, variables, logLabel }) {
  const trackingUrl = settings.trackingBaseUrl
    ? `${settings.trackingBaseUrl.replace(/\/$/, '')}?id=${encodeURIComponent(booking.trackingNumber)}`
    : '';
  const allVariables = { clientName: booking.personalDetails.fullName, trackingId: booking.trackingNumber, trackingUrl, ...variables };
  const renderedMessage = renderTemplate(messageTemplate, allVariables);

  if (!settings.enabled) {
    console.log(`[WhatsApp log-only:${logLabel}] ${booking.personalDetails.phoneNumber}: ${renderedMessage}`);
    return { sent: false, mode: 'log-only', message: renderedMessage };
  }
  const config = getMsg91Configuration();
  if (!config.authKeyConfigured || !config.integratedNumberConfigured || !templateName) {
    throw new Error('WhatsApp is enabled but the MSG91 auth key, integrated number, or template name is missing');
  }
  const mobile = normalizeIndianMobile(booking.personalDetails.phoneNumber);
  if (!mobile) throw new Error('Client phone number is not a valid Indian mobile number');

  const components = getTemplateComponents(messageTemplate, allVariables);
  const endpoint = process.env.MSG91_WHATSAPP_API_URL
    || 'https://control.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      authkey: config.authKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      integrated_number: config.integratedNumber,
      content_type: 'template',
      payload: {
        messaging_product: 'whatsapp',
        type: 'template',
        template: {
          name: templateName,
          language: { code: settings.templateLanguage, policy: 'deterministic' },
          ...(process.env.MSG91_WHATSAPP_NAMESPACE
            ? { namespace: process.env.MSG91_WHATSAPP_NAMESPACE }
            : {}),
          to_and_components: [{
            to: [mobile],
            components,
            CRQID: `${logLabel}-${booking.trackingNumber}-${Date.now()}`,
          }],
        },
      },
    }),
    signal: AbortSignal.timeout(10000),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.error || result.type === 'error' || result.status === 'error' || result.success === false) {
    const detail = result.error?.message || result.message || result.description;
    throw new Error(detail || `MSG91 WhatsApp request failed with status ${response.status}`);
  }
  return {
    sent: true,
    mode: 'msg91',
    messageId: result.message_id || result.request_id || result.data?.message_id || null,
  };
}

async function sendStageUpdateWhatsApp(booking, stageName, paymentEntry = null) {
  const settings = await getWhatsAppSettings();
  const paymentAmount = paymentEntry
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paymentEntry.amount || 0)
    : '';
  const paymentDescription = paymentEntry?.description || '';
  const paymentLine = paymentEntry
    ? `Payment received: ${paymentAmount} (${paymentDescription})`
    : 'No new payment recorded.';
  return sendWithMsg91({
    settings,
    booking,
    templateName: settings.stageTemplateName,
    messageTemplate: settings.messageTemplate,
    variables: {
      stageName,
      paymentAmount,
      paymentDescription,
      paymentLine,
      totalPaid: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(booking.payment?.paidAmount || booking.payment?.advancePayment || 0),
      balanceAmount: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(booking.payment?.balancePayment || 0),
      paymentStatus: booking.payment?.paymentStatus || 'Pending',
    },
    logLabel: 'stage',
  });
}

async function sendBookingCreatedWhatsApp(booking) {
  const settings = await getWhatsAppSettings();
  return sendWithMsg91({ settings, booking, templateName: settings.bookingTemplateName, messageTemplate: settings.bookingMessageTemplate, variables: {}, logLabel: 'booking' });
}

module.exports = {
  ALLOWED_VARIABLES,
  getMsg91Configuration,
  getWhatsAppSettings,
  renderTemplate,
  sendStageUpdateWhatsApp,
  sendBookingCreatedWhatsApp,
};
