"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, LogOut, Search, Edit3, Trash2, X, Save, Mail, Phone } from "lucide-react";
import { STAGE_LABEL, STAGE_ORDER, type Booking, type ProgressStage, type DeliverableStatus } from "@/lib/types";

type Enquiry = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  service: string | null;
  event_date: string | null;
  message: string | null;
  created_at: string;
};

export function AdminDashboard({
  user,
  bookings: initial,
  enquiries,
}: {
  user: { email: string };
  bookings: Booking[];
  enquiries: Enquiry[];
}) {
  const router = useRouter();
  const [bookings, setBookings] = useState(initial);
  const [tab, setTab] = useState<"bookings" | "enquiries">("bookings");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Booking | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = bookings.filter(
    (b) =>
      !q ||
      b.client_name.toLowerCase().includes(q.toLowerCase()) ||
      b.booking_id.toLowerCase().includes(q.toLowerCase()) ||
      b.tracking_number.toLowerCase().includes(q.toLowerCase())
  );

  async function save(patch: Partial<Booking> & { id: string; update_note?: string }) {
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      setBookings((bs) => bs.map((b) => (b.id === patch.id ? { ...b, ...patch } : b)));
      setEditing(null);
      router.refresh();
    } else {
      const { error } = await res.json();
      alert(error ?? "Failed to save");
    }
  }

  async function create(b: Partial<Booking>) {
    const res = await fetch("/api/admin/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(b),
    });
    if (res.ok) {
      const { booking } = await res.json();
      setBookings((bs) => [{ ...booking, updates: [] }, ...bs]);
      setCreating(false);
      router.refresh();
    } else {
      const { error } = await res.json();
      alert(error ?? "Failed to create");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this booking? This cannot be undone.")) return;
    const res = await fetch("/api/admin/bookings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setBookings((bs) => bs.filter((b) => b.id !== id));
      router.refresh();
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <div className="eyebrow mb-1">— Admin Console</div>
          <h1 className="font-display text-4xl">Studio Dashboard</h1>
          <p className="text-sm text-ivory-100/50 mt-1">Signed in as {user.email}</p>
        </div>
        <form action="/admin/logout" method="post">
          <button className="btn-ghost">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </form>
      </header>

      <div className="flex gap-2 mb-6 border-b border-black/5">
        {(["bookings", "enquiries"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-xs uppercase tracking-[0.22em] border-b-2 transition ${
              tab === t ? "border-gold-400 text-gold-600" : "border-transparent text-ivory-100/50 hover:text-ivory-100"
            }`}
          >
            {t} ({t === "bookings" ? bookings.length : enquiries.length})
          </button>
        ))}
      </div>

      {tab === "bookings" && (
        <>
          <div className="flex flex-wrap gap-3 justify-between mb-6">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ivory-100/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, booking ID, tracking #"
                className="w-full pl-10 pr-4 py-2.5 bg-black/[0.03] border border-black/10 rounded-sm focus:outline-none focus:border-azure-400"
              />
            </div>
            <button onClick={() => setCreating(true)} className="btn-primary">
              <Plus className="h-4 w-4" /> New Booking
            </button>
          </div>

          <div className="overflow-x-auto rounded-sm border border-black/5">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.03] text-[10px] uppercase tracking-[0.18em] text-ivory-100/50">
                <tr>
                  <th className="text-left px-4 py-3">Booking</th>
                  <th className="text-left px-4 py-3">Client</th>
                  <th className="text-left px-4 py-3">Event</th>
                  <th className="text-left px-4 py-3">Shoot Date</th>
                  <th className="text-left px-4 py-3">Stage</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-t border-black/5 hover:bg-black/[0.02]">
                    <td className="px-4 py-3 font-mono text-xs">
                      <div className="text-gold-600">{b.booking_id}</div>
                      <div className="text-ivory-100/40">{b.tracking_number}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{b.client_name}</div>
                      <div className="text-xs text-ivory-100/40">{b.client_phone}</div>
                    </td>
                    <td className="px-4 py-3 text-ivory-100/70">{b.event_type}</td>
                    <td className="px-4 py-3 text-ivory-100/70">{fmt(b.shoot_date)}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-[10px] uppercase tracking-[0.18em] bg-gold-400/15 text-gold-600 rounded-full">
                        {STAGE_LABEL[b.current_stage]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setEditing(b)} className="p-2 hover:text-gold-600" aria-label="Edit">
                        <Edit3 className="h-4 w-4 inline" />
                      </button>
                      <button onClick={() => remove(b.id)} className="p-2 hover:text-rose-300" aria-label="Delete">
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-ivory-100/40">
                      No bookings yet. Create your first one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "enquiries" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {enquiries.map((e) => (
            <div key={e.id} className="p-5 rounded-sm border border-black/5 bg-ink-900">
              <div className="text-xs text-ivory-100/40 mb-2">{fmt(e.created_at)}</div>
              <div className="font-display text-xl mb-1">{e.name}</div>
              <div className="text-sm text-gold-600 mb-3">{e.service ?? "—"}</div>
              <div className="space-y-1.5 text-xs">
                <a href={`tel:${e.phone}`} className="flex items-center gap-2 text-ivory-100/70 hover:text-gold-600">
                  <Phone className="h-3 w-3" /> {e.phone}
                </a>
                {e.email && (
                  <a href={`mailto:${e.email}`} className="flex items-center gap-2 text-ivory-100/70 hover:text-gold-600">
                    <Mail className="h-3 w-3" /> {e.email}
                  </a>
                )}
              </div>
              {e.message && (
                <p className="mt-4 pt-4 border-t border-black/5 text-sm text-ivory-100/70 leading-relaxed">{e.message}</p>
              )}
            </div>
          ))}
          {enquiries.length === 0 && (
            <p className="col-span-full text-center text-ivory-100/40 py-12">No enquiries yet.</p>
          )}
        </div>
      )}

      {(editing || creating) && (
        <BookingModal
          booking={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={editing ? (p) => save({ id: editing.id, ...p }) : create}
        />
      )}
    </div>
  );
}

function BookingModal({
  booking,
  onClose,
  onSave,
}: {
  booking: Booking | null;
  onClose: () => void;
  onSave: (b: Partial<Booking> & { update_note?: string }) => void | Promise<void>;
}) {
  const [form, setForm] = useState<Partial<Booking> & { update_note?: string }>(() =>
    booking
      ? { ...booking }
      : {
          booking_id: `MLY-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
          tracking_number: `TRK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          current_stage: "booking_confirmed",
          edited_photos: 0,
          total_photos: 0,
          album_progress: 0,
          video_progress: 0,
          deliverables: {
            raw_photos: "pending",
            edited_photos: "pending",
            album_design: "pending",
            wedding_trailer: "pending",
            cinematic_film: "pending",
          },
        }
  );

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function setDeliverable(k: keyof Booking["deliverables"], v: DeliverableStatus) {
    setForm((f) => ({
      ...f,
      deliverables: { ...(f.deliverables ?? ({} as Booking["deliverables"])), [k]: v },
    }));
  }

  return (
    <div className="fixed inset-0 z-[90] bg-ink-950/90 backdrop-blur-xl flex items-start justify-center overflow-y-auto p-6">
      <div className="w-full max-w-3xl glass gold-border rounded-sm p-8 my-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl">{booking ? "Edit Booking" : "New Booking"}</h2>
          <button onClick={onClose} aria-label="Close" className="p-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Booking ID">
            <input
              value={form.booking_id ?? ""}
              onChange={(e) => set("booking_id", e.target.value)}
              className="adm-input"
              disabled={!!booking}
            />
          </Field>
          <Field label="Tracking Number">
            <input
              value={form.tracking_number ?? ""}
              onChange={(e) => set("tracking_number", e.target.value)}
              className="adm-input"
              disabled={!!booking}
            />
          </Field>
          <Field label="Client Name">
            <input value={form.client_name ?? ""} onChange={(e) => set("client_name", e.target.value)} className="adm-input" />
          </Field>
          <Field label="Phone">
            <input value={form.client_phone ?? ""} onChange={(e) => set("client_phone", e.target.value)} className="adm-input" />
          </Field>
          <Field label="Email">
            <input value={form.client_email ?? ""} onChange={(e) => set("client_email", e.target.value)} className="adm-input" />
          </Field>
          <Field label="Event Type">
            <input value={form.event_type ?? ""} onChange={(e) => set("event_type", e.target.value)} className="adm-input" />
          </Field>
          <Field label="Shoot Date">
            <input type="date" value={form.shoot_date ?? ""} onChange={(e) => set("shoot_date", e.target.value)} className="adm-input" />
          </Field>
          <Field label="Expected Delivery">
            <input type="date" value={form.expected_delivery_date ?? ""} onChange={(e) => set("expected_delivery_date", e.target.value)} className="adm-input" />
          </Field>
          <Field label="Current Stage">
            <select
              value={form.current_stage ?? "booking_confirmed"}
              onChange={(e) => set("current_stage", e.target.value as ProgressStage)}
              className="adm-input"
            >
              {STAGE_ORDER.map((s) => (
                <option key={s} value={s} className="bg-ink-900">
                  {STAGE_LABEL[s]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Total Photos">
            <input
              type="number"
              value={form.total_photos ?? 0}
              onChange={(e) => set("total_photos", Number(e.target.value))}
              className="adm-input"
            />
          </Field>
          <Field label="Edited Photos">
            <input
              type="number"
              value={form.edited_photos ?? 0}
              onChange={(e) => set("edited_photos", Number(e.target.value))}
              className="adm-input"
            />
          </Field>
          <Field label="Album Progress %">
            <input
              type="number"
              value={form.album_progress ?? 0}
              onChange={(e) => set("album_progress", Number(e.target.value))}
              className="adm-input"
            />
          </Field>
          <Field label="Video Progress %">
            <input
              type="number"
              value={form.video_progress ?? 0}
              onChange={(e) => set("video_progress", Number(e.target.value))}
              className="adm-input"
            />
          </Field>
          <Field label="Download URL">
            <input value={form.download_url ?? ""} onChange={(e) => set("download_url", e.target.value)} className="adm-input" />
          </Field>
        </div>

        <div className="mt-6">
          <div className="text-[10px] uppercase tracking-[0.22em] text-ivory-100/50 mb-3">Deliverables</div>
          <div className="grid sm:grid-cols-2 gap-3">
            {(Object.keys(form.deliverables ?? {}) as (keyof Booking["deliverables"])[]).map((k) => (
              <div key={k} className="flex items-center justify-between p-3 rounded-sm border border-black/5 bg-ink-900">
                <span className="text-sm capitalize">{k.replace(/_/g, " ")}</span>
                <select
                  value={form.deliverables?.[k] ?? "pending"}
                  onChange={(e) => setDeliverable(k, e.target.value as DeliverableStatus)}
                  className="adm-input !w-36"
                >
                  <option value="pending" className="bg-ink-900">Pending</option>
                  <option value="in_progress" className="bg-ink-900">In Progress</option>
                  <option value="completed" className="bg-ink-900">Completed</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <Field label="Admin Notes (internal)">
          <textarea
            rows={3}
            value={form.admin_notes ?? ""}
            onChange={(e) => set("admin_notes", e.target.value)}
            className="adm-input resize-none"
          />
        </Field>

        {booking && (
          <Field label="Add Update Note (visible to client)">
            <input
              placeholder="e.g. Album draft v2 ready for review"
              value={form.update_note ?? ""}
              onChange={(e) => set("update_note", e.target.value)}
              className="adm-input"
            />
          </Field>
        )}

        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button onClick={() => onSave(form)} className="btn-primary">
            <Save className="h-4 w-4" /> {booking ? "Save Changes" : "Create Booking"}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .adm-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          padding: 10px 12px;
          color: #f5f1e8;
          font-size: 14px;
        }
        .adm-input:focus {
          outline: none;
          border-color: rgba(94, 155, 200, 0.7);
        }
        .adm-input:disabled {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mt-4 first:mt-0">
      <span className="text-[10px] uppercase tracking-[0.22em] text-ivory-100/50 mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function fmt(d: string) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return d;
  }
}
