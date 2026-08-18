import React, { useEffect, useMemo, useRef, useState } from 'react';
import settingsService from '../services/settingsService';
import Spinner from '../components/Spinner.jsx';
import { useToast } from '../hooks/useToast.jsx';

const SAMPLE = {
  clientName: 'Ananya', trackingId: 'MP-26-001', stageName: 'Editing',
  paymentAmount: '₹5,000',
  paymentDescription: 'Advance payment',
  paymentLine: 'Payment received: ₹5,000 (Advance payment)',
  totalPaid: '₹10,000',
  balanceAmount: '₹15,000',
  paymentStatus: 'Partial',
};

export default function Settings() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [credentials, setCredentials] = useState({ authKey: false, integratedNumber: false });
  const [form, setForm] = useState({
    enabled: false, stageTemplateName: '', bookingTemplateName: '', templateLanguage: 'en_US',
    messageTemplate: '', bookingMessageTemplate: '', trackingBaseUrl: '',
  });
  const templateRef = useRef(null);
  const bookingTemplateRef = useRef(null);

  useEffect(() => {
    settingsService.getWhatsApp().then((res) => {
      const s = res.data;
      setForm({
        enabled: s.enabled,
        stageTemplateName: s.stageTemplateName || '',
        bookingTemplateName: s.bookingTemplateName || '',
        templateLanguage: s.templateLanguage || 'en_US',
        messageTemplate: s.messageTemplate || '',
        bookingMessageTemplate: s.bookingMessageTemplate || '',
        trackingBaseUrl: '',
      });
      setCredentials({
        // The fallbacks keep the UI usable while an older backend is being upgraded.
        authKey: Boolean(s.authKeyConfigured ?? s.msg91AuthKeyConfigured ?? s.accessTokenConfigured),
        integratedNumber: Boolean(s.integratedNumberConfigured ?? s.msg91IntegratedNumberConfigured ?? s.phoneNumberIdConfigured),
      });
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
    try { await settingsService.updateWhatsApp(form); showToast('WhatsApp settings saved', 'success'); }
    catch (err) { showToast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  if (loading) return <Spinner label="Loading WhatsApp settings..." />;
  const ready = credentials.authKey && credentials.integratedNumber;
  return (
    <div>
      <span className="eyebrow">⚙ Settings</span>
      <h1 className="page-title" style={{ fontSize: 30 }}>WhatsApp Notifications</h1>
      <p className="page-subtitle">Automatic booking and project updates using MSG91 WhatsApp</p>

      <form onSubmit={save} className="card" style={{ padding: 24, marginTop: 26, maxWidth: 820 }}>
        <div style={{ padding: 18, background: 'var(--gold-100)', borderRadius: 10, marginBottom: 22, lineHeight: 1.65 }}>
          <strong>MSG91 setup</strong>
          <ol style={{ margin: '8px 0 0', paddingLeft: 20, fontSize: 13 }}>
            <li>Keep the WhatsApp number Active in MSG91 and maintain enough WhatsApp prepaid balance.</li>
            <li>Create and approve the two Utility templates in MSG91 with variables in the same order shown below.</li>
            <li>Add the MSG91 authentication key and integrated WhatsApp number to the backend environment.</li>
            <li>Enter the exact approved template names and language here, save, then enable automatic messages.</li>
          </ol>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <input type="checkbox" checked={form.enabled} onChange={(e) => set('enabled', e.target.checked)} />
          <strong>Enable automatic WhatsApp messages</strong>
          <span className={`badge ${ready ? 'badge-success' : 'badge-warning'}`}>
            {ready ? 'MSG91 credentials configured' : 'MSG91 credentials missing'}
          </span>
        </label>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          <StatusBadge ok={credentials.authKey} label="MSG91 authentication key" />
          <StatusBadge ok={credentials.integratedNumber} label="Integrated WhatsApp number" />
        </div>

        <Field label="Approved stage-update template name">
          <input className="input" value={form.stageTemplateName} onChange={(e) => set('stageTemplateName', e.target.value)} placeholder="booking_stage_update" />
        </Field>
        <Field label="Approved booking-created template name">
          <input className="input" value={form.bookingTemplateName} onChange={(e) => set('bookingTemplateName', e.target.value)} placeholder="booking_confirmation" />
        </Field>
        <Field label="Template language code">
          <input className="input" value={form.templateLanguage} onChange={(e) => set('templateLanguage', e.target.value)} placeholder="en_US" />
        </Field>
        <Field label="Stage-update template body">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 9 }}>
            {Object.keys(SAMPLE).map((name) => <button key={name} type="button" className="btn btn-ghost btn-sm" onClick={() => insertVariable(name)}>{`{{${name}}}`}</button>)}
          </div>
          <textarea ref={templateRef} className="input" rows={5} maxLength={1024} value={form.messageTemplate} onChange={(e) => set('messageTemplate', e.target.value)} />
          <div style={{ fontSize: 12, color: 'var(--ink-400)', marginTop: 6 }}>{form.messageTemplate.length}/1024 characters</div>
        </Field>

        <div style={{ padding: 16, background: 'var(--gold-100)', borderRadius: 10, marginBottom: 20 }}>
          <strong style={{ fontSize: 12 }}>Preview</strong>
          <p style={{ margin: '7px 0 0', lineHeight: 1.6 }}>{preview}</p>
        </div>
        <Field label="Booking-created template body">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 9 }}>
            {['clientName', 'trackingId'].map((name) => <button key={name} type="button" className="btn btn-ghost btn-sm" onClick={() => insertVariable(name, 'bookingMessageTemplate', bookingTemplateRef)}>{`{{${name}}}`}</button>)}
          </div>
          <textarea ref={bookingTemplateRef} className="input" rows={4} maxLength={1024} value={form.bookingMessageTemplate} onChange={(e) => set('bookingMessageTemplate', e.target.value)} />
        </Field>
        <div style={{ padding: 16, background: 'var(--gold-100)', borderRadius: 10, marginBottom: 20 }}>
          <strong style={{ fontSize: 12 }}>New booking preview</strong>
          <p style={{ margin: '7px 0 0', lineHeight: 1.6 }}>{bookingPreview}</p>
        </div>
        <p style={{ fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.6 }}>
          These bodies define the variable order sent through MSG91. In the MSG91 template, replace the first preview variable with {'{{1}}'}, the second with {'{{2}}'}, and so on. The wording and variable order must exactly match the approved Utility template. Editing here does not update the template in MSG91. A website or tracking URL is not required for these notifications.
        </p>
        <button className="btn btn-gold" disabled={saving}>{saving ? 'Saving...' : 'Save WhatsApp Settings'}</button>
      </form>
    </div>
  );
}

function StatusBadge({ ok, label }) {
  return <span className={`badge ${ok ? 'badge-success' : 'badge-warning'}`}>{ok ? '✓' : '×'} {label}</span>;
}

function Field({ label, children }) {
  return <label style={{ display: 'block', marginBottom: 20 }}><span style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 7 }}>{label}</span>{children}</label>;
}
