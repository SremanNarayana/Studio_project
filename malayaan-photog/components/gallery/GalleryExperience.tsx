"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import {
  Search,
  MapPin,
  ArrowUpRight,
  ArrowRight,
  Play,
  Star,
  ImageOff,
  Camera,
  Images,
} from "lucide-react";
import {
  GALLERY_CATEGORIES,
  GALLERY_BLUR,
  type GalleryItem,
} from "@/lib/gallery";
import { Lightbox } from "./Lightbox";

const PAGE_SIZE = 9;
const CATEGORY_PILLS = ["All", ...GALLERY_CATEGORIES] as const;

// Floating glass stat cards around the hero (desktop only).
const HERO_STATS = [
  { value: "1500+", label: "Weddings Captured", sub: "Since 2014", pos: "left-[4%] top-[24%]", float: -14 },
  { value: "stars", label: "Rated by Couples", sub: "5.0 average", pos: "right-[5%] top-[30%]", float: 16 },
  { value: "50+", label: "Destination Weddings", sub: "Across the globe", pos: "left-[7%] bottom-[22%]", float: 12 },
];

// Curated preview pills at the bottom of the hero → set the filter + scroll to grid.
const HERO_CATEGORIES: { label: string; value: string }[] = [
  { label: "Wedding", value: "Wedding Photography" },
  { label: "Pre Wedding", value: "Pre Wedding" },
  { label: "Engagement", value: "Engagement" },
  { label: "Portraits", value: "Couple Portraits" },
  { label: "Reception", value: "Reception" },
  { label: "Candid", value: "Candid Moments" },
  { label: "Traditional", value: "Traditional Ceremony" },
  { label: "Bridal", value: "Bridal Portfolio" },
];

// Soft film-grain / noise texture (inline, no asset request).
const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

const PARTICLES = [
  { left: "18%", top: "34%", d: 9, delay: 0 },
  { left: "72%", top: "26%", d: 12, delay: 1.4 },
  { left: "40%", top: "62%", d: 10, delay: 0.7 },
  { left: "84%", top: "58%", d: 13, delay: 2.1 },
  { left: "28%", top: "72%", d: 8, delay: 1.1 },
];

