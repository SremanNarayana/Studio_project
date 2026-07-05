import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import { SHOOT_TYPES, PAYMENT_STATUS, PROJECT_STAGES } from '../constants';
import Spinner from '../components/Spinner.jsx';
import Modal from '../components/Modal.jsx';
import Pagination from '../components/Pagination.jsx';
import { useToast } from '../hooks/useToast.jsx';
import useDebounce from '../hooks/useDebounce';
import StatusBadge from '../components/StatusBadge.jsx';

const currency = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ shootType: '', paymentStatus: '', currentStage: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [approvingId, setApprovingId] = useState(null);

  const debouncedSearch = useDebounce(search, 400);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const load = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        if (debouncedSearch.trim()) {
          const res = await bookingService.search(debouncedSearch.trim());
          setBookings(res.data);
          setMeta({ page: 1, totalPages: 1 });
        } else {
          const params = { page, limit: 10, ...filters };
          Object.keys(params).forEach((k) => !params[k] && delete params[k]);
          const res = await bookingService.list(params);
          setBookings(res.data);
          setMeta(res.meta);
        }
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedSearch, filters]
  );

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await bookingService.remove(deleteTarget._id);
      showToast(`Booking ${deleteTarget.trackingNumber} deleted`, 'success');
      setDeleteTarget(null);
      load(meta.page);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const approveBooking = async (booking) => {
    setApprovingId(booking._id);
    try {
      await bookingService.updateApproval(booking._id, 'Approved');
      showToast(`Booking ${booking.trackingNumber} approved`, 'success');
      load(meta.page);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <span className="eyebrow">◨ Bookings</span>
          <h1 className="page-title" style={{ fontSize: 30 }}>All Bookings</h1>
          <p className="page-subtitle">
            {meta.totalPages > 1 || bookings.length ? `${bookings.length} shown` : 'No bookings'} ·{' '}
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="card" style={{ padding: 18, margin: '24px 0 20px', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <input
          className="field-input"
          style={{ flex: '2 1 240px' }}
          placeholder="Search tracking no., client, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="field-select"
          style={{ flex: '1 1 150px' }}
          value={filters.shootType}
          onChange={(e) => setFilters((f) => ({ ...f, shootType: e.target.value }))}
        >
          <option value="">All Shoot Types</option>
          {SHOOT_TYPES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          className="field-select"
          style={{ flex: '1 1 150px' }}
          value={filters.currentStage}
          onChange={(e) => setFilters((f) => ({ ...f, currentStage: e.target.value }))}
        >
          <option value="">All Stages</option>
          {PROJECT_STAGES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          className="field-select"
          style={{ flex: '1 1 150px' }}
          value={filters.paymentStatus}
          onChange={(e) => setFilters((f) => ({ ...f, paymentStatus: e.target.value }))}
        >
          <option value="">All Payment Status</option>
          {PAYMENT_STATUS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Spinner label="Loading bookings..." />
      ) : (
        <div className="card" style={{ padding: 26 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--ink-400)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0 10px 12px' }}>Tracking No.</th>
                  <th style={{ padding: '0 10px 12px' }}>Client Name</th>
                  <th style={{ padding: '0 10px 12px' }}>Event Date</th>
                  <th style={{ padding: '0 10px 12px' }}>Shoot Type</th>
                  <th style={{ padding: '0 10px 12px' }}>Current Status</th>
                  <th style={{ padding: '0 10px 12px' }}>Approval</th>
                  <th style={{ padding: '0 10px 12px' }}>Balance</th>
                  <th style={{ padding: '0 10px 12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: '40px 10px', textAlign: 'center', color: 'var(--ink-400)' }}>
                      No bookings match your search/filters.
                    </td>
                  </tr>
                )}
                {bookings.map((b) => (
                  <tr key={b._id} style={{ borderTop: '1px solid var(--line)' }}>
                    <td style={{ padding: '12px 10px' }} className="tracking-no">{b.trackingNumber}</td>
                    <td style={{ padding: '12px 10px', fontWeight: 600 }}>
                      {b.personalDetails?.fullName}
                      <div style={{ fontWeight: 400, fontSize: 12, color: 'var(--ink-400)' }}>{b.personalDetails?.phoneNumber}</div>
                    </td>
                    <td style={{ padding: '12px 10px' }}>{new Date(b.eventDetails?.eventDate).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 10px' }}>{b.eventDetails?.shootType}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className="badge badge-info">{b.currentStage}</span>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <StatusBadge status={b.approvalStatus === 'Approved' ? 'Approved' : 'Pending Approval'} />
                    </td>
                    <td style={{ padding: '12px 10px' }}>{currency(b.payment?.balancePayment)}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {b.approvalStatus !== 'Approved' && (
                          <button
                            className="btn btn-gold btn-sm"
                            disabled={approvingId === b._id}
                            onClick={() => approveBooking(b)}
                          >
                            {approvingId === b._id ? 'Approving...' : 'Approve'}
                          </button>
                        )}
                        <Link to={`/bookings/${b._id}`} className="btn btn-ghost btn-sm">View</Link>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/bookings/${b._id}/edit`)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(b)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!debouncedSearch && <Pagination page={meta.page} totalPages={meta.totalPages} onChange={load} />}
        </div>
      )}

      <Modal
        open={!!deleteTarget}
        title="Delete booking?"
        onClose={() => setDeleteTarget(null)}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
            <button className="btn btn-danger" disabled={deleting} onClick={confirmDelete}>
              {deleting ? 'Deleting...' : 'Delete Permanently'}
            </button>
          </>
        }
      >
        This will permanently delete booking <strong className="tracking-no">{deleteTarget?.trackingNumber}</strong> for{' '}
        <strong>{deleteTarget?.personalDetails?.fullName}</strong>. This cannot be undone.
      </Modal>
    </div>
  );
}
