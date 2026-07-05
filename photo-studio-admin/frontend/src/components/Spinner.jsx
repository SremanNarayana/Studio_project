import React from 'react';

export default function Spinner({ size = 28, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 40 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: '3px solid var(--paper-grid)',
          borderTopColor: 'var(--gold-500)',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {label && <span style={{ fontSize: 13, color: 'var(--ink-600)' }}>{label}</span>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