export function GalleryExperience({ items }: { items: GalleryItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [year, setYear] = useState("All");
  const [eventType, setEventType] = useState("All");

  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lightbox, setLightbox] = useState<{ list: GalleryItem[]; index: number } | null>(null);

  // Hero parallax — background drifts slower than content as you scroll away.
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "34%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const scrollToGrid = () => {
    document.getElementById("gallery-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const previewCategory = (value: string) => {
    setCategory(value);
    scrollToGrid();
  };

  // Distinct dropdown options derived from the data.
  const years = useMemo(
    () =>
      ["All", ...Array.from(new Set(items.map((i) => i.date.slice(0, 4)))).sort((a, b) => b.localeCompare(a))],
    [items]
  );
  const eventTypes = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.eventType))).sort()],
    [items]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = items.filter((i) => {
      if (category !== "All" && i.category !== category) return false;
      if (year !== "All" && i.date.slice(0, 4) !== year) return false;
      if (eventType !== "All" && i.eventType !== eventType) return false;
      if (q) {
        const hay = `${i.title} ${i.category} ${i.location} ${i.eventType} ${i.photographer} ${i.description ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    // Newest first (by event date).
    return [...list].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [items, query, category, year, eventType]);

  // Reset the infinite-scroll window whenever the result set changes.
  useEffect(() => setVisible(PAGE_SIZE), [query, category, year, eventType]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  // Infinite scroll — reveal the next page when the sentinel enters view.
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!hasMore) return;
    const el = sentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !loadingMore) {
          setLoadingMore(true);
          // Brief delay so the loading skeletons are perceptible.
          window.setTimeout(() => {
            setVisible((v) => v + PAGE_SIZE);
            setLoadingMore(false);
          }, 550);
        }
      },
      { rootMargin: "400px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loadingMore, visible]);

  return (
    <>
      {/* ---------------------------------------------------------------- HERO */}
      <section
        ref={heroRef}
        className="relative min-h-screen w-full overflow-hidden bg-[#14100e]"
      >
        {/* Cinematic background — mount scale (105→100%) + scroll parallax */}
        <motion.div style={{ y: bgY }} className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src="/portfolio-04.jpg"
              alt="Malayaan Photography — cinematic wedding gallery"
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              blurDataURL={GALLERY_BLUR}
              className="object-cover"
            />
          </motion.div>
          {/* Rich warm charcoal gradient — cinematic, never washed out */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#181310]/70 via-[#181310]/40 to-[#100c0a]/95" />
          {/* Vignette + gold glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(16,12,10,0.72)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(200,169,106,0.14),transparent_55%)]" />
          {/* Film grain */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
            style={{ backgroundImage: NOISE_BG }}
          />
        </motion.div>

        {/* Gold gradient blobs */}
        <motion.div
          aria-hidden
          animate={{ y: [0, -24, 0], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -top-10 left-[10%] h-72 w-72 rounded-full bg-[#c8a96a]/25 blur-[120px]"
        />
        <motion.div
          aria-hidden
          animate={{ y: [0, 26, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute bottom-[-5rem] right-[8%] h-80 w-80 rounded-full bg-[#c8a96a]/15 blur-[130px]"
        />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            aria-hidden
            animate={{ y: [0, -18, 0], opacity: [0.15, 0.55, 0.15] }}
            transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
            style={{ left: p.left, top: p.top }}
            className="pointer-events-none absolute h-1 w-1 rounded-full bg-[#c8a96a]/70 shadow-[0_0_8px_2px_rgba(200,169,106,0.5)]"
          />
        ))}

        {/* Floating glass stat cards — desktop only */}
        {HERO_STATS.map((s, i) => (
          <motion.div
            key={s.label}
            aria-hidden
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [20, s.float, 20] }}
            transition={{
              opacity: { duration: 1, delay: 1 + i * 0.2 },
              y: { duration: 7 + i, repeat: Infinity, ease: "easeInOut", delay: 1 + i * 0.2 },
            }}
            className={`pointer-events-none absolute z-10 hidden lg:block ${s.pos}`}
          >
            <div className="rounded-2xl border border-white/15 bg-white/[0.07] px-6 py-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md">
              {s.value === "stars" ? (
                <div className="flex gap-0.5 text-[#c8a96a]">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              ) : (
                <div className="font-display text-3xl text-white">{s.value}</div>
              )}
              <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/80">{s.label}</div>
              <div className="text-[10px] text-white/50">{s.sub}</div>
            </div>
          </motion.div>
        ))}

        {/* Content column */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-20 flex min-h-screen flex-col px-6"
        >
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            aria-label="Breadcrumb"
            className="pt-28 sm:pt-32"
          >
            <ol className="flex items-center justify-center gap-2.5 text-[10px] uppercase tracking-[0.3em] text-white/45">
              <li>
                <Link href="/" className="transition-colors hover:text-[#c8a96a]">Home</Link>
              </li>
              <li className="text-[#c8a96a]/60">/</li>
              <li>
                <Link href="/#portfolio" className="transition-colors hover:text-[#c8a96a]">Portfolio</Link>
              </li>
              <li className="text-[#c8a96a]/60">/</li>
              <li className="text-white/80" aria-current="page">Gallery</li>
            </ol>
          </motion.nav>

          {/* Centered hero copy */}
          <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-4"
            >
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#c8a96a]/70 sm:w-10" />
              <span className="text-[10px] uppercase tracking-[0.45em] text-[#c8a96a] sm:text-[11px] sm:tracking-[0.5em]">
                Our Curated Collection
              </span>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#c8a96a]/70 sm:w-10" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-display text-6xl font-light leading-[0.9] tracking-tight text-white sm:text-8xl lg:text-[9.5rem]"
            >
              Gallery
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 max-w-[650px] text-base font-light leading-relaxed text-white/80 sm:text-lg"
            >
              Every frame preserves an emotion, every collection tells a timeless story.
              Explore handcrafted wedding photography captured with elegance, authenticity
              and cinematic artistry.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
            >
              <button
                onClick={scrollToGrid}
                className="group inline-flex items-center gap-2.5 rounded-full border border-[#c8a96a]/60 bg-gradient-to-r from-[#c8a96a] to-[#b8955a] px-8 py-4 text-xs uppercase tracking-[0.2em] text-[#14100e] shadow-[0_16px_40px_-16px_rgba(200,169,106,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-16px_rgba(200,169,106,0.9)]"
              >
                Explore Collections
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <a
                href="/#process"
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/[0.06] px-8 py-4 text-xs uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c8a96a]/60 hover:bg-white/[0.12]"
              >
                <Play className="h-4 w-4 fill-current" />
                Watch Our Films
              </a>
            </motion.div>
          </div>

          {/* Bottom — category preview pills + scroll indicator */}
          <div className="pb-7">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.1 }}
              className="mx-auto mb-6 flex justify-start gap-2.5 overflow-x-auto px-1 no-scrollbar sm:flex-wrap sm:justify-center"
            >
              {HERO_CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => previewCategory(c.value)}
                  className="shrink-0 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[11px] uppercase tracking-[0.15em] text-white/80 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[#c8a96a]/60 hover:text-white hover:shadow-[0_0_22px_-4px_rgba(200,169,106,0.6)]"
                >
                  {c.label}
                </button>
              ))}
            </motion.div>

            <motion.button
              onClick={scrollToGrid}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto flex flex-col items-center gap-2 text-white/70"
              aria-label="Scroll to explore"
            >
              <span className="text-[9px] uppercase tracking-[0.35em]">Scroll to Explore</span>
              <span className="relative block h-10 w-px overflow-hidden bg-white/20">
                <motion.span
                  animate={{ y: [-8, 40] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[#c8a96a]"
                />
              </span>
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* -------------------------------------------------- STICKY CATEGORY NAV */}
      <div className="sticky top-16 sm:top-20 z-40 bg-white/85 backdrop-blur-xl border-y border-black/[0.06]">
        <div className="container-x px-4 sm:px-6">
          <div
            className="flex gap-2 overflow-x-auto py-3.5 no-scrollbar"
            role="tablist"
            aria-label="Filter gallery by category"
          >
            {CATEGORY_PILLS.map((c) => (
              <FilterPill
                key={c}
                label={c}
                active={category === c}
                onClick={() => setCategory(c)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ SEARCH + ADV. FILTERS */}
      <section className="section-pad !py-12 sm:!py-16">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="eyebrow mb-4">— Browse the Collection</div>
            <h2 className="font-display text-3xl sm:text-4xl text-ivory-50">
              A collection of <span className="italic gold-text">timeless moments</span>
            </h2>
            <p className="mt-4 text-ivory-200 font-light">
              A collection of timeless moments, emotions and unforgettable memories
              captured through our lens.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-ivory-200" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search images... (bride, groom, location, category, event)"
                aria-label="Search gallery"
                className="w-full rounded-full border border-black/10 bg-white pl-12 pr-5 py-3.5 text-sm text-ivory-50 placeholder:text-ivory-200/70 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.25)] focus:outline-none focus:border-gold-400 transition-colors"
              />
            </div>
          </div>

          {/* Advanced filters */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <FilterSelect label="Event" value={eventType} onChange={setEventType} options={eventTypes} />
            <FilterSelect label="Year" value={year} onChange={setYear} options={years} />
          </div>

          <p className="text-center text-xs text-ivory-200 mt-6" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "album" : "albums"}
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------- MASONRY GRID */}
      <section id="gallery-grid" className="section-pad !pt-0" aria-label="Gallery">
        <div className="container-x">
          {shown.length === 0 ? (
            <EmptyState
              onReset={() => {
                setQuery("");
                setCategory("All");
                setYear("All");
                setEventType("All");
              }}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {shown.map((item, i) => (
                  <GalleryCard
                    key={item.id}
                    item={item}
                    index={i}
                    onOpen={() => setLightbox({ list: filtered, index: i })}
                  />
                ))}
                {loadingMore &&
                  Array.from({ length: 4 }).map((_, i) => <Skeleton key={`sk-${i}`} />)}
              </div>
              {hasMore && <div ref={sentinel} className="h-10" aria-hidden />}
            </>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------- STATS */}
      <StatsSection />

      {/* --------------------------------------------------------- FOOTER CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#faf7f1] via-white to-[#f3efe5]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(194,161,75,0.10),transparent_60%)]" />
        <div className="relative container-x px-6 py-24 sm:py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ivory-50 leading-tight">
              Ready to Create <span className="italic gold-text">Beautiful Memories?</span>
            </h2>
            <p className="mt-5 text-ivory-200 font-light max-w-xl mx-auto">
              Let us tell your story with the same care you see in every frame above.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link href="/book-now" className="btn-primary">
                <Camera className="h-4 w-4" /> Book Your Shoot
              </Link>
              <a
                href="https://wa.me/917708113657"
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Lightbox
        items={lightbox?.list ?? []}
        index={lightbox?.index ?? null}
        onClose={() => setLightbox(null)}
        onIndex={(i) => setLightbox((lb) => (lb ? { ...lb, index: i } : lb))}
      />
    </>
  );
}

/* ------------------------------------------------------------ filter pill */

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 300, damping: 20, mass: 0.4 });
  const y = useSpring(my, { stiffness: 300, damping: 20, mass: 0.4 });

  // Magnetic hover — nudge the pill gently toward the cursor, spring back on leave.
  function handleMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 14);
    my.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 8);
  }
  function reset() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.button
      ref={ref}
      role="tab"
      aria-selected={active}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x, y }}
      className={`relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs tracking-[0.08em] transition-colors duration-300 ${
        active ? "text-white" : "text-ivory-200 hover:bg-black/[0.04] hover:text-ivory-50"
      }`}
    >
      {/* Sliding active indicator — a shared layout element that glides between pills */}
      {active && (
        <motion.span
          layoutId="galleryActivePill"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 shadow-[0_8px_20px_-8px_rgba(194,161,75,0.6)]"
        />
      )}
      <span className="relative z-10">{label}</span>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ cards */

function GalleryCard({
  item,
  onOpen,
  index,
}: {
  item: GalleryItem;
  onOpen: () => void;
  index: number;
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: (index % 5) * 0.05 }}
      whileHover={{ y: -6 }}
      className="group relative block w-full cursor-pointer overflow-hidden rounded-[16px] bg-white text-left shadow-[0_10px_28px_-16px_rgba(0,0,0,0.3)] ring-1 ring-transparent transition-[box-shadow] duration-300 hover:shadow-[0_28px_55px_-22px_rgba(0,0,0,0.5)] hover:ring-gold-300/40"
      aria-label={`View album ${item.title}, ${item.category} in ${item.location}, ${item.photoCount} photos`}
    >
      {/* Fixed 3:4 portrait tile — every card is identical for a perfectly aligned grid */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-ink-850">
        <Image
          src={item.coverImage}
          alt={`${item.title} — ${item.category} in ${item.location}`}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
          placeholder="blur"
          blurDataURL={GALLERY_BLUR}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
        />

        {/* Photo count — always visible */}
        <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-ink-950/45 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
          <Images className="h-3 w-3" /> {item.photoCount}
        </div>

        {/* Resting state — subtle gradient + couple name (legible at rest & on touch) */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink-950/75 via-ink-950/10 to-transparent transition-opacity duration-300 group-hover:opacity-0" />
        <div className="absolute inset-x-0 bottom-0 p-3 transition-opacity duration-300 group-hover:opacity-0">
          <div className="truncate font-display text-base leading-tight text-white sm:text-lg">
            {item.title}
          </div>
        </div>

        {/* Hover overlay — premium dark gradient fade with full album detail + CTA */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-gradient-to-t from-ink-950/90 via-ink-950/60 to-ink-950/40 p-4 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="text-[10px] uppercase tracking-[0.28em] text-gold-300">
            {item.category}
          </div>
          <div className="font-display text-lg leading-tight text-white sm:text-2xl">
            {item.title}
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] text-white/70">
            <MapPin className="h-3 w-3" /> {item.location}
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] text-white/60">
            <Images className="h-3 w-3" /> {item.photoCount} Photos
          </div>
          <span className="mt-2.5 inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-white group-hover:text-ink-950">
            <Camera className="h-3 w-3" /> View Album
            <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function Skeleton() {
  return (
    <div className="overflow-hidden rounded-[16px] shadow-[0_10px_28px_-16px_rgba(0,0,0,0.2)]">
      <div className="aspect-[3/4] w-full animate-pulse bg-gradient-to-br from-ink-850 to-ink-800" />
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-24"
    >
      <div className="h-20 w-20 rounded-full bg-ink-850 border border-black/[0.06] flex items-center justify-center mb-6">
        <ImageOff className="h-8 w-8 text-gold-500" strokeWidth={1.4} />
      </div>
      <h3 className="font-display text-3xl text-ivory-50 mb-2">No photos found.</h3>
      <p className="text-ivory-200 font-light mb-7 max-w-sm">
        We couldn&rsquo;t find any albums matching your search. Try another category
        or clear the filters.
      </p>
      <button onClick={onReset} className="btn-ghost">
        Clear filters
      </button>
    </motion.div>
  );
}

/* --------------------------------------------------------------- controls */

function FilterSelect({
  label,
  value,
  onChange,
  options,
  labels,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  labels?: Record<string, string>;
}) {
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="appearance-none cursor-pointer rounded-full border border-black/10 bg-white pl-4 pr-9 py-2.5 text-xs uppercase tracking-[0.12em] text-ivory-50 shadow-sm hover:border-gold-400/60 focus:outline-none focus:border-gold-400 transition-colors"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23a4863a' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          backgroundSize: "11px",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {label}: {labels?.[o] ?? o}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ------------------------------------------------------------------ stats */

const STATS = [
  { to: 1500, suffix: "+", label: "Happy Clients" },
  { to: 10000, suffix: "+", label: "Photos Delivered" },
  { to: 500, suffix: "+", label: "Weddings" },
  { to: 12, suffix: "+", label: "Years Experience" },
];

function StatsSection() {
  return (
    <section className="section-pad !py-16 bg-ink-900/40 border-y border-black/[0.05]" aria-label="Studio statistics">
      <div className="container-x grid grid-cols-2 lg:grid-cols-4 gap-8">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="text-center"
          >
            <div className="font-display text-4xl sm:text-5xl lg:text-6xl gold-text leading-none">
              <CountUp to={s.to} suffix={s.suffix} />
            </div>
            <div className="mt-3 text-[11px] sm:text-xs uppercase tracking-[0.25em] text-ivory-200">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const dur = 1900;
          const start = performance.now();
          const step = (t: number) => {
            const p = Math.min((t - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setN(Math.round(to * ease));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      {n.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
