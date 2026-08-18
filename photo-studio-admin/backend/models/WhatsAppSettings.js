const mongoose = require('mongoose');

const whatsappSettingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'default' },
  enabled: { type: Boolean, default: false },
  provider: { type: String, enum: ['msg91'], default: 'msg91' },
  stageTemplateName: { type: String, trim: true, default: '' },
  bookingTemplateName: { type: String, trim: true, default: '' },
  templateLanguage: { type: String, trim: true, default: 'en_US' },
  bookingMessageTemplate: {
    type: String, trim: true, maxlength: 1024,
    default: 'Hello {{clientName}}, your booking with Malayaan Photography is confirmed. Your booking ID is {{trackingId}}. We will keep you updated about the progress.',
  },
  messageTemplate: {
    type: String, trim: true, maxlength: 1024,
    default: 'Hello {{clientName}}, this is an update from Malayaan Photography regarding your confirmed booking {{trackingId}}. The current project stage is {{stageName}}. Payment information: {{paymentLine}}. The total amount received so far is {{totalPaid}}, and the remaining balance is {{balanceAmount}}. Thank you for choosing Malayaan Photography.',
  },
  trackingBaseUrl: { type: String, trim: true, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('WhatsAppSettings', whatsappSettingsSchema);
