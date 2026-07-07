const mongoose = require('mongoose');

const smsSettingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'default' },
  enabled: { type: Boolean, default: false },
  provider: { type: String, enum: ['msg91'], default: 'msg91' },
  templateId: { type: String, trim: true, default: '' },
  bookingTemplateId: { type: String, trim: true, default: '' },
  bookingMessageTemplate: {
    type: String, trim: true, maxlength: 500,
    default: 'Malayaan Photography: Your booking is confirmed. Booking ID: {{trackingId}}. Use this ID on our website to track your project.',
  },
  messageTemplate: {
    type: String, trim: true, maxlength: 500,
    default: 'Malayaan Photography: Booking {{trackingId}} is now at {{stageName}}. Visit our website to track your project.',
  },
  trackingBaseUrl: { type: String, trim: true, default: 'http://localhost:3000/track' },
}, { timestamps: true });

module.exports = mongoose.model('SmsSettings', smsSettingsSchema);
