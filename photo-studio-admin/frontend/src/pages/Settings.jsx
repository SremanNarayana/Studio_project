import React, { useEffect, useMemo, useRef, useState } from 'react';
import settingsService from '../services/settingsService';
import Spinner from '../components/Spinner.jsx';
import { useToast } from '../hooks/useToast.jsx';

const SAMPLE = {
  clientName: 'Ananya', trackingId: 'MP-26-001', stageName: 'Editing',
  trackingUrl: 'https://your-site.com/track?id=MP-26-001',
};

export default function Settings() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authKeyConfigured, setAuthKeyConfigured] = useState(false);
  const [form, setForm] = useState({ enabled: false, templateId: '', bookingTemplateId: '', messageTemplate: '', bookingMessageTemplate: '', trackingBaseUrl: '' });
  const templateRef = useRef(null);
  const bookingTemplateRef = useRef(null);

  useEffect(() => {
    settingsService.getSms().then((res) => {
      const s = res.data;
      setForm({ enabled: s.enabled, templateId: s.templateId || '', bookingTemplateId: s.bookingTemplateId || '', messageTemplate: s.messageTemplate, bookingMessageTemplate: s.bookingMessageTemplate || 'Malayaan Photography: Your booking is confirmed. Booking ID: {{trackingId}}. Use this ID on our website to track your project.', trackingBaseUrl: s.trackingBaseUrl });
      setAuthKeyConfigured(s.authKeyConfigured);
    }).catch((err) => showToast(err.message, 'error')).finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const preview = useMemo(() => form.messageTemplate.replace(/{{\s*([a-zA-Z]+)\s*}}/g, (m, key) => SAMPLE[key] ?? m), [form.messageTemplate]);
  const bookingPreview = useMemo(() => form.bookingMessageTemplate.replace(/{{\s*([a-zA-Z]+)\s*}}/g, (m, key) => SAMPLE[key] ?? m), [form.bookingMessageTemplate]);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const insertVariable = (name, field = 'messageTemplate', ref = templateRef) => {
    const token = `{{${name}}}`;
    const el = ref.current;
    const value = form[field];
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? start;
    set(field, `${value.slice(0, start)}${token}${value.slice(end)}`);
    requestAnimationFrame(() => { el?.focus(); el?.setSelectionRange(start + token.length, start + token.length); });
  };
  const save = async (event) => {
    event.preventDefault(); setSaving(true);
    try { await settingsService.updateSms(form); showToast('SMS settings saved', 'success'); }
    catch (err) { showToast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  if (loading) return <Spinner label="Loading SMS settings..." />;
  return (
    <div>
      <span className="eyebrow">⚙ Settings</span>
      <h1 className="page-title" style={{ fontSize: 30 }}>SMS Notifications</h1>
      <p className="page-subtitle">Automatic MSG91 messages when a project stage is updated</p>

      <form onSubmit={save} className="card" style={{ padding: 24, marginTop: 26, maxWidth: 820 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <input type="checkbox" checked={form.enabled} onChange={(e) => set('enabled', e.target.checked)} />
          <strong>Enable automatic SMS</strong>
          <span className={`badge ${authKeyConfigured ? 'badge-success' : 'badge-warning'}`}>
            {authKeyConfigured ? 'Auth key configured' : 'MSG91_AUTH_KEY missing'}
          </span>
        </label>

        <Field label="MSG91 Stage-update Template ID">
          <input className="input" value={form.templateId} onChange={(e) => set('templateId', e.target.value)} placeholder="Your approved MSG91 flow/template ID" />
        </Field>
        <Field label="MSG91 Booking-created Template ID">
          <input className="input" value={form.bookingTemplateId} onChange={(e) => set('bookingTemplateId', e.target.value)} placeholder="Approved MSG91 template that sends the booking ID" />
        </Field>
        <Field label="Public tracking page URL">
          <input className="input" value={form.trackingBaseUrl} onChange={(e) => set('trackingBaseUrl', e.target.value)} placeholder="https://your-site.com/track" />
        </Field>
        <Field label="SMS message template">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 9 }}>
            {Object.keys(SAMPLE).map((name) => <button key={name} type="button" className="btn btn-ghost btn-sm" onClick={() => insertVariable(name)}>{`{{${name}}}`}</button>)}
          </div>
          <textarea ref={templateRef} className="input" rows={5} maxLength={500} value={form.messageTemplate} onChange={(e) => set('messageTemplate', e.target.value)} />
          <div style={{ fontSize: 12, color: 'var(--ink-400)', marginTop: 6 }}>{form.messageTemplate.length}/500 characters</div>
        </Field>

        <div style={{ padding: 16, background: 'var(--gold-100)', borderRadius: 10, marginBottom: 20 }}>
          <strong style={{ fontSize: 12 }}>Preview</strong>
          <p style={{ margin: '7px 0 0', lineHeight: 1.6 }}>{preview}</p>
        </div>
        <Field label="New booking SMS template">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 9 }}>
            {['clientName', 'trackingId', 'trackingUrl'].map((name) => <button key={name} type="button" className="btn btn-ghost btn-sm" onClick={() => insertVariable(name, 'bookingMessageTemplate', bookingTemplateRef)}>{`{{${name}}}`}</button>)}
          </div>
          <textarea ref={bookingTemplateRef} className="input" rows={4} maxLength={500} value={form.bookingMessageTemplate} onChange={(e) => set('bookingMessageTemplate', e.target.value)} />
        </Field>
        <div style={{ padding: 16, background: 'var(--gold-100)', borderRadius: 10, marginBottom: 20 }}>
          <strong style={{ fontSize: 12 }}>New booking preview</strong>
          <p style={{ margin: '7px 0 0', lineHeight: 1.6 }}>{bookingPreview}</p>
        </div>
        <p style={{ fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.6 }}>
          India DLT rule: the production text and variables must match the approved MSG91/DLT template. Editing here changes the preview; update the approved template and Template ID when its structure changes. DLT commonly permits only 1–2 variables.
        </p>
        <button className="btn btn-gold" disabled={saving}>{saving ? 'Saving...' : 'Save SMS Settings'}</button>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return <label style={{ display: 'block', marginBottom: 20 }}><span style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 7 }}>{label}</span>{children}</label>;
}
