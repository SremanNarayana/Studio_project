import React from 'react';
import Sidebar from '../components/Sidebar.jsx';

export default function AdminLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main className="grid-backdrop" style={{ flex: 1, padding: '32px 40px 60px', minWidth: 0 }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>{children}</div>
      </main>
    </div>
  );
}
