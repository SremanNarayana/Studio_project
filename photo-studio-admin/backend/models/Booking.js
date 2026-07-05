const mongoose = require('mongoose');
const {
  SHOOT_TYPES,
  PACKAGES,
  PAYMENT_STATUS,
  STAGE_STATUS,
  PROJECT_STAGES,
  REQUIREMENTS,
  APPROVAL_STATUS,
} = require('../config/constants');

/**
 * Sub-schema: one entry per project stage (Booking, Pre Wedding Shoot, ...).
 * Embedded (not a separate collection) because stages are always read/written
 * together with their parent booking and never queried independently.
 */
const projectStageSchema = new mongoose.Schema(
  {
    stageName: {
      type: String,
      enum: PROJECT_STAGES,
      required: true,
    },
    status: {
      type: String,
      enum: STAGE_STATUS,
      default: 'Pending',
    },
    completedDate: {
      type: Date,
      default: null,
    },
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    trackingNumber: {
      type: String,
      unique: true,
      index: true,
      // Not `required` at validation time - it's generated in a pre-save hook
      // before validation would ever see it missing.
    },

    // Public booking requests remain pending until the studio reviews them.
    approvalStatus: {
      type: String,
      enum: APPROVAL_STATUS,
      default: 'Pending',
      index: true,
    },
    approvalUpdatedAt: { type: Date, default: null },

    // ---------- Personal Details ----------
    personalDetails: {
      fullName: { type: String, required: true, trim: true },
      phoneNumber: { type: String, required: true, trim: true },
      emailAddress: { type: String, trim: true, lowercase: true },
      instagram: { type: String, trim: true },
    },

    // ---------- Event Details ----------
    eventDetails: {
      shootType: { type: String, enum: SHOOT_TYPES, required: true },
      eventDate: { type: Date, required: true },
      eventTime: { type: String, trim: true }, // stored as "HH:mm" string
      venueName: { type: String, trim: true },
      venueAddress: { type: String, trim: true },
    },

    // ---------- Photography Requirements ----------
    requirements: [{ type: String, enum: REQUIREMENTS }],
    albumRequired: { type: Boolean, default: false },

    // ---------- Package ----------
    package: {
      type: { type: String, enum: PACKAGES, required: true },
      customDescription: { type: String, trim: true }, // used when type === 'Custom'
    },

    // ---------- Payments ----------
    payment: {
      totalAmount: { type: Number, required: true, min: 0, default: 0 },
      advancePayment: { type: Number, min: 0, default: 0 },
      balancePayment: { type: Number, min: 0, default: 0 },
      paymentStatus: { type: String, enum: PAYMENT_STATUS, default: 'Pending' },
    },

    // ---------- Project Timeline ----------
    // Auto-seeded with every PROJECT_STAGES entry (all "Pending") on creation.
    projectTimeline: [projectStageSchema],
    currentStage: {
      type: String,
      enum: PROJECT_STAGES,
      default: PROJECT_STAGES[0],
    },
    estimatedDeliveryDate: { type: Date, default: null },
    adminNotes: { type: String, trim: true, default: '' },
  },
  { timestamps: true } // createdAt / updatedAt
);

// ---------- Hooks ----------

// Keep balancePayment in sync with total - advance whenever either changes.
bookingSchema.pre('save', function keepBalanceInSync(next) {
  const total = this.payment?.totalAmount || 0;
  const advance = this.payment?.advancePayment || 0;
  this.payment.balancePayment = Math.max(total - advance, 0);

  if (this.payment.balancePayment === 0 && total > 0) {
    this.payment.paymentStatus = 'Completed';
  } else if (advance > 0) {
    this.payment.paymentStatus = 'Partial';
  } else {
    this.payment.paymentStatus = 'Pending';
  }
  next();
});

// Seed the full project timeline on first creation only.
bookingSchema.pre('validate', function seedTimeline(next) {
  if (this.isNew && (!this.projectTimeline || this.projectTimeline.length === 0)) {
    this.projectTimeline = PROJECT_STAGES.map((stageName) => ({
      stageName,
      status: 'Pending',
      completedDate: null,
      remarks: '',
    }));
  }
  next();
});

// ---------- Indexes for search/filter/sort performance ----------
bookingSchema.index({ 'personalDetails.fullName': 'text', trackingNumber: 'text' });
bookingSchema.index({ 'eventDetails.eventDate': 1 });
bookingSchema.index({ currentStage: 1 });
bookingSchema.index({ 'payment.paymentStatus': 1 });

module.exports = mongoose.model('Booking', bookingSchema);
