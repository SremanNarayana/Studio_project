"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Compass,
  Camera,
  Wand2,
  BookOpen,
  Gift,
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
  Check,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    n: "01",
    icon: MessageCircle,
    title: "Consultation",
    eyebrow: "The First Hello",
    desc: "Over a relaxed call, we map out your story, your vision, and how you want this chapter remembered.",
    duration: "60-min discovery call",
    deliverables: ["Tailored quote", "Date reservation", "Vision board"],
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=85",
  },
  {
    n: "02",
    icon: Compass,
    title: "Planning & Concept",
    eyebrow: "Crafting the Vision",
    desc: "Moodboards, locations, wardrobe palettes, golden-hour timing — every detail composed before the camera rolls.",
    duration: "2-3 weeks before",
    deliverables: ["Custom moodboard", "Shot list", "Location scout"],
    image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1600&q=85",
  },
  {
    n: "03",
    icon: Camera,
    title: "Photoshoot",
    eyebrow: "The Day Itself",
    desc: "We move quietly, capture honestly, and direct only when it elevates the moment. Your day, undisturbed.",
    duration: "Full-day coverage",
    deliverables: ["Two photographers", "Cinematic film crew", "Same-day preview"],
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=85",
  },
  {
    n: "04",
    icon: Wand2,
    title: "Editing & Retouching",
    eyebrow: "The Craft",
    desc: "Frame by frame, our senior editors color-grade, retouch, and curate the masters — heirloom quality only.",
    duration: "3-4 weeks of craft",
    deliverables: ["Cinematic color grade", "Master selection", "Skin & sky polish"],
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1600&q=85",
  },
  {
    n: "05",
    icon: BookOpen,
    title: "Album Design",
    eyebrow: "The Heirloom",
    desc: "Layouts curated like an editorial spread. Printed on archival fine art paper, bound by hand.",
    duration: "2 weeks · 2 revisions",
    deliverables: ["Editorial layouts", "Italian linen cover", "Lifetime guarantee"],
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=85",
  },
  {
    n: "06",
    icon: Gift,
    title: "Final Delivery",
    eyebrow: "The Unveiling",
    desc: "Your album arrives hand-presented in linen. Online gallery for sharing. Forever digital vault for safekeeping.",
    duration: "8-12 weeks total",
    deliverables: ["Hand-presented album", "Private online gallery", "Lifetime cloud backup"],
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1600&q=85",
  },
];

const AUTO_ADVANCE_MS = 6000;

