export const SHOOT_TYPES = [
  'Wedding',
  'Engagement',
  'Pre-Wedding',
  'Maternity',
  'Baby Shoot',
  'Baby & Newborn',
  'Family Portrait',
  'Traditional Event',
  'Birthday',
  'Corporate',
  'Product Shoot',
  'Portrait',
  'Other',
];

export const PACKAGES = ['Basic', 'Standard', 'Premium', 'Custom'];

export const PAYMENT_STATUS = ['Pending', 'Partial', 'Completed'];

export const STAGE_STATUS = ['Pending', 'In Progress', 'Completed'];

export const PROJECT_STAGES = [
  'Booking',
  'Pre Wedding Shoot',
  'Wedding Shoot',
  'Post Wedding Shoot',
  'Selection',
  'Editing',
  'MVP Copy',
  'Delivery',
];

export const REQUIREMENTS = [
  'Photography',
  'Videography',
  'Drone Coverage',
  'Candid Photography',
  'Traditional Photography',
  'Live Streaming',
  'Photo Booth',
];

export const EMPTY_BOOKING = {
  personalDetails: { fullName: '', phoneNumber: '', emailAddress: '', instagram: '' },
  eventDetails: { shootType: '', eventDate: '', eventTime: '', venueName: '', venueAddress: '' },
  requirements: [],
  albumRequired: false,
  package: { type: '', customDescription: '' },
  payment: { totalAmount: 0, paymentEntries: [] },
  estimatedDeliveryDate: '',
  adminNotes: '',
};
