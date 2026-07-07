"use client";

import { motion } from "framer-motion";
import { Check, Heart, Sparkles, Crown, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

type Pkg = {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  name: string;
  tagline: string;
  occasions: string;
  price: string;
  unit: string;
  features: string[];
  featured?: boolean;
};

const packages: Pkg[] = [
  {
    icon: Sparkles,
    name: "Occasions",
    tagline: "Functions & celebrations",
    occasions: "House Warming · Birthdays · Traditional Events",
    price: "₹15,000",
    unit: "starting",
    features: [
      "Up to 4 hours coverage",
      "One lead photographer",
      "150+ edited photos",
      "Online gallery delivery",
      "48-hour sneak peek",
    ],
  },
  {
    icon: Heart,
    name: "Wedding",
    tagline: "The full celebration",
    occasions: "Wedding · Reception · Pre-Wedding",
    price: "₹49,000",
    unit: "starting",
    featured: true,
    features: [
      "Full-day dual-photographer coverage",
      "600+ master-edited photos",
      "Cinematic highlight reel (3–5 min)",
      "Premium 30-page heirloom album",
      "Pre-wedding shoot included",
      "Private online gallery",
    ],
  },
  {
    icon: Crown,
    name: "Cinematic",
    tagline: "The signature experience",
    occasions: "Luxury Wedding · Films · Albums",
    price: "₹95,000",
    unit: "starting",
    features: [
      "Multi-day team coverage",
      "1000+ photos + full RAW vault",
      "Feature wedding film (15–20 min)",
      "Italian linen designer album",
      "Drone & candid cinematography",
      "Dedicated creative director",
    ],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Packages() {
  return (
    <section id="packages" className="relative section-pad bg-white overflow-hidden">
      {/* Ambient backdrops */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(194,161,75,0.07),transparent_55%)]" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-azure-200/30 blur-3xl" />
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gold-400/5 blur-3xl" />

      <div className="container-x relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-azure-500 font-medium mb-6">
            Collections & Investment
          </div>
          <h2 className="font-display font-light text-4xl sm:text-5xl md:text-[3.25rem] leading-[1.1] tracking-tight text-ivory-50">
            Crafted for every{" "}
            <span className="italic gold-text">celebration.</span>
          </h2>
          <p className="mt-5 text-ivory-200 font-light">
            Transparent collections, tailored to your story. Every package can be customised — these are the starting points.
          </p>
        </motion.div>

        {/* Package cards */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {packages.map((p, i) => (
            <motion.div
              key={p.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{ y: -10 }}
              className={`group relative flex flex-col rounded-sm p-8 sm:p-10 transition-shadow duration-500 ${
                p.featured
                  ? "bg-[#0e0d12] text-white shadow-[0_30px_70px_-25px_rgba(124,103,46,0.55)] lg:-mt-4 lg:mb-4"
                  : "bg-white border border-black/[0.08] shadow-[0_18px_50px_-25px_rgba(0,0,0,0.18)] hover:shadow-[0_28px_70px_-25px_rgba(0,0,0,0.25)]"
              }`}
            >
              {/* Featured gold gradient border */}
              {p.featured && (
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-sm p-px bg-gradient-to-b from-gold-300/70 via-gold-400/20 to-transparent [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] pointer-events-none"
                />
              )}

              {/* Popular badge */}
              {p.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-300 text-ink-950 text-[10px] uppercase tracking-[0.25em] font-semibold shadow-lg">
                  <Star className="h-3 w-3 fill-ink-950" /> Most Loved
                </div>
              )}

              {/* Icon */}
              <div
                className={`h-14 w-14 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${
                  p.featured
                    ? "bg-gold-400/15 border border-gold-400/40 text-gold-300 group-hover:bg-gold-400 group-hover:text-ink-950"
                    : "bg-azure-50 border border-azure-200 text-azure-500 group-hover:bg-azure-500 group-hover:text-white"
                }`}
              >
                <p.icon className="h-6 w-6" strokeWidth={1.5} />
              </div>

              {/* Name + tagline */}
              <h3 className="font-display text-3xl mb-1 leading-tight">{p.name}</h3>
              <p className={`text-sm mb-1 ${p.featured ? "text-white/60" : "text-ivory-200"}`}>
                {p.tagline}
              </p>
              <p
                className={`text-[10px] uppercase tracking-[0.18em] mb-7 ${
                  p.featured ? "text-gold-300/80" : "text-azure-600"
                }`}
              >
                {p.occasions}
              </p>

              {/* Price */}
              <div className="mb-7">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`font-display text-5xl leading-none ${
                      p.featured ? "gold-text" : "text-ivory-50"
                    }`}
                  >
                    {p.price}
                  </span>
                  <span
                    className={`text-[10px] uppercase tracking-[0.22em] ${
                      p.featured ? "text-white/50" : "text-ivory-200"
                    }`}
                  >
                    {p.unit}
                  </span>
                </div>
                <div
                  className={`mt-4 h-px w-full ${
                    p.featured
                      ? "bg-gradient-to-r from-gold-400/50 to-transparent"
                      : "bg-gradient-to-r from-azure-300 to-transparent"
                  }`}
                />
              </div>

              {/* Features */}
              <ul className="space-y-3.5 mb-9 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span
                      className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        p.featured
                          ? "bg-gold-400/20 text-gold-300"
                          : "bg-gold-400/15 text-gold-600"
                      }`}
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span
                      className={`text-sm leading-snug ${
                        p.featured ? "text-white/85" : "text-ivory-100"
                      }`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/track"
                className={`group/btn inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full text-sm font-medium tracking-[0.15em] uppercase transition-all duration-300 ${
                  p.featured
                    ? "bg-gradient-to-r from-gold-500 to-gold-300 text-ink-950 hover:shadow-[0_12px_30px_-8px_rgba(214,185,119,0.7)]"
                    : "border border-black/15 text-ivory-50 hover:border-gold-500 hover:bg-gold-400/5"
                }`}
              >
                Track Project
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
