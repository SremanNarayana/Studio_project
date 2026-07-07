"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageCircle } from "lucide-react";
import { useState } from "react";
import { FAQS } from "@/lib/seo";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative section-pad bg-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(94,155,200,0.07),transparent_55%)]" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-gold-400/5 blur-3xl" />

      <div className="container-x relative grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left — heading + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-5 lg:sticky lg:top-40"
        >
          <div className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-azure-500 font-medium mb-6">
            Questions & Answers
          </div>
          <h2 className="font-display font-light text-4xl sm:text-5xl leading-[1.1] tracking-tight text-ivory-50 mb-6">
            Everything you{" "}
            <span className="italic gold-text">need to know.</span>
          </h2>
          <p className="text-ivory-200 font-light leading-relaxed mb-8 max-w-md">
            From pricing and booking to travel across Tamil Nadu and delivery
            timelines — here are the answers couples ask us most.
          </p>

          <div className="p-6 rounded-sm bg-ink-900 border border-black/[0.08]">
            <div className="text-sm text-ivory-100 mb-4">
              Still have a question? We&rsquo;d love to help.
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/917708113657"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-emerald-500/40 text-emerald-700 text-sm uppercase tracking-[0.15em] hover:bg-emerald-500/10 transition"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right — accordion */}
        <div className="lg:col-span-7 divide-y divide-black/[0.08] border-t border-black/[0.08]">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-5 py-6 text-left group"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-display text-xl sm:text-2xl leading-snug transition-colors ${
                      isOpen ? "text-gold-600" : "text-ivory-50 group-hover:text-gold-600"
                    }`}
                  >
                    {f.q}
                  </span>
                  <span
                    className={`mt-1 h-8 w-8 shrink-0 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "bg-gold-400 border-gold-400 text-ink-950 rotate-45"
                        : "border-black/15 text-ivory-100 group-hover:border-gold-400 group-hover:text-gold-600"
                    }`}
                  >
                    <Plus className="h-4 w-4" strokeWidth={2} />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-12 text-ivory-200 font-light leading-relaxed">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
