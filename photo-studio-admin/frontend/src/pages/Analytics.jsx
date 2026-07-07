import React, { useEffect, useState } from 'react';
import analyticsService from '../services/analyticsService';
import StatCard from '../components/StatCard.jsx';
import Spinner from '../components/Spinner.jsx';
import { useToast } from '../hooks/useToast.jsx';

const currency = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0,
}).format(value || 0);

const compactCurrency = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', notation: 'compact', maximumFractionDigits: 1,
}).format(value || 0);

export default function Analytics() {
  const [months, setMonths] = useState(12);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    analyticsService.get(months)
      .then((res) => mounted && setData(res.data))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [months]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading && !data) return <Spinner label="Preparing analytics..." />;
  const summary = data?.summary || {};

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <span className="eyebrow">↗ Studio Intelligence</span>
          <h1 className="page-title" style={{ fontSize: 34 }}>Data Analytics</h1>
          <p className="page-subtitle">Booking demand, revenue movement, and production workload in one view.</p>
        </div>
        <label>
          <span className="field-label">Trend period</span>
          <select className="field-select" value={months} onChange={(event) => setMonths(Number(event.target.value))}>
            <option value={6}>Last 6 months</option>
            <option value={12}>Last 12 months</option>
            <option value={24}>Last 24 months</option>
          </select>
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: 16, margin: '28px 0' }}>
        <StatCard icon="◧" label="Total Bookings" value={summary.totalBookings || 0} accent="navy" />
        <StatCard icon="₹" label="Contract Value" value={compactCurrency(summary.totalContractValue)} accent="gold" />
        <StatCard icon="✓" label="Collected" value={compactCurrency(summary.totalCollected)} accent="success" />
        <StatCard icon="!" label="Outstanding" value={compactCurrency(summary.outstandingBalance)} accent="gold" />
        <StatCard icon="∅" label="Average Booking" value={compactCurrency(summary.averageBookingValue)} accent="info" />
        <StatCard icon="↗" label="Completion Rate" value={`${summary.completionRate || 0}%`} accent="success" />
        <StatCard icon="◔" label="Shoots in 30 Days" value={summary.upcomingThirtyDays || 0} accent="navy" />
      </div>

      <div className="analytics-primary-grid">
        <Panel title="Booking trend" subtitle="Bookings created per month">
          <MonthlyChart rows={data?.monthly || []} />
        </Panel>
        <Panel title="Payment position" subtitle="Count and contract value by status">
          <PaymentList rows={data?.payments || []} />
        </Panel>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 20, marginTop: 20 }}>
        <Panel title="Demand by shoot type" subtitle="Which services clients book most">
          <HorizontalBars rows={data?.shootTypes || []} color="var(--gold-500)" />
        </Panel>
        <Panel title="Production workload" subtitle="Projects currently at each stage">
          <HorizontalBars rows={data?.stages || []} color="var(--navy-700)" />
        </Panel>
        <Panel title="Approval status" subtitle="Current booking decisions">
          <HorizontalBars rows={data?.approvals || []} color="var(--success)" />
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, children }) {
  return (
    <section className="card" style={{ padding: 24, minWidth: 0 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy-900)', fontSize: 20, margin: 0 }}>{title}</h2>
      <p style={{ color: 'var(--ink-400)', fontSize: 12.5, margin: '4px 0 22px' }}>{subtitle}</p>
      {children}
    </section>
  );
}

function MonthlyChart({ rows }) {
  const max = Math.max(...rows.map((row) => row.bookings), 1);
  if (!rows.length) return <Empty />;
  return (
    <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
      <div style={{ minWidth: Math.max(520, rows.length * 52), height: 240, display: 'flex', alignItems: 'flex-end', gap: 10, borderBottom: '1px solid var(--line)', padding: '10px 4px 0' }}>
        {rows.map((row) => (
          <div key={row.key} title={`${row.bookings} bookings · ${currency(row.value)}`} style={{ flex: 1, minWidth: 34, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, marginBottom: 5 }}>{row.bookings || ''}</span>
            <div style={{ width: '72%', maxWidth: 34, minHeight: row.bookings ? 7 : 2, height: `${Math.max((row.bookings / max) * 170, 2)}px`, borderRadius: '7px 7px 0 0', background: row.bookings ? 'linear-gradient(180deg, var(--gold-400), var(--gold-500))' : 'var(--paper-grid)', transition: 'height .25s ease' }} />
            <span style={{ fontSize: 10, color: 'var(--ink-400)', margin: '8px 0 7px', whiteSpace: 'nowrap' }}>{row.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HorizontalBars({ rows, color }) {
  const max = Math.max(...rows.map((row) => row.count), 1);
  if (!rows.length) return <Empty />;
  return <div style={{ display: 'grid', gap: 14 }}>{rows.map((row) => (
    <div key={row.label}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 12.5, marginBottom: 6 }}>
        <span style={{ fontWeight: 600 }}>{row.label}</span><span style={{ color: 'var(--ink-400)' }}>{row.count}</span>
      </div>
      <div style={{ height: 8, borderRadius: 99, background: 'var(--paper-grid)', overflow: 'hidden' }}>
        <div style={{ width: `${(row.count / max) * 100}%`, height: '100%', background: color, borderRadius: 99 }} />
      </div>
    </div>
  ))}</div>;
}

function PaymentList({ rows }) {
  if (!rows.length) return <Empty />;
  return <div style={{ display: 'grid', gap: 12 }}>{rows.map((row) => (
    <div key={row.label} style={{ padding: 14, borderRadius: 12, background: 'var(--paper)', border: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
      <div><div style={{ fontWeight: 700, fontSize: 13 }}>{row.label}</div><div style={{ color: 'var(--ink-400)', fontSize: 11.5, marginTop: 3 }}>{row.count} booking{row.count === 1 ? '' : 's'}</div></div>
      <strong style={{ color: 'var(--navy-900)', fontSize: 13 }}>{compactCurrency(row.value)}</strong>
    </div>
  ))}</div>;
}

function Empty() {
  return <div style={{ color: 'var(--ink-400)', fontSize: 13, padding: '28px 0', textAlign: 'center' }}>Analytics will appear after bookings are created.</div>;
}
