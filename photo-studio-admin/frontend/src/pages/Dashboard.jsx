import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dashboardService from '../services/dashboardService';
import StatCard from '../components/StatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import Spinner from '../components/Spinner.jsx';
import { useToast } from '../hooks/useToast.jsx';

const currency = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    let mounted = true;
    dashboardService
      .getSummary()
      .then((res) => mounted && setData(res.data))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Spinner label="Loading dashboard..." />;

  const cards = data?.cards || {};

  return (
    <div>
      <span className="eyebrow">◧ Live Overview</span>
      <h1 className="page-title" style={{ fontSize: 34 }}>Welcome back, Admin</h1>
      <p className="page-subtitle">Every booking, shoot, and delivery in Momento Frames at a glance.</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 18,
          margin: '28px 0 36px',
        }}
      >
        <StatCard icon="◧" label="Total Bookings" value={cards.totalBookings ?? 0} accent="navy" />
        <StatCard icon="◔" label="Upcoming Shoots" value={cards.upcomingShoots ?? 0} accent="gold" />
        <StatCard icon="✓" label="Completed Projects" value={cards.completedProjects ?? 0} accent="success" />
        <StatCard icon="▤" label="Pending Deliveries" value={cards.pendingDeliveries ?? 0} accent="info" />
        <StatCard icon="₹" label="Total Revenue" value={currency(cards.totalRevenue)} accent="navy" />
        <StatCard icon="!" label="Pending Balance" value={currency(cards.pendingBalancePayments)} accent="gold" />
      </div>

      <div className="card" style={{ padding: 26 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: 0, color: 'var(--navy-900)' }}>
            Recent Bookings
          </h2>
          <Link to="/bookings" className="btn btn-ghost btn-sm">
            View All →
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--ink-400)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                <th style={{ padding: '0 10px 12px' }}>Tracking No.</th>
                <th style={{ padding: '0 10px 12px' }}>Client</th>
                <th style={{ padding: '0 10px 12px' }}>Event Date</th>
                <th style={{ padding: '0 10px 12px' }}>Shoot Type</th>
                <th style={{ padding: '0 10px 12px' }}>Status</th>
                <th style={{ padding: '0 10px 12px' }}>Balance</th>
                <th style={{ padding: '0 10px 12px' }}></th>
              </tr>
            </thead>
            <tbody>
              {(data?.recentBookings || []).length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '30px 10px', textAlign: 'center', color: 'var(--ink-400)' }}>
                    No bookings yet. Create your first booking to see it here.
                  </td>
                </tr>
              )}
              {(data?.recentBookings || []).map((b) => (
                <tr key={b._id} style={{ borderTop: '1px solid var(--line)' }}>
                  <td style={{ padding: '12px 10px' }} className="tracking-no">{b.trackingNumber}</td>
                  <td style={{ padding: '12px 10px', fontWeight: 600 }}>{b.personalDetails?.fullName}</td>
                  <td style={{ padding: '12px 10px' }}>{new Date(b.eventDetails?.eventDate).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 10px' }}>{b.eventDetails?.shootType}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span className="badge badge-info">{b.currentStage}</span>
                  </td>
                  <td style={{ padding: '12px 10px' }}>{currency(b.payment?.balancePayment)}</td>
                  <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                    <Link to={`/bookings/${b._id}`} className="btn btn-ghost btn-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
