const mongoose = require('mongoose');

const smsSettingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'default' },
  enabled: { type: Boolean, default: false },
  provider: { type: String, enum: ['msg91'], default: 'msg91' },
  templateId: { type: String, trim: true, default: '' },
  messageTemplate: {
    type: String, trim: true, maxlength: 500,
    default: 'Momento Frames: Booking {{trackingId}} is now at {{stageName}}. Visit our website to track your project.',
  },
  trackingBaseUrl: { type: String, trim: true, default: 'http://localhost:3000/track' },
}, { timestamps: true });

module.exports = mongoose.model('SmsSettings', smsSettingsSchema);
