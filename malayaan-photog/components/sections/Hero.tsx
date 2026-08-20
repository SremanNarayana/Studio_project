"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

/* ----------------------------------------------------------------- config */

const AUTOPLAY_INTERVAL = 2000; // ms an image dwells in the centre
const TRANSITION_DURATION = 900; // ms of the cinematic slide
const EASE = [0.22, 1, 0.36, 1] as const;
const SIDE_SCALE = 0.92; // neighbours sit just under full size, edge-to-edge

type HeroImage = {
  src: string;
  title: string;
  category?: string;
  href?: string;
  /** object-position so faces sit correctly inside the portrait crop */
  pos?: string;
};

// Edit / reorder freely — the carousel adapts to any length (5+ recommended
// for a seamless loop). Portrait-oriented images look best.
const heroImages: HeroImage[] = [
  { src: "/hero-1.jpg", title: "Timeless Moments", category: "Wedding", pos: "center 38%" },
  { src: "/portfolio-new-7.jpg", title: "Sacred Vows", category: "Traditional", pos: "center 30%" },
  { src: "/hero-3.jpg", title: "Forever Together", category: "Couple", pos: "center 30%" },
  { src: "/portfolio-new-1.jpg", title: "Pure Emotions", category: "Pre-Wedding", pos: "center 32%" },
  { src: "/insta-5.jpg", title: "Golden Hour", category: "Couple", pos: "center 32%" },
  { src: "/hero-4.jpg", title: "Grand Celebrations", category: "Reception", pos: "center 30%" },
];

const HERO_TEXT = {
  eyebrow: "Wedding • Portrait • Cinematic Stories",
  line1: "Capturing",
  line2: "Feelings.",
  ctaLabel: "Explore Our Work",
  ctaHref: "/gallery",
};

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")";

/** Shortest signed circular distance of image i from the active centre. */
function offsetOf(i: number, active: number, n: number) {
  let d = (((i - active) % n) + n) % n; // 0 … n-1
  if (d > n / 2) d -= n; // fold the far half to the negative side
  return d;
}

/* --------------------------------------------------------------- component */

