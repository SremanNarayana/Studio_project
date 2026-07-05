import React from 'react';

const MAP = {
  // Payment status
  Completed: 'badge-success',
  Partial: 'badge-warning',
  Pending: 'badge-neutral',
  'Pending Approval': 'badge-warning',
  Approved: 'badge-success',
  // Stage status
  'In Progress': 'badge-info',
};

export default function StatusBadge({ status }) {
  const cls = MAP[status] || 'badge-neutral';
  return <span className={`badge ${cls}`}>{status}</span>;
}
