"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const reviews = [
  {
    text: "Great work, awesome photos thank you very much. The team made our wedding feel effortless and the final album is beyond what we imagined.",
    name: "Priya & Arjun",
    role: "Wedding · Madurai",
  },
  {
    text: "Awesome photos and album, great work. Every frame tells our story exactly how we lived it. Highly recommend Malayaan Photography.",
    name: "Lakshmi R.",
    role: "Family Portrait",
  },
  {
    text: "Your work truly speaks for itself, showcasing your talent and creativity. We will never forget the way you captured our pre-wedding shoot.",
    name: "Divya & Suresh",
    role: "Pre-Wedding",
  },
  {
    text: "From the first call to the final delivery — pure professionalism. The cinematic film of our reception still gives us goosebumps.",
    name: "Anitha K.",
    role: "Wedding Film",
  },
  {
    text: "They captured my baby's first month with so much love and patience. The album is now our most treasured family heirloom.",
    name: "Meena V.",
    role: "Baby Shoot",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % reviews.length), 6500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="section-pad relative">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="eyebrow mb-5">— Kind Words</div>
          <h2 className="h-display">
            From Our <span className="italic gold-text">Clients</span>
          </h2>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <Quote className="absolute -top-8 left-0 h-32 w-32 text-gold-600/10" strokeWidth={1} />

          <div className="relative min-h-[280px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="text-center w-full"
              >
                <div className="flex justify-center gap-1 mb-8">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-gold-400 text-gold-600" />
                  ))}
                </div>
                <p className="font-display text-2xl sm:text-3xl lg:text-4xl italic leading-relaxed text-ivory-100/90 font-light">
                  &ldquo;{reviews[i].text}&rdquo;
                </p>
                <div className="mt-10 flex flex-col items-center gap-1">
                  <div className="h-px w-12 bg-azure-400 mb-3" />
                  <div className="font-display text-lg">{reviews[i].name}</div>
                  <div className="text-xs uppercase tracking-[0.25em] text-ivory-100/40">
                    {reviews[i].role}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-3 mt-12">
            <button
              onClick={() => setI((p) => (p - 1 + reviews.length) % reviews.length)}
              className="h-11 w-11 rounded-full border border-black/15 flex items-center justify-center hover:border-gold-400 hover:text-gold-600 transition"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 px-2">
              {reviews.map((_, k) => (
                <button
                  key={k}
                  onClick={() => setI(k)}
                  className={`h-1.5 rounded-full transition-all ${
                    k === i ? "w-8 bg-gold-400" : "w-1.5 bg-black/20"
                  }`}
                  aria-label={`Slide ${k + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setI((p) => (p + 1) % reviews.length)}
              className="h-11 w-11 rounded-full border border-black/15 flex items-center justify-center hover:border-gold-400 hover:text-gold-600 transition"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
