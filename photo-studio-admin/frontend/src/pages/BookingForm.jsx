import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import bookingService from '../services/bookingService';
import { SHOOT_TYPES, PACKAGES, REQUIREMENTS, EMPTY_BOOKING } from '../constants';
import Spinner from '../components/Spinner.jsx';
import { useToast } from '../hooks/useToast.jsx';

const currency = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

function normalizePaymentEntries(payment = {}) {
  if (Array.isArray(payment.paymentEntries) && payment.paymentEntries.length > 0) {
    return payment.paymentEntries.map((entry) => ({
      amount: entry.amount || 0,
      description: entry.description || '',
      receivedOn: entry.receivedOn?.slice?.(0, 10) || '',
    }));
  }
  if ((payment.advancePayment || 0) > 0) {
    return [{
      amount: payment.advancePayment,
      description: 'Previous payment',
      receivedOn: '',
    }];
  }
  return [];
}

export default function BookingForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState(EMPTY_BOOKING);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (!isEdit) return;
    bookingService
      .getById(id)
      .then((res) => {
        const b = res.data;
        setForm({
          personalDetails: b.personalDetails,
          eventDetails: {
            ...b.eventDetails,
            eventDate: b.eventDetails.eventDate?.slice(0, 10) || '',
          },
          requirements: b.requirements || [],
          albumRequired: b.albumRequired,
          package: b.package,
          payment: { totalAmount: b.payment.totalAmount, paymentEntries: normalizePaymentEntries(b.payment) },
          estimatedDeliveryDate: b.estimatedDeliveryDate?.slice(0, 10) || '',
          adminNotes: b.adminNotes || '',
        });
      })
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const setPath = (path, value) => {
    setForm((prev) => {
      const next = structuredClone(prev);
      const keys = path.split('.');
      let cursor = next;
      for (let i = 0; i < keys.length - 1; i++) cursor = cursor[keys[i]];
      cursor[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const toggleRequirement = (req) => {
    setForm((prev) => {
      const has = prev.requirements.includes(req);
      return {
        ...prev,
        requirements: has ? prev.requirements.filter((r) => r !== req) : [...prev.requirements, req],
      };
    });
  };

  const updatePaymentEntry = (index, key, value) => {
    setForm((prev) => {
      const next = structuredClone(prev);
      next.payment.paymentEntries[index][key] = value;
      return next;
    });
  };

  const addPaymentEntry = () => {
    setForm((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        paymentEntries: [...prev.payment.paymentEntries, { amount: 0, description: '', receivedOn: '' }],
      },
    }));
  };

  const removePaymentEntry = (index) => {
    setForm((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        paymentEntries: prev.payment.paymentEntries.filter((_, i) => i !== index),
      },
    }));
  };

  const paidAmount = (form.payment.paymentEntries || []).reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);
  const balanceAmount = Math.max((Number(form.payment.totalAmount) || 0) - paidAmount, 0);
  const paymentStatus = balanceAmount === 0 && (Number(form.payment.totalAmount) || 0) > 0 ? 'Completed' : paidAmount > 0 ? 'Partial' : 'Pending';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSaving(true);
    try {
      if (isEdit) {
        await bookingService.update(id, form);
        showToast('Booking updated successfully', 'success');
      } else {
        const res = await bookingService.create(form);
        const smsText = res.meta?.sms?.sent ? ' · Booking ID sent by SMS' : ' · SMS not sent';
        showToast(`Booking ${res.data.trackingNumber} created successfully${smsText}`, res.meta?.sms?.sent ? 'success' : 'error');
      }
      navigate('/bookings');
    } catch (err) {
      setErrors(err.errors || [err.message]);
      showToast('Please fix the errors below', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner label="Loading booking..." />;

  return (
    <div>
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 10 }} onClick={() => navigate(-1)}>
        ← Back
      </button>
      <span className="eyebrow">📋 Booking Form</span>
      <h1 className="page-title" style={{ fontSize: 30 }}>{isEdit ? 'Edit Booking' : 'New Booking'}</h1>
      <p className="page-subtitle">
        {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      {errors.length > 0 && (
        <div className="card" style={{ padding: 16, margin: '18px 0', borderLeft: '4px solid var(--danger)', background: 'var(--danger-bg)' }}>
          {errors.map((e, i) => (
            <div key={i} className="field-error" style={{ margin: '2px 0' }}>{e}</div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 22 }}>
        {/* Personal Details */}
        <section className="card" style={{ padding: 24 }}>
          <span className="eyebrow" style={{ marginBottom: 16, display: 'inline-flex' }}>👤 Personal Details</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Full Name *">
              <input className="field-input" required value={form.personalDetails.fullName}
                onChange={(e) => setPath('personalDetails.fullName', e.target.value)} placeholder="e.g., Priya & Arjun" />
            </Field>
            <Field label="Phone Number *">
              <input className="field-input" required value={form.personalDetails.phoneNumber}
                onChange={(e) => setPath('personalDetails.phoneNumber', e.target.value)} placeholder="e.g., 9876543210" />
            </Field>
            <Field label="Email Address">
              <input type="email" className="field-input" value={form.personalDetails.emailAddress}
                onChange={(e) => setPath('personalDetails.emailAddress', e.target.value)} placeholder="e.g., priya@email.com" />
            </Field>
            <Field label="Instagram (Optional)">
              <input className="field-input" value={form.personalDetails.instagram}
                onChange={(e) => setPath('personalDetails.instagram', e.target.value)} placeholder="@handle" />
            </Field>
          </div>
        </section>

        {/* Event Details */}
        <section className="card" style={{ padding: 24 }}>
          <span className="eyebrow" style={{ marginBottom: 16, display: 'inline-flex' }}>📅 Event Details</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Type of Shoot *">
              <select className="field-select" required value={form.eventDetails.shootType}
                onChange={(e) => setPath('eventDetails.shootType', e.target.value)}>
                <option value="">Select shoot type</option>
                {SHOOT_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Event Date *">
              <input type="date" className="field-input" required value={form.eventDetails.eventDate}
                onChange={(e) => setPath('eventDetails.eventDate', e.target.value)} />
            </Field>
            <Field label="Event Time">
              <input type="time" className="field-input" value={form.eventDetails.eventTime}
                onChange={(e) => setPath('eventDetails.eventTime', e.target.value)} />
            </Field>
            <Field label="Venue Name">
              <input className="field-input" value={form.eventDetails.venueName}
                onChange={(e) => setPath('eventDetails.venueName', e.target.value)} placeholder="e.g., Taj Fisherman's Cove" />
            </Field>
            <Field label="Venue Address" full>
              <textarea className="field-textarea" rows={2} value={form.eventDetails.venueAddress}
                onChange={(e) => setPath('eventDetails.venueAddress', e.target.value)} placeholder="Full venue address" />
            </Field>
          </div>
        </section>

        {/* Photography Requirements */}
        <section className="card" style={{ padding: 24 }}>
          <span className="eyebrow" style={{ marginBottom: 16, display: 'inline-flex' }}>📷 Photography Requirements</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
            {REQUIREMENTS.map((req) => (
              <label key={req} className="checkbox-row">
                <input type="checkbox" checked={form.requirements.includes(req)} onChange={() => toggleRequirement(req)} />
                {req}
              </label>
            ))}
          </div>

          <div style={{ marginTop: 18 }}>
            <label className="field-label">Album Required</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['Yes', 'No'].map((opt) => (
                <label key={opt} className="radio-row" style={{ minWidth: 90, justifyContent: 'center' }}>
                  <input type="radio" name="albumRequired" checked={form.albumRequired === (opt === 'Yes')}
                    onChange={() => setPath('albumRequired', opt === 'Yes')} />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Package Selection */}
        <section className="card" style={{ padding: 24 }}>
          <span className="eyebrow" style={{ marginBottom: 16, display: 'inline-flex' }}>📦 Package Selection</span>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {PACKAGES.map((p) => (
              <label key={p} className="radio-row" style={{ minWidth: 120, justifyContent: 'center' }}>
                <input type="radio" name="package" checked={form.package.type === p}
                  onChange={() => setPath('package.type', p)} />
                {p}
              </label>
            ))}
          </div>
          {form.package.type === 'Custom' && (
            <div style={{ marginTop: 14 }}>
              <Field label="Custom Package Description">
                <textarea className="field-textarea" rows={2} value={form.package.customDescription}
                  onChange={(e) => setPath('package.customDescription', e.target.value)} placeholder="Describe the custom package" />
              </Field>
            </div>
          )}
        </section>

        {/* Payment Details */}
        <section className="card" style={{ padding: 24 }}>
          <span className="eyebrow" style={{ marginBottom: 16, display: 'inline-flex' }}>₹ Payment Details</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
            <Field label="Total Amount (₹)">
              <input type="number" min="0" className="field-input" value={form.payment.totalAmount}
                onChange={(e) => setPath('payment.totalAmount', Number(e.target.value))} />
            </Field>
          </div>
          <div style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <label className="field-label" style={{ margin: 0 }}>Payment Entries</label>
              <button type="button" className="btn btn-ghost btn-sm" onClick={addPaymentEntry}>+ Add Payment</button>
            </div>
            {(form.payment.paymentEntries || []).length === 0 && (
              <p style={{ fontSize: 12.5, color: 'var(--ink-400)', margin: 0 }}>
                No payments recorded yet. Add each payment part with an amount and description like advance or part payment.
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
              {(form.payment.paymentEntries || []).map((entry, index) => (
                <div key={index} className="card" style={{ padding: 14, background: 'var(--paper)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1fr auto', gap: 12, alignItems: 'end' }}>
                    <Field label="Amount (₹)">
                      <input type="number" min="0" className="field-input" value={entry.amount}
                        onChange={(e) => updatePaymentEntry(index, 'amount', Number(e.target.value))} />
                    </Field>
                    <Field label="Description">
                      <input className="field-input" value={entry.description}
                        onChange={(e) => updatePaymentEntry(index, 'description', e.target.value)} placeholder="Advance, 2nd payment, final payment..." />
                    </Field>
                    <Field label="Received On">
                      <input type="date" className="field-input" value={entry.receivedOn}
                        onChange={(e) => updatePaymentEntry(index, 'receivedOn', e.target.value)} />
                    </Field>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => removePaymentEntry(index)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, marginTop: 16 }}>
            <Summary label="Paid So Far" value={currency(paidAmount)} />
            <Summary label="Balance" value={currency(balanceAmount)} />
            <Summary label="Status" value={paymentStatus} />
          </div>
        </section>

        {/* Delivery & Notes */}
        <section className="card" style={{ padding: 24 }}>
          <span className="eyebrow" style={{ marginBottom: 16, display: 'inline-flex' }}>🗒 Delivery & Notes</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Estimated Delivery Date">
              <input type="date" className="field-input" value={form.estimatedDeliveryDate}
                onChange={(e) => setPath('estimatedDeliveryDate', e.target.value)} />
            </Field>
            <Field label="Admin Notes" full>
              <textarea className="field-textarea" rows={2} value={form.adminNotes}
                onChange={(e) => setPath('adminNotes', e.target.value)} placeholder="Internal notes (not visible to client)" />
            </Field>
          </div>
        </section>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-gold" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Booking'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Summary({ label, value }) {
  return (
    <div style={{ padding: 14, borderRadius: 12, background: 'var(--paper)', border: '1px solid var(--line)' }}>
      <div style={{ fontSize: 11, color: 'var(--ink-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 16, fontWeight: 700, color: 'var(--navy-900)' }}>{value}</div>
    </div>
  );
}

function Field({ label, children, full }) {
  return (
    <div style={full ? { gridColumn: '1 / -1' } : undefined}>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}
