import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import bookingService from '../services/bookingService';
import Spinner from '../components/Spinner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import ProjectTimeline from '../components/ProjectTimeline.jsx';
import Modal from '../components/Modal.jsx';
import { useToast } from '../hooks/useToast.jsx';

const currency = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stageSaving, setStageSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [approvalSaving, setApprovalSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    bookingService
      .getById(id)
      .then((res) => setBooking(res.data))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpdateStage = async (stageName, draft) => {
    setStageSaving(true);
    try {
      const res = await bookingService.updateStage(id, {
        stageName,
        status: draft.status,
        completedDate: draft.completedDate || null,
        remarks: draft.remarks,
      });
      setBooking(res.data);
      if (res.meta?.sms?.sent) showToast(`"${stageName}" updated · SMS sent`, 'success');
      else if (res.meta?.sms?.mode === 'log-only') showToast(`"${stageName}" updated · SMS preview logged`, 'success');
      else showToast(`"${stageName}" updated · SMS could not be sent`, 'error');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setStageSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await bookingService.remove(id);
      showToast('Booking deleted', 'success');
      navigate('/bookings');
    } catch (err) {
      showToast(err.message, 'error');
      setDeleting(false);
    }
  };

  const approveBooking = async () => {
    setApprovalSaving(true);
    try {
      const res = await bookingService.updateApproval(id, 'Approved');
      setBooking(res.data);
      showToast('Booking approved', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setApprovalSaving(false);
    }
  };

  if (loading) return <Spinner label="Loading booking details..." />;
  if (!booking) return <p>Booking not found.</p>;

  const { personalDetails, eventDetails, package: pkg, payment, requirements, projectTimeline, currentStage } = booking;

  return (
    <div>
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 10 }} onClick={() => navigate('/bookings')}>
        ← Back to Bookings
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <span className="eyebrow">📁 Booking Details</span>
          <h1 className="page-title tracking-no" style={{ fontSize: 30 }}>{booking.trackingNumber}</h1>
          <p className="page-subtitle">{personalDetails.fullName} · {eventDetails.shootType}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {booking.approvalStatus !== 'Approved' && (
            <button className="btn btn-gold" disabled={approvalSaving} onClick={approveBooking}>
              {approvalSaving ? 'Approving...' : 'Approve Booking'}
            </button>
          )}
          <button className="btn btn-ghost" onClick={() => navigate(`/bookings/${id}/edit`)}>Edit Booking</button>
          <button className="btn btn-danger" onClick={() => setDeleteOpen(true)}>Delete</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20, marginTop: 26, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Personal + Event details */}
          <div className="card" style={{ padding: 24 }}>
            <SectionTitle icon="👤" title="Personal Details" />
            <InfoGrid
              items={[
                ['Full Name', personalDetails.fullName],
                ['Phone Number', personalDetails.phoneNumber],
                ['Email', personalDetails.emailAddress || '—'],
                ['Instagram', personalDetails.instagram || '—'],
              ]}
            />
          </div>

          <div className="card" style={{ padding: 24 }}>
            <SectionTitle icon="📅" title="Event Details" />
            <InfoGrid
              items={[
                ['Shoot Type', eventDetails.shootType],
                ['Event Date', new Date(eventDetails.eventDate).toLocaleDateString()],
                ['Event Time', eventDetails.eventTime || '—'],
                ['Venue', eventDetails.venueName || '—'],
                ['Venue Address', eventDetails.venueAddress || '—'],
              ]}
            />
          </div>

          <div className="card" style={{ padding: 24 }}>
            <SectionTitle icon="📷" title="Selected Services & Package" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {(requirements || []).length === 0 && <span style={{ color: 'var(--ink-400)', fontSize: 13 }}>No services selected</span>}
              {(requirements || []).map((r) => (
                <span key={r} className="badge badge-info">{r}</span>
              ))}
            </div>
            <InfoGrid
              items={[
                ['Package', pkg.type],
                ['Album Required', booking.albumRequired ? 'Yes' : 'No'],
                ...(pkg.type === 'Custom' ? [['Custom Description', pkg.customDescription || '—']] : []),
              ]}
            />
          </div>

          {/* Project Timeline */}
          <div className="card" style={{ padding: 24 }}>
            <SectionTitle icon="🗂" title="Project Timeline" />
            <ProjectTimeline stages={projectTimeline} onUpdateStage={handleUpdateStage} saving={stageSaving} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ padding: 24 }}>
            <SectionTitle icon="₹" title="Payment Details" />
            <InfoGrid
              items={[
                ['Total Amount', currency(payment.totalAmount)],
                ['Advance Payment', currency(payment.advancePayment)],
                ['Balance Payment', currency(payment.balancePayment)],
              ]}
            />
            <div style={{ marginTop: 14 }}>
              <StatusBadge status={payment.paymentStatus} />
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <SectionTitle icon="◧" title="Status" />
            <InfoGrid
              items={[
                ['Approval', <StatusBadge status={booking.approvalStatus === 'Approved' ? 'Approved' : 'Pending Approval'} />],
                ['Current Stage', currentStage],
                ['Estimated Delivery', booking.estimatedDeliveryDate ? new Date(booking.estimatedDeliveryDate).toLocaleDateString() : '—'],
              ]}
            />
          </div>

          {booking.adminNotes && (
            <div className="card" style={{ padding: 24 }}>
              <SectionTitle icon="🗒" title="Admin Notes" />
              <p style={{ fontSize: 13.5, color: 'var(--ink-600)', margin: 0, lineHeight: 1.6 }}>{booking.adminNotes}</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={deleteOpen}
        title="Delete this booking?"
        onClose={() => setDeleteOpen(false)}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setDeleteOpen(false)}>Cancel</button>
            <button className="btn btn-danger" disabled={deleting} onClick={confirmDelete}>
              {deleting ? 'Deleting...' : 'Delete Permanently'}
            </button>
          </>
        }
      >
        This will permanently delete <strong className="tracking-no">{booking.trackingNumber}</strong>. This cannot be undone.
      </Modal>
    </div>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--navy-900)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span>{icon}</span> {title}
    </h3>
  );
}

function InfoGrid({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      {items.map(([label, value]) => (
        <div key={label}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>
            {label}
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--ink-900)', marginTop: 3, fontWeight: 500 }}>{value}</div>
        </div>
      ))}
    </div>
  );
}
