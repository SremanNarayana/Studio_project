"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

const slides = [
  "/hero-4.jpg",
  "/hero-2.jpg",
  "/hero-3.jpg",
  "/hero-1.jpg",
];

// Focal point per slide so the couple's faces sit correctly within the crop on
// both desktop (crops top/bottom) and mobile (crops the sides).
const slidePos = [
  "object-[center_35%]", // hero-4 (now first) — landscape, faces upper-centre
  "object-[center_32%]", // hero-2 — landscape, couple embraced (centred via ken-burns pan)
  "object-[center_33%]", // hero-3 — tall portrait, faces about a third down
  "object-[center_40%]", // hero-1 (now last) — full-body street portrait, faces ~40% down
];

// Alternating Ken Burns moves — each slide zooms + drifts in a unique direction.
const kenBurns = [
  { scale: [1.12, 1.0], x: ["-2%", "1%"], y: ["1%", "-2%"] },
  // Slide 2: couple is composed to the left — zoom in + pan right to centre them.
  { scale: [1.26, 1.34], x: ["12%", "10%"], y: ["-2%", "0%"] },
  { scale: [1.1, 1.0], x: ["1%", "-2%"], y: ["-2%", "1%"] },
  { scale: [1.0, 1.12], x: ["-1%", "2%"], y: ["2%", "-1%"] },
];

const SLIDE_MS = 6500;

export function Hero() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative isolate w-full min-h-screen overflow-hidden bg-gradient-to-b from-[#f7ecd3] via-[#faf2dc] to-white">
      <div className="relative h-screen w-full">
        {/* Gold corner brackets */}
        <CornerBracket className="absolute -top-2 -left-2 z-20" />
        <CornerBracket className="absolute -top-2 -right-2 rotate-90 z-20" />
        <CornerBracket className="absolute -bottom-2 -left-2 -rotate-90 z-20" />
        <CornerBracket className="absolute -bottom-2 -right-2 rotate-180 z-20" />

        <div className="relative h-full w-full overflow-hidden bg-ink-900">
          {/* Ken Burns slideshow */}
          <AnimatePresence>
            <motion.div
              key={idx}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.8, ease: "easeInOut" } }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{
                  scale: kenBurns[idx].scale[0],
                  x: kenBurns[idx].x[0],
                  y: kenBurns[idx].y[0],
                }}
                animate={{
                  scale: kenBurns[idx].scale[1],
                  x: kenBurns[idx].x[1],
                  y: kenBurns[idx].y[1],
                }}
                transition={{ duration: SLIDE_MS / 1000 + 2, ease: "linear" }}
              >
                <Image
                  src={slides[idx]}
                  alt=""
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  className={`object-cover ${slidePos[idx]}`}
                  draggable={false}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Subtle vignette for depth */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_140px_rgba(0,0,0,0.35)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-b from-transparent to-black/30 pointer-events-none" />

          {/* Scroll cue — icon only */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/80"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>

          {/* Thin progress indicators */}
          <div className="absolute bottom-6 right-6 sm:right-8 flex items-center gap-2 z-20">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className="relative h-[3px] w-8 sm:w-10 rounded-full bg-white/25 overflow-hidden"
                aria-label={`Slide ${i + 1}`}
              >
                {i === idx && (
                  <motion.span
                    key={`${idx}`}
                    className="absolute inset-0 bg-white rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                  />
                )}
                {i < idx && <span className="absolute inset-0 bg-white/60 rounded-full" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CornerBracket({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className={className} aria-hidden>
      <path d="M2 11V2H11" stroke="#c2a14b" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}
