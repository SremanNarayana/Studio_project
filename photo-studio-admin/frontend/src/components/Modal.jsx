import React from 'react';

export default function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10, 31, 61, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card"
        style={{
          width: '100%',
          maxWidth: 440,
          padding: 28,
          boxShadow: 'var(--shadow-pop)',
          animation: 'modalIn 0.16s ease',
        }}
      >
        {title && (
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 21, margin: '0 0 12px', color: 'var(--navy-900)' }}>
            {title}
          </h3>
        )}
        <div style={{ fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.6 }}>{children}</div>
        {footer && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>{footer}</div>}
      </div>
      <style>{`
        @keyframes modalIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}
