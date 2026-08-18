"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";

type Item = { src: string; category: string; title: string; span?: string; pos?: string };

const items: Item[] = [
  { src: "/portfolio-new-1.jpg", category: "Weddings", title: "Sacred Beginnings", span: "row-span-2" },
  { src: "/portfolio-new-2.jpg", category: "Couples", title: "Golden Hour" },
  { src: "/portfolio-new-3.jpg", category: "Traditional", title: "Timeless Grace" },
  { src: "/portfolio-new-7.jpg", category: "Engagements", title: "She Said Yes", span: "row-span-2" },
  { src: "/portfolio-new-5.jpg", category: "Couples", title: "Twilight Embrace" },
  { src: "/portfolio-new-6.jpg", category: "Weddings", title: "Together Forever" },
  { src: "/portfolio-new-4.jpg", category: "Weddings", title: "Temple Vows", span: "col-span-2", pos: "object-[center_8%]" },
  { src: "/portfolio-new-8.jpg", category: "Traditional", title: "Heritage & Joy" },
  { src: "/portfolio-new-9.jpg", category: "Family", title: "Eternal Bond" },
];

const categories = ["All", "Weddings", "Couples", "Engagements", "Family", "Traditional"];

export function Portfolio() {
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);

  return (
    <section id="portfolio" className="section-pad">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14"
        >
          <div className="max-w-xl">
            <div className="eyebrow mb-5">— Featured Work</div>
            <h2 className="h-display">
              A Selection of <span className="italic gold-text">Recent Stories</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <PortfolioPill
                key={c}
                label={c}
                active={filter === c}
                onClick={() => setFilter(c)}
              />
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[240px] gap-4 grid-flow-row-dense">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.button
                layout
                key={item.src + item.title}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setLightbox(i)}
                className={`group relative overflow-hidden rounded-2xl bg-ink-850 shadow-[0_14px_34px_-20px_rgba(0,0,0,0.4)] ring-1 ring-transparent transition-[box-shadow] duration-300 hover:shadow-[0_32px_60px_-26px_rgba(0,0,0,0.55)] hover:ring-gold-400/40 ${item.span ?? ""}`}
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08] ${item.pos ?? ""}`}
                />
                {/* Warm cinematic gradient — subtle at rest, richer on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#14100e]/85 via-[#14100e]/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

                {/* View indicator — reveals on hover */}
                <div className="absolute right-3 top-3 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" />
                </div>

                {/* Caption */}
                <div className="absolute inset-x-0 bottom-0 p-5 text-left">
                  <div className="mb-1.5 translate-y-1 text-[10px] uppercase tracking-[0.28em] text-gold-300 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {item.category}
                  </div>
                  <div className="font-display text-xl leading-tight text-white sm:text-2xl">
                    {item.title}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.22em] text-white/70 opacity-0 transition-opacity delay-75 duration-500 group-hover:opacity-100">
                    View Story <ArrowUpRight className="h-3 w-3" />
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-ink-950/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 h-12 w-12 rounded-full border border-black/20 flex items-center justify-center text-ivory-100 hover:bg-black/10"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((v) => (v! - 1 + filtered.length) % filtered.length);
              }}
              className="absolute left-6 h-12 w-12 rounded-full border border-black/20 flex items-center justify-center text-ivory-100 hover:bg-black/10"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((v) => (v! + 1) % filtered.length);
              }}
              className="absolute right-6 h-12 w-12 rounded-full border border-black/20 flex items-center justify-center text-ivory-100 hover:bg-black/10"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-5xl max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={filtered[lightbox].src}
                alt={filtered[lightbox].title}
                className="max-h-[85vh] w-auto object-contain rounded-sm"
              />
              <div className="mt-4 text-center">
                <div className="text-xs uppercase tracking-[0.25em] text-gold-600">
                  {filtered[lightbox].category}
                </div>
                <div className="font-display text-2xl">{filtered[lightbox].title}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function PortfolioPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative shrink-0 rounded-full border px-5 py-2 text-xs uppercase tracking-[0.18em] transition-all duration-300 hover:scale-105 ${
        active
          ? "border-transparent text-ink-950"
          : "border-black/10 text-ivory-100/70 hover:border-gold-400/60 hover:text-ivory-50"
      }`}
    >
      {/* Sliding active indicator — glides between pills on filter change */}
      {active && (
        <motion.span
          layoutId="portfolioActivePill"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 shadow-[0_8px_20px_-8px_rgba(194,161,75,0.6)]"
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );
}
