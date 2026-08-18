"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Aperture,
  Calendar,
  CheckCircle2,
  Send,
  Sparkles,
  Home,
  Camera,
} from "lucide-react";

const eventTypes = [
  "Wedding",
  "Reception",
  "Engagement",
  "Maternity",
  "Baby Shoot",
  "Birthday",
  "Corporate Event",
  "Product Shoot",
  "Fashion Shoot",
  "Commercial Shoot",
  "Other",
];

const budgetRanges = [
  "Below ₹25,000",
  "₹25,000 – ₹50,000",
  "₹50,000 – ₹1,00,000",
  "Above ₹1,00,000",
];

const serviceOptions = [
  "Photography",
  "Cinematography",
  "Drone Coverage",
  "Pre-Wedding Shoot",
  "Live Streaming",
  "Album Design",
  "LED Wall",
  "Traditional Video",
  "Other",
];

type FormState = {
  name: string;
  mobile: string;
  email: string;
  city: string;
  eventType: string;
  date: string;
  time: string;
  location: string;
  budget: string;
  services: string[];
  requirement: string;
  consent: boolean;
};

type Errors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  name: "",
  mobile: "",
  email: "",
  city: "",
  eventType: "",
  date: "",
  time: "",
  location: "",
  budget: "",
  services: [],
  requirement: "",
  consent: false,
};