export function Hero() {
  const n = heroImages.length;
  const reduce = useReducedMotion();
  const router = useRouter();

  const [active, setActive] = useState(0); // ever-increasing; image = active mod n
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const [dims, setDims] = useState({ slide: 0, slot: 0, height: 0 });

  const next = useCallback(() => setActive((a) => a + 1), []);
  const prev = useCallback(() => setActive((a) => a - 1), []);

  /* responsive slide + slot sizing (px, resize-aware) */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const compute = () => {
      const w = el.clientWidth;
      const vh = window.innerHeight;
      // [slide-width frac, height multiplier, edge gap px] per breakpoint.
      // Desktop uses a gentler-than-2:3 portrait so the centre image can grow
      // wider (~35vw) and taller (~76vh) without a redesign.
      const [slideFrac, aspectMul, gap] =
        w < 640
          ? [0.84, 1.4, 6]
          : w < 1024
            ? [0.56, 1.32, 8]
            : [0.35, 1.22, 10];
      let slide = w * slideFrac;
      let height = slide * aspectMul;
      // Cap height so the enlarged image never overlaps the navbar or the
      // bottom controls (keeps comfortable breathing room top and bottom).
      const maxH = vh * 0.82;
      if (height > maxH) {
        height = maxH;
        slide = height / aspectMul;
      }
      // Tight packing: a neighbour's centre sits one full half-image plus one
      // scaled half-image away, plus only a few px — so adjacent photo edges
      // nearly touch and the three read as one continuous strip.
      const slot = slide * (1 + SIDE_SCALE) / 2 + gap;
      setDims({ slide, slot, height });
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* pause when tab hidden */
  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  /* autoplay */
  const paused = hovering || hidden || !!reduce;
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(next, AUTOPLAY_INTERVAL);
    return () => window.clearInterval(id);
  }, [paused, next]);

  /* subtle mouse parallax */
  const pmx = useMotionValue(0);
  const pmy = useMotionValue(0);
  const px = useSpring(pmx, { stiffness: 120, damping: 22, mass: 0.4 });
  const py = useSpring(pmy, { stiffness: 120, damping: 22, mass: 0.4 });
  const onMouseMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    pmx.set(((e.clientX - r.left) / r.width - 0.5) * 16);
    pmy.set(((e.clientY - r.top) / r.height - 0.5) * 12);
  };
  const resetParallax = () => {
    pmx.set(0);
    pmy.set(0);
  };

  /* swipe */
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 44) (dx < 0 ? next : prev)();
    touchX.current = null;
  };

  const current = ((active % n) + n) % n;

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Featured photography"
      className="relative min-h-screen w-full overflow-hidden bg-[#0c0a09]"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        resetParallax();
      }}
      onMouseMove={onMouseMove}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Layer 1 — ambient backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(38,30,24,0.5),#0c0a09_78%)]" />

      {/* Layer 2 — the carousel (with parallax) */}
      <motion.div style={reduce ? undefined : { x: px, y: py }} className="absolute inset-0">
        {dims.slide > 0 &&
          heroImages.map((img, i) => {
            const off = offsetOf(i, active, n);
            const isCenter = off === 0;
            const abs = Math.abs(off);
            const onScreen = abs <= 2;
            return (
              <motion.button
                key={i}
                type="button"
                aria-label={
                  isCenter
                    ? `${img.title}${img.category ? `, ${img.category}` : ""}`
                    : `Show ${img.title}`
                }
                onClick={() => {
                  if (isCenter) router.push(img.href ?? HERO_TEXT.ctaHref);
                  else setActive(active + off);
                }}
                className="absolute left-1/2 top-1/2 block cursor-pointer"
                style={{
                  width: dims.slide,
                  height: dims.height,
                  zIndex: isCenter ? 20 : 12 - abs,
                }}
                initial={false}
                animate={{
                  x: off * dims.slot - dims.slide / 2,
                  y: "-50%",
                  scale: reduce ? 1 : isCenter ? 1 : SIDE_SCALE,
                  opacity: onScreen ? (isCenter ? 1 : abs === 1 ? 0.55 : 0.28) : 0,
                  filter: isCenter ? "brightness(1) blur(0px)" : "brightness(0.68) blur(2px)",
                }}
                transition={{ duration: (reduce ? 0 : TRANSITION_DURATION) / 1000, ease: EASE }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-[10px] sm:rounded-[14px] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.75)]">
                  {/* Ken Burns — slow micro-zoom only while centred */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ scale: isCenter && !reduce ? 1.05 : 1 }}
                    transition={
                      isCenter
                        ? {
                            duration: (AUTOPLAY_INTERVAL + TRANSITION_DURATION) / 1000,
                            ease: "linear",
                          }
                        : { duration: 0.5, ease: EASE }
                    }
                  >
                    <Image
                      src={img.src}
                      alt={`${img.title}${img.category ? ` — ${img.category}` : ""}`}
                      fill
                      priority={i < 2}
                      loading={i < 2 ? "eager" : "lazy"}
                      sizes="(min-width: 1024px) 35vw, (min-width: 640px) 56vw, 84vw"
                      style={{ objectPosition: img.pos ?? "center 30%" }}
                      className="object-cover"
                      draggable={false}
                    />
                  </motion.div>

                  {/* per-slide bottom scrim + metadata (centre only) */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
                  {isCenter && (
                    <motion.div
                      key={`meta-${current}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
                      className="pointer-events-none absolute inset-x-0 bottom-0 p-5 text-left"
                    >
                      {img.category && (
                        <div className="mb-1 text-[10px] uppercase tracking-[0.28em] text-gold-300">
                          {img.category}
                        </div>
                      )}
                      <div className="font-display text-xl sm:text-2xl text-white leading-tight">
                        {img.title}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
      </motion.div>

      {/* Layer 3 — cinematic vignette + film grain */}
      <div className="pointer-events-none absolute inset-0 z-[22] bg-[radial-gradient(ellipse_at_center,transparent_52%,rgba(0,0,0,0.55)_100%)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[22] opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      {/* Layer 4 — hero copy (bottom-left) */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: EASE }}
        className="absolute bottom-16 left-5 sm:bottom-20 sm:left-10 lg:left-16 z-30 max-w-md"
      >
        <div className="mb-4 text-[10px] uppercase tracking-[0.35em] text-gold-300/90">
          {HERO_TEXT.eyebrow}
        </div>
        <h1 className="font-display font-light leading-[0.92] tracking-tight text-white text-5xl sm:text-6xl lg:text-7xl">
          {HERO_TEXT.line1}
          <br />
          <span className="italic gold-text">{HERO_TEXT.line2}</span>
        </h1>
        <Link
          href={HERO_TEXT.ctaHref}
          className="group mt-7 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/[0.06] px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/60 hover:bg-white/[0.12]"
        >
          {HERO_TEXT.ctaLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>

      {/* Layer 5 — navigation + index (bottom-right) */}
      <div className="absolute bottom-16 right-5 sm:bottom-20 sm:right-10 z-30 flex items-center gap-4">
        <div className="font-display text-white/80 text-sm">
          {String(current + 1).padStart(2, "0")}
          <span className="text-white/35"> / {String(n).padStart(2, "0")}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:scale-105 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:scale-105 hover:bg-white/10"
          >
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

    </section>
  );
}
