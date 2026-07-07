import React from 'react';
import { NavLink } from 'react-router-dom';
import malayaanLogo from '../assets/malayaan-logo.png';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '◧', end: true },
  { to: '/bookings', label: 'Bookings', icon: '◨' },
  { to: '/bookings/new', label: 'New Booking', icon: '＋' },
  { to: '/analytics', label: 'Analytics', icon: '↗' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
];

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 'var(--sidebar-w)',
        minWidth: 'var(--sidebar-w)',
        background: 'var(--navy-900)',
        color: 'var(--white)',
        display: 'flex',
        flexDirection: 'column',
        padding: '26px 18px',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 30px' }}>
        <img
          src={malayaanLogo}
          alt="Malayaan Photography logo"
          style={{
            width: 50,
            height: 50,
            borderRadius: 12,
            objectFit: 'cover',
            background: 'rgba(255,255,255,0.92)',
            padding: 4,
            boxShadow: '0 10px 26px rgba(0,0,0,0.16)',
          }}
        />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, lineHeight: 1.1 }}>
            Malayaan Photography
          </div>
          <div style={{ fontSize: 11, color: 'var(--gold-100)', opacity: 0.7 }}>Studio Admin</div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '11px 14px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              color: isActive ? 'var(--navy-900)' : 'rgba(255,255,255,0.82)',
              background: isActive ? 'var(--gold-500)' : 'transparent',
            })}
          >
            <span style={{ fontSize: 15, width: 18, textAlign: 'center' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 10px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--gold-100)',
            color: 'var(--navy-900)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          A
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Admin</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>Malayaan Photography</div>
        </div>
      </div>
    </aside>
  );
}