export function Process() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const current = steps[active];

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setActive((i) => (i + 1) % steps.length);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused]);

  const go = (idx: number) => {
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
  };
  const next = () => go((active + 1) % steps.length);
  const prev = () => go((active - 1 + steps.length) % steps.length);

  return (
    <section
      id="process"
      className="relative section-pad bg-ink-900/40 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Bottom blend — bleeds into Contact for a seamless transition */}
      <div className="absolute -bottom-32 inset-x-0 h-32 bg-gradient-to-b from-transparent to-[#faf7f1] pointer-events-none z-0" />

      {/* Ambient backdrops */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(94,155,200,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(194,161,75,0.06),transparent_55%)]" />

      <div className="container-x relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-12 gap-8 items-end mb-12"
        >
          <div className="lg:col-span-7">
            <div className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-azure-500 font-medium mb-6">
              The Process
            </div>
            <h2 className="font-display font-light text-3xl sm:text-4xl md:text-[2.75rem] leading-[1.2] tracking-[-0.01em] text-ivory-50">
              From hello,
              <br />
              <span className="italic gold-text">to heirloom.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:text-right">
            <p className="text-ivory-200 font-light text-sm leading-relaxed max-w-sm lg:ml-auto">
              Six considered chapters. Each one obsessed over, so you don&rsquo;t have to.
            </p>
          </div>
        </motion.div>

        {/* Main stage — editorial image card + content panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
          className="grid lg:grid-cols-12 gap-6 lg:gap-10 mb-10"
        >
          {/* Image stage */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-sm overflow-hidden bg-ink-900 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)]">
              <AnimatePresence mode="popLayout" custom={direction}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <motion.img
                  key={active}
                  src={current.image}
                  alt={current.title}
                  custom={direction}
                  initial={{ opacity: 0, scale: 1.08, x: direction * 40 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 1.04, x: -direction * 40 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>

              {/* Top scrim + step counter */}
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center">
                    <current.icon className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.3em] text-white/70">
                      {current.eyebrow}
                    </div>
                    <div className="font-display text-lg leading-tight">{current.title}</div>
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5 font-display">
                  <span className="text-3xl gold-text">{current.n}</span>
                  <span className="text-sm text-white/50">/ {String(steps.length).padStart(2, "0")}</span>
                </div>
              </div>

              {/* Bottom scrim with playback controls */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-4">
                {/* Progress bar */}
                <div className="flex-1 flex items-center gap-1.5">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 h-[3px] bg-white/15 rounded-full overflow-hidden cursor-pointer group"
                      onClick={() => go(i)}
                    >
                      <motion.div
                        key={`${active}-${i}-${paused}`}
                        className={`h-full ${
                          i < active ? "bg-gold-400" : i === active ? "bg-gradient-to-r from-gold-500 to-gold-300" : "bg-transparent"
                        }`}
                        initial={i === active ? { width: 0 } : false}
                        animate={i === active ? { width: paused ? "30%" : "100%" } : { width: i < active ? "100%" : "0%" }}
                        transition={
                          i === active && !paused
                            ? { duration: AUTO_ADVANCE_MS / 1000, ease: "linear" }
                            : { duration: 0.4 }
                        }
                      />
                    </div>
                  ))}
                </div>
                {/* Playback toggle + prev/next */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPaused((p) => !p)}
                    className="h-9 w-9 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white hover:bg-white/25 transition flex items-center justify-center"
                    aria-label={paused ? "Play" : "Pause"}
                  >
                    {paused ? (
                      <Play className="h-3.5 w-3.5" strokeWidth={2} />
                    ) : (
                      <Pause className="h-3.5 w-3.5" strokeWidth={2} />
                    )}
                  </button>
                  <button
                    onClick={prev}
                    className="h-9 w-9 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white hover:bg-white/25 transition flex items-center justify-center"
                    aria-label="Previous step"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={next}
                    className="h-9 w-9 rounded-full bg-white text-ivory-50 hover:bg-gold-300 transition flex items-center justify-center"
                    aria-label="Next step"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Floating step number — editorial flourish */}
            <div className="absolute -top-8 -left-3 sm:-left-6 hidden md:block pointer-events-none select-none">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 20, rotate: -6 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-[140px] leading-none text-gold-400/20"
                  style={{ WebkitTextStroke: "1px rgba(194,161,75,0.4)", color: "transparent" }}
                >
                  {current.n}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Content panel */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-gradient-to-r from-azure-300 to-azure-500" />
                <span className="text-[10px] uppercase tracking-[0.32em] text-azure-600 font-semibold">
                  Chapter {current.n}
                </span>
              </div>
              <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ivory-50 mb-5 leading-[1.1]">
                {current.title}
              </h3>
              <p className="text-ivory-200 leading-relaxed font-light text-base mb-7">
                {current.desc}
              </p>

              {/* Deliverables */}
              <div className="mb-7 space-y-2.5">
                {current.deliverables.map((d) => (
                  <div key={d} className="flex items-start gap-3">
                    <span className="h-5 w-5 rounded-full bg-gold-400/15 border border-gold-400/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-gold-600" strokeWidth={2.5} />
                    </span>
                    <span className="text-sm text-ivory-100">{d}</span>
                  </div>
                ))}
              </div>

              {/* Duration tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-azure-50 border border-azure-200 text-xs text-azure-600">
                <span className="h-1.5 w-1.5 rounded-full bg-azure-500 animate-pulse" />
                {current.duration}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Thumbnail filmstrip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          {/* Connecting line behind thumbs */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-azure-200 to-transparent hidden sm:block" />

          <div className="relative grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
            {steps.map((s, i) => {
              const isActive = i === active;
              const isDone = i < active;
              return (
                <button
                  key={s.n}
                  onMouseEnter={() => go(i)}
                  onFocus={() => go(i)}
                  onClick={() => go(i)}
                  className={`group relative text-left transition-all duration-500 ${
                    isActive ? "-translate-y-2 sm:-translate-y-3" : "hover:-translate-y-1"
                  }`}
                >
                  {/* Thumbnail card */}
                  <div
                    className={`relative aspect-[4/5] rounded-sm overflow-hidden border-2 transition-all duration-500 ${
                      isActive
                        ? "border-gold-400 shadow-[0_18px_40px_-12px_rgba(194,161,75,0.45)]"
                        : "border-transparent shadow-md hover:shadow-lg"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.image}
                      alt={s.title}
                      loading="lazy"
                      className={`h-full w-full object-cover transition-all duration-700 ${
                        isActive ? "scale-105" : "scale-100 grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105"
                      }`}
                    />
                    {/* Overlay gradient */}
                    <div
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        isActive
                          ? "bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-100"
                          : "bg-gradient-to-t from-black/85 via-black/30 to-black/10 opacity-90 group-hover:opacity-70"
                      }`}
                    />
                    {/* Step number — top */}
                    <div className="absolute top-2 left-2.5 sm:top-3 sm:left-3">
                      <span
                        className={`font-display text-xl sm:text-2xl leading-none transition-colors ${
                          isActive ? "gold-text" : "text-white/85"
                        }`}
                      >
                        {s.n}
                      </span>
                    </div>
                    {/* Done check */}
                    {isDone && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 h-5 w-5 rounded-full bg-gold-400 text-white flex items-center justify-center">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </div>
                    )}
                    {/* Active pulse */}
                    {isActive && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/95 text-[8px] uppercase tracking-[0.18em] text-gold-700 font-bold">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold-500 animate-pulse" />
                        Now
                      </div>
                    )}
                    {/* Title — bottom */}
                    <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-3">
                      <div className="flex items-center gap-1.5">
                        <s.icon
                          className={`h-3 w-3 shrink-0 transition-colors ${
                            isActive ? "text-gold-300" : "text-white/70"
                          }`}
                          strokeWidth={1.6}
                        />
                        <div
                          className={`text-[11px] sm:text-xs font-medium leading-tight transition-colors ${
                            isActive ? "text-white" : "text-white/85"
                          }`}
                        >
                          {s.title}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white border border-black/[0.08] shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-xs uppercase tracking-[0.28em] text-ivory-100">
              Average turnaround · 8 – 12 weeks
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
