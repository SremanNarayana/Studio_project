"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Send,
  Camera,
  Aperture,
  Calendar,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const services = [
  "Wedding",
  "Pre-Wedding",
  "Engagement",
  "Maternity",
  "Baby Shoot",
  "Birthday",
  "Corporate",
  "Product Shoot",
  "Portrait",
  "Other",
];

const next_steps = [
  { n: "01", label: "Reply within 24 hrs", icon: MessageCircle },
  { n: "02", label: "Studio checks availability", icon: Calendar },
  { n: "03", label: "Approval status updated", icon: CheckCircle2 },
];

export function Contact() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Wedding",
    date: "",
    location: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.trackingNumber) {
        setTrackingNumber(data.trackingNumber);
        setForm({
          name: "",
          email: "",
          phone: "",
          service: "Wedding",
          date: "",
          location: "",
        });
      } else setError(data.error ?? "We could not submit your booking request. Please try again.");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="relative section-pad bg-ink-900/40 overflow-hidden">
      {/* Top blend — fades Process section into Contact for a seamless flow */}
      <div className="absolute -top-32 inset-x-0 h-32 bg-gradient-to-b from-[#faf7f1] to-transparent pointer-events-none -z-10" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-azure-200/40 to-transparent" />

      {/* Editorial backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(94,155,200,0.10),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(194,161,75,0.08),transparent_55%)]" />
      <div className="absolute -top-20 right-1/3 hidden lg:block">
        <Aperture className="h-72 w-72 text-azure-200/30" strokeWidth={0.6} />
      </div>

      <div className="container-x relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-5">
            <Camera className="h-3 w-3 text-azure-500" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-azure-600 font-medium">
              Event Booking
            </span>
          </div>
          <h2 className="h-display">
            Let&rsquo;s Create <span className="italic gold-text">Memories Together</span>
          </h2>
          <p className="mt-6 text-ivory-200 font-light text-lg">
            Request your event date and keep track of the studio&rsquo;s approval online.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left — editorial sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Hero card with photo + signature */}
            <div className="relative rounded-sm overflow-hidden gold-border bg-white">
              <div className="relative aspect-[5/4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=85"
                  alt="Malayaan Photography studio session"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ivory-50/85 via-ivory-50/30 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8">
                  <p className="font-display italic text-xl sm:text-2xl text-white leading-snug max-w-sm">
                    &ldquo;Every frame is a love letter to a moment that won&rsquo;t come twice.&rdquo;
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/80">
                    <span className="h-px w-6 bg-gold-300" />
                    Malayaan Studio
                  </div>
                </div>
              </div>
            </div>

            {/* Contact rows */}
            <div className="rounded-sm bg-white border border-black/10 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] divide-y divide-black/5">
              <ContactRow icon={MapPin} label="Visit the Studio" value="Therkkupatty, Melur, Surakkundu, Tamil Nadu 625106" />
              <ContactRow
                icon={Phone}
                label="Talk to a Photographer"
                value="+91 77081 13657"
                href="tel:+917708113657"
              />
              <ContactRow
                icon={Mail}
                label="Drop us a Line"
                value="hello@malayaanphotography.com"
                href="mailto:hello@malayaanphotography.com"
              />
            </div>

          </motion.aside>

          {/* Right — form */}
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 relative bg-white rounded-sm border border-black/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.12)] p-8 sm:p-10"
          >
            {/* Aperture corner emblem */}
            <div className="absolute top-6 right-6 text-azure-500/30">
              <Aperture className="h-7 w-7" strokeWidth={1.4} />
            </div>

            <div className="text-[10px] uppercase tracking-[0.3em] text-azure-600 font-medium mb-2">
              Reserve Your Date
            </div>
            <div className="font-display text-3xl sm:text-4xl text-ivory-50 mb-2">
              Tell Us Your Story
            </div>
            <p className="text-sm text-ivory-200 mb-10">
              Share only your contact and event details. The studio will review availability before approval.
            </p>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7">
              <UnderlineField
                label="Your Name"
                required
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
              />
              <UnderlineField
                label="Phone Number"
                required
                type="tel"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                placeholder="+91"
              />
              <UnderlineField
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
              />
              <UnderlineSelect
                label="Service"
                value={form.service}
                onChange={(v) => setForm({ ...form, service: v })}
                options={services}
              />
              <UnderlineField
                label="Event Date"
                required
                type="date"
                value={form.date}
                onChange={(v) => setForm({ ...form, date: v })}
              />
              <UnderlineField
                label="Location"
                placeholder="City or venue"
                value={form.location}
                onChange={(v) => setForm({ ...form, location: v })}
              />
            </div>

            {trackingNumber && (
              <div className="mt-9 rounded-sm border border-emerald-200 bg-emerald-50 p-6 text-center" role="status">
                <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-600" />
                <p className="mt-3 text-[10px] uppercase tracking-[0.28em] text-emerald-700 font-semibold">
                  Booking request received · Pending studio approval
                </p>
                <p className="mt-4 text-sm text-ivory-200">Save your tracking ID</p>
                <p className="mt-1 font-display text-4xl text-ivory-50 tracking-wide">{trackingNumber}</p>
                <p className="mt-3 text-xs text-ivory-200">
                  Use this ID with your phone number to check approval and project progress.
                </p>
                <Link
                  href={`/track?id=${encodeURIComponent(trackingNumber)}`}
                  className="mt-5 inline-flex items-center rounded-full bg-ivory-50 px-6 py-3 text-xs uppercase tracking-[0.18em] text-white hover:bg-ink-800 transition"
                >
                  Track Booking
                </Link>
              </div>
            )}

            {error && <p className="mt-6 text-sm text-rose-600 text-center" role="alert">{error}</p>}

            {/* What happens next — refined connected steps */}
            <div className="mt-10 pt-8 border-t border-black/[0.08]">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-gradient-to-r from-azure-300 to-azure-500" />
                <div className="text-[10px] uppercase tracking-[0.32em] text-azure-600 font-semibold">
                  What happens next
                </div>
              </div>

              {/* Desktop / tablet — horizontal connected steps */}
              <div className="hidden sm:block relative">
                {/* Connecting line — passes through icon centers (icons are h-10 = 40px; line is at top-5 = 20px) */}
                <div className="absolute top-5 left-5 right-5 h-px bg-gradient-to-r from-azure-200 via-azure-400 to-azure-200" />

                <div className="relative flex justify-between items-start gap-6">
                  {next_steps.map((s) => (
                    <div key={s.n} className="flex flex-col items-center text-center flex-1 min-w-0">
                      {/* Icon node — sits centered on the connecting line */}
                      <div className="relative z-10 h-10 w-10 rounded-full bg-white border border-azure-300 text-azure-500 flex items-center justify-center shadow-[0_4px_12px_-4px_rgba(94,155,200,0.4)]">
                        <s.icon className="h-4 w-4" strokeWidth={1.6} />
                      </div>
                      <div className="mt-4 max-w-[12rem]">
                        <div className="flex items-baseline justify-center gap-2 mb-0.5">
                          <span className="font-display text-base gold-text leading-none">
                            {s.n}
                          </span>
                          <span className="text-[9px] uppercase tracking-[0.25em] text-ivory-200 font-medium">
                            Step
                          </span>
                        </div>
                        <div className="text-sm text-ivory-50 font-medium leading-snug">
                          {s.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile — vertical connected list */}
              <div className="sm:hidden relative pl-5">
                <div className="absolute left-[19px] top-5 bottom-5 w-px bg-gradient-to-b from-azure-200 via-azure-400 to-azure-200" />
                <div className="space-y-5">
                  {next_steps.map((s) => (
                    <div key={s.n} className="relative flex items-start gap-4">
                      <div className="relative z-10 h-10 w-10 rounded-full bg-white border border-azure-300 text-azure-500 flex items-center justify-center shrink-0 -ml-5 shadow-[0_4px_12px_-4px_rgba(94,155,200,0.4)]">
                        <s.icon className="h-4 w-4" strokeWidth={1.6} />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className="font-display text-base gold-text leading-none">
                            {s.n}
                          </span>
                          <span className="text-[9px] uppercase tracking-[0.25em] text-ivory-200 font-medium">
                            Step
                          </span>
                        </div>
                        <div className="text-sm text-ivory-50 font-medium leading-snug">
                          {s.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit row */}
            <div className="mt-10 pt-6 border-t border-black/[0.05] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2} />
                </div>
                <div>
                  <div className="text-xs text-ivory-50 font-medium leading-tight">
                    Your details stay private
                  </div>
                  <div className="text-[10px] text-ivory-200 uppercase tracking-[0.18em] mt-0.5">
                    No spam · No third parties
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || Boolean(trackingNumber)}
                className={`group inline-flex items-center gap-3 px-9 py-4 rounded-full text-sm font-medium tracking-[0.18em] uppercase transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(194,161,75,0.5)] hover:shadow-[0_14px_40px_-10px_rgba(194,161,75,0.7)] hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0 ${
                  trackingNumber
                    ? "bg-emerald-500 text-white"
                    : "bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 text-white"
                }`}
              >
                {trackingNumber ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Request Received
                  </>
                ) : loading ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Sending
                  </>
                ) : (
                  <>
                    Request Booking
                    <span className="h-px w-6 bg-white/80 transition-all group-hover:w-10" />
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-4 p-5 hover:bg-azure-50 transition group">
      <div className="h-10 w-10 rounded-full bg-azure-50 border border-azure-200 text-azure-500 flex items-center justify-center shrink-0 group-hover:bg-azure-500 group-hover:text-white group-hover:border-azure-500 transition">
        <Icon className="h-4 w-4" strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-[0.28em] text-azure-600 font-medium mb-1">
          {label}
        </div>
        <div className="text-ivory-50 text-sm leading-snug">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}

function UnderlineField({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  const common =
    "w-full bg-transparent border-b border-black/15 px-0 py-2.5 text-ivory-50 text-base placeholder:text-ivory-200/60 focus:outline-none focus:border-azure-500 transition-colors";
  return (
    <label className="block group">
      <span className="text-[10px] uppercase tracking-[0.28em] text-ivory-200 font-medium mb-2 block transition-colors group-focus-within:text-azure-600">
        {label} {required && <span className="text-gold-600">*</span>}
      </span>
      {multiline ? (
        <textarea
          rows={3}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${common} resize-none`}
        />
      ) : (
        <input
          required={required}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={common}
        />
      )}
    </label>
  );
}

function UnderlineSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block group">
      <span className="text-[10px] uppercase tracking-[0.28em] text-ivory-200 font-medium mb-2 block transition-colors group-focus-within:text-azure-600">
        Service
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-black/15 px-0 py-2.5 text-ivory-50 text-base focus:outline-none focus:border-azure-500 transition-colors appearance-none cursor-pointer"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%235e9bc8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 4px center",
          backgroundSize: "12px",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
