import React, { useState } from 'react';
import { STAGE_STATUS } from '../constants';

const DOT_COLOR = {
  Completed: 'var(--success)',
  'In Progress': 'var(--gold-500)',
  Pending: 'var(--paper-grid)',
};

export default function ProjectTimeline({ stages, onUpdateStage, saving }) {
  const [editingStage, setEditingStage] = useState(null);
  const [draft, setDraft] = useState({ status: '', remarks: '', completedDate: '' });

  const startEdit = (stage) => {
    setEditingStage(stage.stageName);
    setDraft({
      status: stage.status,
      remarks: stage.remarks || '',
      completedDate: stage.completedDate ? stage.completedDate.slice(0, 10) : '',
    });
  };

  const save = async (stageName) => {
    await onUpdateStage(stageName, draft);
    setEditingStage(null);
  };

  return (
    <div style={{ position: 'relative', paddingLeft: 6 }}>
      {stages.map((stage, idx) => {
        const isLast = idx === stages.length - 1;
        const isEditing = editingStage === stage.stageName;

        return (
          <div key={stage.stageName} style={{ display: 'flex', gap: 18, position: 'relative' }}>
            {/* Rail + dot */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: DOT_COLOR[stage.status],
                  border: stage.status === 'Pending' ? '2px solid var(--line)' : 'none',
                  marginTop: 4,
                  flexShrink: 0,
                }}
              />
              {!isLast && <div style={{ width: 2, flex: 1, background: 'var(--line)', minHeight: 30 }} />}
            </div>

            {/* Content */}
            <div style={{ paddingBottom: 26, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--navy-900)' }}>{stage.stageName}</span>
                <span
                  className={`badge ${
                    stage.status === 'Completed' ? 'badge-success' : stage.status === 'In Progress' ? 'badge-info' : 'badge-neutral'
                  }`}
                >
                  {stage.status}
                </span>
                {stage.completedDate && (
                  <span style={{ fontSize: 12, color: 'var(--ink-400)' }}>
                    · {new Date(stage.completedDate).toLocaleDateString()}
                  </span>
                )}
                {!isEditing && (
                  <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => startEdit(stage)}>
                    Update
                  </button>
                )}
              </div>

              {stage.remarks && !isEditing && (
                <p style={{ fontSize: 13, color: 'var(--ink-600)', margin: '6px 0 0' }}>{stage.remarks}</p>
              )}

              {isEditing && (
                <div className="card" style={{ padding: 16, marginTop: 12, background: 'var(--paper)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label className="field-label">Status</label>
                      <select
                        className="field-select"
                        value={draft.status}
                        onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
                      >
                        {STAGE_STATUS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="field-label">Completion Date</label>
                      <input
                        type="date"
                        className="field-input"
                        value={draft.completedDate}
                        onChange={(e) => setDraft((d) => ({ ...d, completedDate: e.target.value }))}
                      />
                    </div>
                  </div>
                  <label className="field-label">Notes</label>
                  <textarea
                    className="field-textarea"
                    rows={2}
                    value={draft.remarks}
                    onChange={(e) => setDraft((d) => ({ ...d, remarks: e.target.value }))}
                    placeholder="Add a note about this stage..."
                  />
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button className="btn btn-gold btn-sm" disabled={saving} onClick={() => save(stage.stageName)}>
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditingStage(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
