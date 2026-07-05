import React from 'react';

export default function StatCard({ icon, label, value, accent = 'navy' }) {
  const accents = {
    navy: { bg: 'var(--navy-900)', fg: 'var(--white)' },
    gold: { bg: 'var(--gold-500)', fg: 'var(--navy-900)' },
    success: { bg: 'var(--success)', fg: 'var(--white)' },
    info: { bg: 'var(--info)', fg: 'var(--white)' },
  };
  const a = accents[accent] || accents.navy;

  return (
    <div className="card" style={{ padding: 22, minWidth: 0 }}>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: a.bg,
          color: a.fg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 19,
          marginBottom: 22,
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--ink-400)', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, color: 'var(--navy-900)', marginTop: 4 }}>
        {value}
      </div>
    </div>
  );
}
