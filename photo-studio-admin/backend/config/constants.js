// Single source of truth for all enum-like values.
// Keeping these here (instead of hardcoding in schemas/controllers) means
// the client portal, when it's built later, can import the exact same list.

const SHOOT_TYPES = [
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

const PACKAGES = ['Basic', 'Standard', 'Premium', 'Custom'];

const PAYMENT_STATUS = ['Pending', 'Partial', 'Completed'];

const STAGE_STATUS = ['Pending', 'In Progress', 'Completed'];

// Ordered list of stages every project moves through.
// Order matters: it drives the vertical timeline/stepper on the frontend
// and determines what "current stage" means.
const PROJECT_STAGES = [
  'Booking',
  'Pre Wedding Shoot',
  'Wedding Shoot',
  'Post Wedding Shoot',
  'Selection',
  'Editing',
  'MVP Copy',
  'Delivery',
];

const REQUIREMENTS = [
  'Photography',
  'Videography',
  'Drone Coverage',
  'Candid Photography',
  'Traditional Photography',
  'Live Streaming',
  'Photo Booth',
];

const APPROVAL_STATUS = ['Pending', 'Approved', 'Rejected'];

module.exports = {
  SHOOT_TYPES,
  PACKAGES,
  PAYMENT_STATUS,
  STAGE_STATUS,
  PROJECT_STAGES,
  REQUIREMENTS,
  APPROVAL_STATUS,
};