// Indian mobile: optional +91 / 91 / 0 prefix, then a 10-digit number starting 6–9.
const INDIAN_MOBILE = /^(?:\+?91[\-\s]?|0)?[6-9]\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function BookNow() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  }

  function toggleService(service: string) {
    setForm((f) => ({
      ...f,
      services: f.services.includes(service)
        ? f.services.filter((s) => s !== service)
        : [...f.services, service],
    }));
  }

  function validate(): Errors {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Please enter your full name.";

    const mobile = form.mobile.replace(/\s+/g, "");
    if (!mobile) next.mobile = "Please enter your mobile number.";
    else if (!INDIAN_MOBILE.test(mobile))
      next.mobile = "Enter a valid 10-digit Indian mobile number.";

    if (!form.email.trim()) next.email = "Please enter your email address.";
    else if (!EMAIL.test(form.email.trim()))
      next.email = "Enter a valid email address.";

    if (!form.eventType) next.eventType = "Please select an event type.";
    if (!form.date) next.date = "Please choose your preferred date.";
    if (!form.consent)
      next.consent = "Please agree to be contacted so we can respond.";

    return next;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      // Focus the first field with an error for accessibility.
      const first = document.querySelector<HTMLElement>("[data-error='true']");
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setLoading(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "We could not send your enquiry. Please try again.");
      setTrackingNumber(result.trackingNumber || "");
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We could not send your enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative section-pad overflow-hidden">
      {/* Editorial backdrop — mirrors the studio's other sections */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(94,155,200,0.10),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(194,161,75,0.08),transparent_55%)]" />
      <div className="absolute -top-20 right-1/4 hidden lg:block">
        <Aperture className="h-72 w-72 text-azure-200/30" strokeWidth={0.6} />
      </div>

      <div className="container-x relative">
        {/* Hero — rendered visible by default so content is never gated on JS/animation */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-5">
            <Camera className="h-3 w-3 text-azure-500" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-azure-600 font-medium">
              Booking Enquiry
            </span>
          </div>
          <h1 className="h-display">
            Book Your <span className="italic gold-text">Photography Session</span>
          </h1>
          <p className="mt-6 text-ivory-200 font-light text-lg">
            Tell us about your requirements and our team will contact you with the
            most suitable package and pricing for your event.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto max-w-xl bg-white rounded-sm border border-black/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.12)] gold-border p-10 sm:p-14 text-center"
            >
              <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" strokeWidth={1.6} />
              </div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-azure-600 font-medium mb-3">
                Enquiry Received
              </div>
              <h2 className="font-display text-4xl sm:text-5xl text-ivory-50 mb-5">
                Thank <span className="italic gold-text">You!</span>
              </h2>
              <p className="text-ivory-200 font-light leading-relaxed">
                Thank you for contacting Malayaan Photography.
                <br />
                We have received your enquiry successfully.
                <br />
                Our team will get in touch with you shortly.
              </p>
              {trackingNumber && (
                <p className="mt-6 rounded-sm bg-black/[0.04] px-4 py-3 text-sm text-ivory-100">
                  Your tracking ID: <strong className="text-ivory-50">{trackingNumber}</strong>
                </p>
              )}
              <Link href="/" className="btn-primary mt-9">
                <Home className="h-4 w-4" />
                Return to Home
              </Link>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={submit}
              noValidate
              // initial={false}: render at the visible (animate) state in SSR so the
              // form is never blank if hydration/JS is delayed; the form→success
              // swap animation is preserved via exit + the success card's own initial.
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto max-w-3xl bg-white rounded-sm border border-black/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.12)] p-8 sm:p-10 lg:p-12"
            >
              {/* Aperture corner emblem */}
              <div className="absolute top-6 right-6 text-azure-500/30">
                <Aperture className="h-7 w-7" strokeWidth={1.4} />
              </div>

              <div className="text-[10px] uppercase tracking-[0.3em] text-azure-600 font-medium mb-2">
                Event Details
              </div>
              <div className="font-display text-3xl sm:text-4xl text-ivory-50 mb-2">
                Tell Us About Your Event
              </div>
              <p className="text-sm text-ivory-200 mb-10">
                Share your details and requirements — the studio will review and
                respond with the best-suited package.
              </p>

              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7">
                <Field
                  label="Full Name"
                  required
                  value={form.name}
                  onChange={(v) => update("name", v)}
                  error={errors.name}
                  autoComplete="name"
                />
                <Field
                  label="Mobile Number"
                  required
                  type="tel"
                  value={form.mobile}
                  onChange={(v) => update("mobile", v)}
                  error={errors.mobile}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                />
                <Field
                  label="Email Address"
                  required
                  type="email"
                  value={form.email}
                  onChange={(v) => update("email", v)}
                  error={errors.email}
                  autoComplete="email"
                />
                <Field
                  label="City"
                  value={form.city}
                  onChange={(v) => update("city", v)}
                  placeholder="Your city"
                  autoComplete="address-level2"
                />
                <SelectField
                  label="Event Type"
                  required
                  value={form.eventType}
                  onChange={(v) => update("eventType", v)}
                  options={eventTypes}
                  placeholder="Select event type"
                  error={errors.eventType}
                />
                <Field
                  label="Preferred Event Date"
                  required
                  type="date"
                  value={form.date}
                  onChange={(v) => update("date", v)}
                  error={errors.date}
                />
                <Field
                  label="Preferred Time"
                  type="time"
                  value={form.time}
                  onChange={(v) => update("time", v)}
                />
                <Field
                  label="Event Location / Venue"
                  value={form.location}
                  onChange={(v) => update("location", v)}
                  placeholder="City or venue"
                />
                <SelectField
                  label="Estimated Budget"
                  value={form.budget}
                  onChange={(v) => update("budget", v)}
                  options={budgetRanges}
                  placeholder="Select a range"
                />
              </div>

              {/* Services Required — multi-select checkboxes */}
              <div className="mt-9">
                <span className="text-[10px] uppercase tracking-[0.28em] text-ivory-200 font-medium mb-4 block">
                  Services Required
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {serviceOptions.map((service) => {
                    const active = form.services.includes(service);
                    return (
                      <button
                        type="button"
                        key={service}
                        onClick={() => toggleService(service)}
                        aria-pressed={active}
                        className={`flex items-center gap-3 rounded-sm border px-4 py-3 text-left text-sm transition-all duration-300 ${
                          active
                            ? "border-gold-400 bg-gold-400/[0.08] text-ivory-50 shadow-[0_8px_24px_-14px_rgba(194,161,75,0.6)]"
                            : "border-black/12 text-ivory-200 hover:border-gold-500/50 hover:bg-black/[0.02]"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
                            active
                              ? "border-gold-500 bg-gradient-to-br from-gold-500 to-gold-400 text-white"
                              : "border-black/25"
                          }`}
                        >
                          {active && <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.4} />}
                        </span>
                        {service}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Requirement */}
              <div className="mt-9">
                <label className="block group">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-ivory-200 font-medium mb-2 block transition-colors group-focus-within:text-azure-600">
                    Tell Us About Your Requirement
                  </span>
                  <textarea
                    rows={5}
                    value={form.requirement}
                    onChange={(e) => update("requirement", e.target.value)}
                    placeholder="Briefly describe your event, expectations, special requirements, or any additional information."
                    className="w-full bg-transparent border-b border-black/15 px-0 py-2.5 text-ivory-50 text-base placeholder:text-ivory-200/60 focus:outline-none focus:border-azure-500 transition-colors resize-none"
                  />
                </label>
              </div>

              {/* Consent */}
              <div className="mt-9" data-error={errors.consent ? "true" : undefined}>
                <button
                  type="button"
                  onClick={() => update("consent", !form.consent)}
                  aria-pressed={form.consent}
                  className="flex items-start gap-3 text-left"
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
                      form.consent
                        ? "border-gold-500 bg-gradient-to-br from-gold-500 to-gold-400 text-white"
                        : errors.consent
                          ? "border-rose-400"
                          : "border-black/25"
                    }`}
                  >
                    {form.consent && <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.4} />}
                  </span>
                  <span className="text-sm text-ivory-200 leading-relaxed">
                    I agree to be contacted by Malayaan Photography regarding my
                    enquiry. <span className="text-gold-600">*</span>
                  </span>
                </button>
                <FieldError message={errors.consent} />
              </div>

              {/* Submit — full-width gold gradient */}
              <button
                type="submit"
                disabled={loading}
                className="group mt-10 inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 px-9 py-4 text-sm font-medium uppercase tracking-[0.18em] text-white transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(194,161,75,0.5)] hover:shadow-[0_14px_40px_-10px_rgba(194,161,75,0.7)] hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0"
              >
                {loading ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Sending
                  </>
                ) : (
                  <>
                    Send Enquiry
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {submitError && <p className="mt-4 text-center text-sm text-rose-600" role="alert">{submitError}</p>}

              <div className="mt-5 flex items-center justify-center gap-2.5 text-center">
                <Calendar className="h-3.5 w-3.5 text-azure-500" />
                <span className="text-[10px] uppercase tracking-[0.18em] text-ivory-200">
                  Our team replies within 24 hours
                </span>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-2 text-xs text-rose-600"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
  error,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block group" data-error={error ? "true" : undefined}>
      <span className="text-[10px] uppercase tracking-[0.28em] text-ivory-200 font-medium mb-2 block transition-colors group-focus-within:text-azure-600">
        {label} {required && <span className="text-gold-600">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        className={`w-full bg-transparent border-b px-0 py-2.5 text-ivory-50 text-base placeholder:text-ivory-200/60 focus:outline-none transition-colors ${
          error ? "border-rose-400 focus:border-rose-500" : "border-black/15 focus:border-azure-500"
        }`}
      />
      <FieldError message={error} />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
  placeholder?: string;
  error?: string;
}) {
  return (
    <label className="block group" data-error={error ? "true" : undefined}>
      <span className="text-[10px] uppercase tracking-[0.28em] text-ivory-200 font-medium mb-2 block transition-colors group-focus-within:text-azure-600">
        {label} {required && <span className="text-gold-600">*</span>}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        className={`w-full bg-transparent border-b px-0 py-2.5 text-base focus:outline-none transition-colors appearance-none cursor-pointer ${
          value ? "text-ivory-50" : "text-ivory-200/60"
        } ${error ? "border-rose-400 focus:border-rose-500" : "border-black/15 focus:border-azure-500"}`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%235e9bc8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 4px center",
          backgroundSize: "12px",
        }}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <FieldError message={error} />
    </label>
  );
}
