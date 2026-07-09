"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Item = { src: string; category: string; title: string; span?: string };

const items: Item[] = [
  { src: "/portfolio-01.jpg", category: "Weddings", title: "Sacred Beginnings", span: "row-span-2" },
  { src: "/portfolio-02.jpg", category: "Couples", title: "Golden Hour" },
  { src: "/portfolio-03.jpg", category: "Traditional", title: "Timeless Grace" },
  { src: "/portfolio-04.jpg", category: "Weddings", title: "Temple Vows", span: "col-span-2" },
  { src: "/portfolio-05.jpg", category: "Couples", title: "Twilight Embrace" },
  { src: "/portfolio-06.jpg", category: "Weddings", title: "Together Forever" },
  { src: "/portfolio-07.jpg", category: "Engagements", title: "She Said Yes", span: "row-span-2" },
  { src: "/portfolio-09.jpg", category: "Traditional", title: "Heritage & Joy" },
  { src: "/portfolio-10.jpg", category: "Weddings", title: "Bride Sneha" },
  { src: "/portfolio-11.jpg", category: "Couples", title: "Sunset Romance" },
  { src: "/portfolio-12.jpg", category: "Family", title: "Eternal Bond" },
  { src: "/portfolio-13.jpg", category: "Weddings", title: "The First Kiss" },
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
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.18em] border transition-all ${
                  filter === c
                    ? "bg-gold-400 border-gold-400 text-ink-950"
                    : "border-black/10 text-ivory-100/70 hover:border-gold-400/60"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[240px] gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.button
                layout
                key={item.src + item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                onClick={() => setLightbox(i)}
                className={`relative overflow-hidden group rounded-sm ${item.span ?? ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent opacity-50 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-1">
                    {item.category}
                  </div>
                  <div className="font-display text-xl text-ivory-100">{item.title}</div>
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
