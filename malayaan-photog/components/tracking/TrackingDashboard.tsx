"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Check, Clock3, MapPin, MessageCircle } from "lucide-react";
import type { PublicBooking } from "@/lib/types";

export function TrackingDashboard({ booking, onBack }: { booking: PublicBooking; onBack: () => void }) {
  const pending = booking.approvalStatus === "Pending";
  const approved = booking.approvalStatus === "Approved";
  const stages = booking.projectTimeline ?? [];
  const completed = stages.filter((stage) => stage.status === "Completed").length;
  const progress = stages.length ? Math.round((completed / stages.length) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-ivory-100/55 hover:text-gold-600 transition mb-10">
        <ArrowLeft className="h-4 w-4" /> New Lookup
      </button>

      <div className="glass gold-border rounded-sm p-8 sm:p-12">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-gold-600/80 mb-2">{booking.trackingNumber}</div>
            <h1 className="font-display text-4xl sm:text-5xl">{booking.personalDetails.fullName}</h1>
            <p className="mt-2 text-ivory-100/55">{booking.eventDetails.shootType}</p>
          </div>
          <div className={`inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-xs uppercase tracking-[0.16em] ${approved ? "bg-emerald-100 text-emerald-700" : pending ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
            {pending ? <Clock3 className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            {pending ? "Pending Studio Approval" : booking.approvalStatus}
          </div>
        </div>

        {pending && (
          <div className="mt-8 border border-amber-200 bg-amber-50/70 p-5 text-sm text-amber-900">
            The studio is checking availability for your event. You can return here with the same tracking ID and phone number to see the decision.
          </div>
        )}

        <div className="mt-9 grid sm:grid-cols-3 gap-4">
          <Info icon={Calendar} label="Event date" value={formatDate(booking.eventDetails.eventDate)} />
          <Info icon={MapPin} label="Venue" value={booking.eventDetails.venueName || booking.eventDetails.venueAddress || "To be confirmed"} />
          <Info icon={Clock3} label="Current stage" value={pending ? "Awaiting approval" : booking.currentStage || "Booking"} />
        </div>

        {approved && stages.length > 0 && (
          <section className="mt-10 pt-8 border-t border-black/[0.08]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-ivory-100/70">Project progress</h2>
              <span className="font-display text-2xl gold-text">{progress}%</span>
            </div>
            <div className="h-1.5 bg-black/[0.08] rounded-full overflow-hidden"><div className="h-full bg-gold-500 transition-all" style={{ width: `${progress}%` }} /></div>
            <div className="mt-7 space-y-4">
              {stages.map((stage) => (
                <div key={stage.stageName} className="flex items-start gap-3">
                  <span className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center ${stage.status === "Completed" ? "bg-emerald-500 text-white" : stage.status === "In Progress" ? "bg-gold-500 text-white" : "bg-black/10"}`}>
                    {stage.status === "Completed" && <Check className="h-3 w-3" />}
                  </span>
                  <div><p className="text-sm text-ivory-100">{stage.stageName}</p><p className="text-xs text-ivory-100/45">{stage.status}</p></div>
                </div>
              ))}
            </div>
          </section>
        )}

        <a href="https://wa.me/917708113657" className="mt-10 inline-flex items-center gap-2 text-sm text-gold-600 hover:text-gold-500">
          <MessageCircle className="h-4 w-4" /> Contact the studio
        </a>
      </div>
    </motion.div>
  );
}

function Info({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return <div className="bg-black/[0.025] border border-black/[0.06] p-4"><Icon className="h-4 w-4 text-gold-600 mb-3" /><div className="text-[9px] uppercase tracking-[0.22em] text-ivory-100/40">{label}</div><div className="mt-1 text-sm text-ivory-100">{value}</div></div>;
}

function formatDate(value?: string | null) {
  if (!value) return "To be confirmed";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}
