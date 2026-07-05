import React from 'react';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const goTo = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    onChange(p);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, padding: '16px 4px' }}>
      <button className="btn btn-ghost btn-sm" onClick={() => goTo(page - 1)} disabled={page === 1}>
        Previous
      </button>
      <span style={{ fontSize: 13, color: 'var(--ink-600)', padding: '0 6px' }}>
        Page {page} of {totalPages}
      </span>
      <button className="btn btn-ghost btn-sm" onClick={() => goTo(page + 1)} disabled={page === totalPages}>
        Next
      </button>
    </div>
  );
}
