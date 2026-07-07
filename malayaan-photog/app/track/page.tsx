"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, Lock } from "lucide-react";
import { TrackingDashboard } from "@/components/tracking/TrackingDashboard";
import type { PublicBooking } from "@/lib/types";

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<PublicBooking | null>(null);

  useEffect(() => {
    setTrackingNumber(new URLSearchParams(window.location.search).get("id") ?? "");
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingNumber }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Lookup failed.");
        setBooking(null);
      } else {
        setBooking(data.booking);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (booking) {
    return (
      <div className="pt-28 pb-24 min-h-[100svh]">
        <div className="container-x px-6 sm:px-10 lg:px-20">
          <TrackingDashboard
            booking={booking}
            onBack={() => {
              setBooking(null);
              setTrackingNumber("");
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100svh] flex items-center justify-center px-6 sm:px-10 py-32 overflow-hidden">
      {/* Ambient backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(194,161,75,0.08),transparent_60%)]" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-gold-400/5 blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-gold-400/5 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-6">
            <Lock className="h-3 w-3 text-gold-600" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-ivory-100/70">
              Client Portal
            </span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl mb-4 leading-tight">
            Track Your <span className="italic gold-text">Project</span>
          </h1>
          <p className="text-ivory-100/55 font-light">
            Enter your booking ID to view live progress.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <FloatingInput
            label="Tracking ID"
            value={trackingNumber}
            onChange={setTrackingNumber}
            placeholder="MP-26-001"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center mt-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Looking up
              </>
            ) : (
              <>
                Track Project <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-rose-300/90 text-center pt-2"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </form>

      </motion.div>
    </div>
  );
}

function FloatingInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block group">
      <span className="text-[10px] uppercase tracking-[0.28em] text-ivory-100/45 mb-2 block transition-colors group-focus-within:text-gold-600">
        {label}
      </span>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-black/15 px-0 py-3 text-ivory-100 text-base placeholder:text-ivory-100/25 focus:outline-none focus:border-azure-400 transition-colors"
      />
    </label>
  );
}
