import React, { useEffect, useState } from 'react';
import referralService from '../services/referralService';
import Spinner from '../components/Spinner.jsx';
import { useToast } from '../hooks/useToast.jsx';

const currency = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);
const dateTime = (value) => value ? new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

export default function Referrals() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);
  const [usage, setUsage] = useState({});
  const { showToast } = useToast();

  useEffect(() => {
    referralService.list().then((res) => setAccounts(res.data?.accounts || res.data || []))
      .catch((err) => showToast(err.message, 'error')).finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Spinner label="Loading referral accounts..." />;
  const toggleUsage = async (account) => {
    const id = account._id || account.id;
    if (open === id) return setOpen(null);
    setOpen(id);
    if (usage[id]) return;
    try {
      const res = await referralService.getUsage(id);
      setUsage((prev) => ({ ...prev, [id]: res.data?.usage || [] }));
    } catch (err) { showToast(err.message, 'error'); }
  };
  return <div>
    <span className="eyebrow">🎁 Loyalty & Referrals</span>
    <h1 className="page-title" style={{ fontSize: 30 }}>Referral Rewards</h1>
    <p className="page-subtitle">Every successful use earns the owner 100 points (₹1,000). Codes can be used repeatedly.</p>
    <div className="card" style={{ padding: 0, overflow: 'hidden', marginTop: 24 }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead><tr style={{ textAlign: 'left', color: 'var(--ink-400)', fontSize: 11, textTransform: 'uppercase' }}>
            <th style={{ padding: '16px 18px' }}>Owner</th><th style={{ padding: '16px 18px' }}>Code</th><th style={{ padding: '16px 18px' }}>Points</th><th style={{ padding: '16px 18px' }}>Uses</th><th style={{ padding: '16px 18px' }} />
          </tr></thead>
          <tbody>{accounts.length === 0 && <tr><td colSpan="5" style={{ padding: 28, textAlign: 'center', color: 'var(--ink-400)' }}>No referral accounts yet.</td></tr>}
            {accounts.map((account) => {
              const history = usage[id] || account.usageHistory || account.rewards || account.uses || [];
              const id = account._id || account.id || account.referralCode;
              return <React.Fragment key={id}>
                <tr style={{ borderTop: '1px solid var(--line)' }}>
                  <td style={{ padding: '14px 18px' }}><strong>{account.customerName || account.ownerName || '—'}</strong><div style={{ color: 'var(--ink-400)', fontSize: 12 }}>{account.phoneNumber || account.ownerPhone || '—'}</div></td>
                  <td className="tracking-no" style={{ padding: '14px 18px' }}>{account.referralCode}</td>
                  <td style={{ padding: '14px 18px' }}><strong>{account.points || 0}</strong><div style={{ color: 'var(--ink-400)', fontSize: 12 }}>{currency(account.rupeeValue ?? Math.floor((account.points || 0) / 100) * 1000)}</div></td>
                  <td style={{ padding: '14px 18px' }}>{account.usageCount ?? history.length}</td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}><button className="btn btn-ghost btn-sm" onClick={() => toggleUsage(account)}>{open === id ? 'Hide uses' : 'View uses'}</button></td>
                </tr>
                {open === id && <tr><td colSpan="5" style={{ padding: '0 18px 18px', background: 'var(--paper)' }}>
                  <div style={{ padding: 16, border: '1px solid var(--line)', borderRadius: 10 }}><strong>People who used this code</strong>
                    {history.length === 0 ? <p style={{ color: 'var(--ink-400)', marginBottom: 0 }}>No usage history returned.</p> : <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>{history.map((use, index) => <div key={use._id || index} style={{ padding: 10, background: 'white', borderRadius: 8 }}><strong>{use.referredBooking?.personalDetails?.fullName || use.customerName || use.referredCustomerName || 'Customer'}</strong> · {use.referredBooking?.personalDetails?.phoneNumber || use.phoneNumber || use.referredPhone || '—'}<div style={{ color: 'var(--ink-400)', fontSize: 12 }}>{use.referredBooking?.trackingNumber || use.trackingNumber || ''} · {dateTime(use.createdAt || use.usedAt)}</div></div>)}</div>}
                  </div>
                </td></tr>}
              </React.Fragment>;
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>;
}
