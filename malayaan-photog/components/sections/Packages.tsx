"use client";

import { motion } from "framer-motion";
import {
  Check,
  Crown,
  ArrowRight,
  Sparkles,
  Gift,
  Camera,
  Video,
  Images,
  PenTool,
  Package,
  CreditCard,
  Plane,
  Aperture,
} from "lucide-react";
import Link from "next/link";

/* ---------------------------------------------------------------- data */

type FeatureGroup = { label: string; items: string[]; free?: boolean };
type WeddingPkg = {
  name: string;
  desc: string;
  price: string;
  groups: FeatureGroup[];
  offer: string;
  recommended?: boolean;
};

const weddingPackages: WeddingPkg[] = [
  {
    name: "Classic",
    desc: "Timeless traditional coverage for an intimate celebration.",
    price: "₹35,000",
    groups: [
      {
        label: "Traditional Coverage",
        items: ["Professional Photographer — 1", "Professional Videographer — 1"],
      },
      {
        label: "Album & Outputs",
        items: [
          "12×36 Premium Album — 40 Sheets",
          "Full HD Wedding Film",
          "Premium Pendrive — 1",
          "Frame 12×18 — 1",
        ],
      },
      {
        label: "Add-ons",
        items: ["Calendar — 1", "All Frame Sizes Available — 50% OFF"],
      },
    ],
    offer: "Pre-Wedding or Post-Wedding — Included",
  },
  {
    name: "Signature",
    desc: "Traditional coverage elevated with candid storytelling.",
    price: "₹59,999",
    groups: [
      {
        label: "Traditional Coverage",
        items: ["Professional Photographer — 1", "Professional Videographer — 1"],
      },
      { label: "Candid Coverage", items: ["Candid Photographer — 1"] },
      {
        label: "Album & Outputs",
        items: [
          "12×36 Premium Album — 60+ Sheets + Box",
          "Full HD Wedding Film",
          "Premium Pendrive — 1",
          "Wedding Reel — 1",
          "Softcopy Photos",
        ],
      },
      {
        label: "Add-ons",
        items: ["20×16 Premium Frames — 2", "All Frame Sizes Available — 50% OFF"],
      },
    ],
    offer: "Pre & Post Wedding — Included",
  },
  {
    name: "Royal",
    desc: "Cinematic artistry with drone, candid & aerial coverage.",
    price: "₹99,999",
    groups: [
      {
        label: "Traditional Coverage",
        items: ["Professional Photographer — 1", "Professional Videographer — 1"],
      },
      {
        label: "Candid & Cinematic Coverage",
        items: [
          "Candid Photographer — 1",
          "Cinematic Videographer — 1",
          "Drone Aerial Coverage — 1",
        ],
      },
      { label: "Free Inclusion", items: ["Outdoor Album — 20 Pages"], free: true },
      {
        label: "Album & Outputs",
        items: [
          "12×36 Premium Album — 65+ Sheets + Box",
          "4K Wedding Film",
          "Premium Pendrive — 1",
          "Wedding Reels — 2",
          "Softcopy Photos",
        ],
      },
      {
        label: "Premium Add-ons",
        items: [
          "20×30 Premium Frames — 2",
          "All Frame Sizes Available — 50% OFF",
          "Same-Day Candid Highlights — 10–15 Images",
        ],
      },
    ],
    offer: "Pre & Post Wedding — Included",
  },
  {
    name: "Elite",
    desc: "Our flagship — the complete luxury wedding experience.",
    price: "₹1,49,999",
    recommended: true,
    groups: [
      {
        label: "Traditional Coverage",
        items: ["Professional Photographer — 1", "Professional Videographer — 1"],
      },
      {
        label: "Candid & Cinematic Coverage",
        items: [
          "Candid Photographer — 1",
          "Cinematic Videographer — 1",
          "Drone Aerial Coverage — 1",
        ],
      },
      { label: "Free Inclusion", items: ["Outdoor Album — 30 Pages"], free: true },
      {
        label: "Album & Outputs",
        items: [
          "12×36 Royal Album — 80+ Luxury Pages + Box",
          "4K Wedding Film",
          "Highlight Teaser — 1–2 Minutes",
          "Premium Pendrive — 1",
          "Softcopy Photos",
        ],
      },
      {
        label: "Premium Add-ons",
        items: [
          "20×30 Premium Frames — 2",
          "All Frame Sizes Available — 50% OFF",
          "Same-Day Candid Highlights — 10–15 Images",
        ],
      },
      {
        label: "Additional Inclusions",
        items: ["Wedding Reels — 3 to 5", "Cinematic Outdoor Song", "LED Screen — 10×8"],
      },
    ],
    offer: "Pre & Post Wedding — Included",
  },
];

const smallEvents = [
  {
    title: "Baby Shower / Seemantham",
    price: "₹12,000 – ₹15,000",
    items: [
      "Traditional Photography",
      "Candid Moments Coverage",
      "Softcopy Photos",
      "12×18 Frame — 1",
    ],
  },
  {
    title: "Ear Piercing Ceremony",
    price: "₹12,000 – ₹15,000",
    items: ["Full Ritual Coverage", "Baby Portraits + Family Photos", "4–5 Hours Coverage"],
  },
  {
    title: "Puberty Function",
    price: "₹10,000",
    items: ["Traditional Photography", "Stage & Ritual Coverage", "3 Hours Coverage"],
  },
];

const addOnGroups: {
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  items: { name: string; price: string }[];
}[] = [
  {
    label: "Cinematic Upgrades",
    icon: Video,
    items: [
      { name: "Drone Aerial Coverage", price: "₹15,000" },
      { name: "Candid Video", price: "₹25,000" },
      { name: "Candid Photography", price: "₹20,000" },
    ],
  },
  {
    label: "Traditional Coverage",
    icon: Camera,
    items: [
      { name: "Traditional Photography", price: "₹8,000" },
      { name: "Traditional Video", price: "₹8,000" },
      { name: "LED Screen / Live Display", price: "₹20,000" },
    ],
  },
];

const addOnBenefits = [
  "Enhances wedding film and album quality",
  "Covers every angle with dedicated artists",
  "Turns normal moments into cinematic memories",
  "Perfect for premium weddings and grand events",
];

const deliverySteps: {
  title: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  items: string[];
}[] = [
  {
    title: "Photo Selection",
    icon: Images,
    items: [
      "Select album photos via an online selection link",
      "Selection window: 7 days only",
      "Delayed selection will affect album delivery timelines",
    ],
  },
  {
    title: "Album Design & Approval",
    icon: PenTool,
    items: [
      "Album design ready within 5–7 days after photo selection",
      "Design preview shared for your approval",
      "Unlimited minor changes allowed",
      "1 major revision allowed",
      "After approval, the album proceeds for printing",
    ],
  },
  {
    title: "Final Deliverables",
    icon: Package,
    items: [
      "Printed Album — 7 days",
      "Cinematic Video — 20–30 days",
      "Traditional Video — 10–15 days",
      "All outputs via a Premium Pendrive",
    ],
  },
];

const paymentSteps = [
  { pct: "20%", label: "Advance", note: "Date Blocking" },
  { pct: "40%", label: "Event Day", note: "Before / After Coverage" },
  { pct: "40%", label: "Final Payment", note: "Before Deliverables" },
];

// Hero decoration — drifting gold specks + a soft film-grain texture.
const HERO_PARTICLES = [
  { left: "16%", top: "30%", d: 9, delay: 0 },
  { left: "78%", top: "24%", d: 12, delay: 1.2 },
  { left: "34%", top: "68%", d: 10, delay: 0.6 },
  { left: "86%", top: "58%", d: 13, delay: 2 },
  { left: "24%", top: "48%", d: 8, delay: 1.6 },
  { left: "64%", top: "72%", d: 11, delay: 0.9 },
];

const HERO_NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/* --------------------------------------------------------------- helpers */

function SectionHeading({
  eyebrow,
  title,
  accent,
  sub,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  sub?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center max-w-2xl mx-auto mb-14"
    >
      <div className="inline-flex items-center gap-3 mb-5">
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold-400/70" />
        <span className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-azure-500 font-medium">
          {eyebrow}
        </span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold-400/70" />
      </div>
      <h2 className="font-display font-light text-3xl sm:text-4xl md:text-[2.75rem] leading-[1.1] tracking-tight text-ivory-50">
        {title} <span className="italic gold-text">{accent}</span>
      </h2>
      {sub && <p className="mt-5 text-ivory-200 font-light leading-relaxed">{sub}</p>}
    </motion.div>
  );
}

/* ---------------------------------------------------------------- section */

export function Packages() {
  return (
    <>
      {/* ============================================= HERO */}
      <section className="relative h-[62vh] min-h-[430px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#faf7f1] via-white to-[#f6f1e6]">
        {/* On-brand aperture motif — barely-there, slowly rotating */}
        <motion.div
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ duration: 140, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gold-400/[0.08]"
        >
          <Aperture className="h-[34rem] w-[34rem] sm:h-[40rem] sm:w-[40rem]" strokeWidth={0.4} />
        </motion.div>

        {/* Soft floating gradient blobs */}
        <motion.div
          aria-hidden
          animate={{ y: [0, -26, 0], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -top-12 left-[12%] h-72 w-72 rounded-full bg-gold-400/25 blur-[110px]"
        />
        <motion.div
          aria-hidden
          animate={{ y: [0, 24, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute bottom-[-4rem] right-[10%] h-80 w-80 rounded-full bg-azure-300/20 blur-[120px]"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(200,169,106,0.12),transparent_55%)]" />

        {/* Fine grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-multiply"
          style={{ backgroundImage: HERO_NOISE }}
        />

        {/* Drifting gold particles */}
        {HERO_PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            aria-hidden
            animate={{ y: [0, -16, 0], opacity: [0.15, 0.6, 0.15] }}
            transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
            style={{ left: p.left, top: p.top }}
            className="pointer-events-none absolute h-1 w-1 rounded-full bg-gold-500/70 shadow-[0_0_8px_2px_rgba(194,161,75,0.4)]"
          />
        ))}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center px-6 max-w-2xl"
        >
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold-400/70" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.45em] text-gold-600 font-medium">
              Collections &amp; Investment
            </span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold-400/70" />
          </div>
          <h1 className="font-display font-light text-5xl sm:text-6xl lg:text-[5rem] leading-[1.0] tracking-tight text-ivory-50">
            Wedding <span className="italic gold-text">Packages</span>
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-base sm:text-lg font-light leading-relaxed text-ivory-200">
            Transparent collections crafted for your celebration — every package can be
            tailored to your story.
          </p>
        </motion.div>

        {/* Seamless blend into the white section below */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* ============================================= WEDDING PACKAGES */}
      <section id="packages" className="relative section-pad !pt-16 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(194,161,75,0.07),transparent_55%)]" />
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gold-400/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -left-32 h-96 w-96 rounded-full bg-azure-200/25 blur-3xl" />
        <div className="container-x relative">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 pt-3 items-start">
            {weddingPackages.map((p, i) => (
              <WeddingCard key={p.name} pkg={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================= SMALL EVENTS */}
      <section className="relative section-pad !py-16 bg-ink-900/40 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(94,155,200,0.08),transparent_55%)]" />
        <div className="container-x relative">
          <SectionHeading
            eyebrow="Beyond the Wedding"
            title="Small Events"
            accent="Premium Packages"
            sub="Thoughtful coverage for the smaller milestones that matter just as much."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {smallEvents.map((e, i) => (
              <motion.div
                key={e.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -6 }}
                className="group flex flex-col rounded-2xl bg-white border border-black/[0.08] p-7 shadow-[0_16px_44px_-24px_rgba(0,0,0,0.16)] transition-shadow duration-500 hover:shadow-[0_26px_60px_-26px_rgba(0,0,0,0.22)]"
              >
                <h3 className="font-display text-2xl text-ivory-50 leading-tight">{e.title}</h3>
                <div className="mt-3 font-display text-3xl gold-text leading-none">{e.price}</div>
                <div className="my-5 h-px w-full bg-gradient-to-r from-azure-300 to-transparent" />
                <ul className="space-y-2.5">
                  {e.items.map((it) => (
                    <li key={it} className="flex items-start gap-2.5">
                      <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gold-600" strokeWidth={3} />
                      <span className="text-sm text-ivory-100 leading-snug">{it}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================= PREMIUM ADD-ONS */}
      <section className="relative section-pad !py-16 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(194,161,75,0.06),transparent_55%)]" />
        <div className="pointer-events-none absolute bottom-0 -left-24 h-80 w-80 rounded-full bg-azure-200/20 blur-3xl" />
        <div className="container-x relative">
          <SectionHeading
            eyebrow="Tailor Your Coverage"
            title="Premium"
            accent="Add-ons"
            sub="Enhance any package with dedicated artists and cinematic upgrades."
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {addOnGroups.map((g, i) => (
              <motion.div
                key={g.label}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -5 }}
                className="rounded-2xl bg-white border border-black/[0.08] p-7 shadow-[0_16px_44px_-24px_rgba(0,0,0,0.14)] transition-shadow duration-500 hover:shadow-[0_26px_60px_-26px_rgba(0,0,0,0.2)]"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-10 w-10 rounded-full bg-gold-400/12 border border-gold-400/30 text-gold-600 flex items-center justify-center">
                    <g.icon className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                  <h3 className="font-display text-xl text-ivory-50">{g.label}</h3>
                </div>
                <ul className="divide-y divide-black/[0.06]">
                  {g.items.map((it) => (
                    <li key={it.name} className="flex items-center justify-between gap-4 py-3">
                      <span className="text-sm text-ivory-100">{it.name}</span>
                      <span className="font-display text-lg text-ivory-50 whitespace-nowrap">{it.price}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Why choose add-ons */}
            <motion.div
              custom={2}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="relative rounded-2xl bg-[#0e0d12] text-white p-7 overflow-hidden"
            >
              <span
                aria-hidden
                className="absolute inset-0 rounded-2xl p-px bg-gradient-to-b from-gold-300/60 via-gold-400/15 to-transparent [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] pointer-events-none"
              />
              <div className="flex items-center gap-2.5 mb-6">
                <Sparkles className="h-4 w-4 text-gold-300" />
                <h3 className="font-display text-xl">Why choose add-ons?</h3>
              </div>
              <ul className="space-y-3.5">
                {addOnBenefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="h-5 w-5 rounded-full bg-gold-400/20 text-gold-300 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-sm text-white/85 leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================= SELECTION & DELIVERY */}
      <section className="relative section-pad !py-16 bg-ink-900/40 overflow-hidden">
        <div className="container-x relative">
          <SectionHeading
            eyebrow="What Happens Next"
            title="Selection &"
            accent="Delivery"
            sub="A transparent, well-defined process from your final selections to the finished album."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {deliverySteps.map((s, i) => (
              <motion.div
                key={s.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -5 }}
                className="rounded-2xl bg-white border border-black/[0.08] p-7 shadow-[0_16px_44px_-24px_rgba(0,0,0,0.14)] transition-shadow duration-500 hover:shadow-[0_26px_60px_-26px_rgba(0,0,0,0.2)]"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="h-10 w-10 rounded-full bg-azure-50 border border-azure-200 text-azure-500 flex items-center justify-center">
                    <s.icon className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                  <h3 className="font-display text-xl text-ivory-50 leading-tight">{s.title}</h3>
                </div>
                <ul className="space-y-2.5">
                  {s.items.map((it) => (
                    <li key={it} className="flex items-start gap-2.5">
                      <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gold-600" strokeWidth={3} />
                      <span className="text-sm text-ivory-100 leading-snug">{it}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================= PAYMENT TERMS */}
      <section className="relative section-pad !py-16 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(194,161,75,0.06),transparent_60%)]" />
        <div className="container-x relative">
          <SectionHeading eyebrow="Simple & Transparent" title="Payment" accent="Terms" />

          {/* Timeline */}
          <div className="relative mx-auto max-w-4xl">
            <div className="hidden sm:block absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-gold-300/40 via-gold-400/60 to-gold-300/40" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4">
              {paymentSteps.map((s, i) => (
                <motion.div
                  key={s.label}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-50px" }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative z-10 h-16 w-16 rounded-full bg-gradient-to-br from-gold-500 to-gold-300 text-ink-950 flex items-center justify-center font-display text-lg font-semibold shadow-[0_12px_28px_-10px_rgba(194,161,75,0.6)]">
                    {s.pct}
                  </div>
                  <div className="mt-4 font-display text-xl text-ivory-50">{s.label}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-azure-600">
                    {s.note}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Outstation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14 mx-auto max-w-2xl rounded-2xl bg-ink-900/60 border border-black/[0.06] p-6 sm:p-7"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <Plane className="h-4 w-4 text-gold-600" />
              <h3 className="font-display text-lg text-ivory-50">Outstation Events</h3>
            </div>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gold-600" strokeWidth={3} />
                <span className="text-sm text-ivory-100">Travel charges are extra based on distance</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gold-600" strokeWidth={3} />
                <span className="text-sm text-ivory-100">Accommodation must be arranged by the client</span>
              </li>
            </ul>
          </motion.div>

          {/* Closing CTA */}
          <div className="mt-14 text-center">
            <p className="text-ivory-200 font-light mb-6">
              Have a date in mind? Let&rsquo;s craft the perfect collection for your celebration.
            </p>
            <Link href="/book-now" className="btn-primary">
              <CreditCard className="h-4 w-4" /> Enquire Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------ wedding card */

function WeddingCard({ pkg, index }: { pkg: WeddingPkg; index: number }) {
  const dark = pkg.recommended;
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: -8 }}
      className={`group relative flex flex-col rounded-2xl p-6 sm:p-7 transition-shadow duration-500 ${
        dark
          ? "bg-[#0e0d12] text-white shadow-[0_30px_70px_-25px_rgba(124,103,46,0.5)]"
          : "bg-white border border-black/[0.08] shadow-[0_18px_50px_-25px_rgba(0,0,0,0.14)] hover:shadow-[0_28px_65px_-25px_rgba(0,0,0,0.22)]"
      }`}
    >
      {dark && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-2xl p-px bg-gradient-to-b from-gold-300/70 via-gold-400/20 to-transparent [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] pointer-events-none"
        />
      )}
      {dark && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top,rgba(214,185,119,0.14),transparent_62%)] pointer-events-none"
        />
      )}
      {pkg.recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-300 text-ink-950 text-[9px] uppercase tracking-[0.22em] font-semibold shadow-lg whitespace-nowrap">
          <Crown className="h-3 w-3 fill-ink-950" /> Flagship
        </div>
      )}

      <h3 className="relative font-display text-2xl sm:text-[1.7rem] leading-tight mb-2">{pkg.name}</h3>

      {/* Tier progression */}
      <div className="relative flex items-center gap-1.5 mb-4">
        {[0, 1, 2, 3].map((d) => {
          const active = d <= index;
          return (
            <span
              key={d}
              className={`h-1.5 rounded-full ${active ? "w-5" : "w-1.5"} ${
                active
                  ? dark
                    ? "bg-gold-300"
                    : "bg-gold-500"
                  : dark
                    ? "bg-white/15"
                    : "bg-black/10"
              }`}
            />
          );
        })}
      </div>

      <p className={`relative text-xs leading-relaxed mb-5 ${dark ? "text-white/55" : "text-ivory-200"}`}>
        {pkg.desc}
      </p>

      <div
        className={`relative font-display text-[2.6rem] leading-none ${
          dark ? "gold-text" : "text-ivory-50"
        }`}
      >
        {pkg.price}
      </div>
      <div
        className={`mt-4 mb-5 h-px w-full ${
          dark
            ? "bg-gradient-to-r from-gold-400/50 to-transparent"
            : "bg-gradient-to-r from-azure-300 to-transparent"
        }`}
      />

      <div className="flex-1 space-y-4">
        {pkg.groups.map((g) => (
          <div key={g.label}>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-[9px] uppercase tracking-[0.2em] font-semibold ${
                  g.free ? "text-gold-600" : dark ? "text-gold-300/80" : "text-azure-600"
                }`}
              >
                {g.label}
              </span>
              {g.free && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gold-400/15 text-gold-600 text-[8px] uppercase tracking-[0.15em] font-bold">
                  <Gift className="h-2.5 w-2.5" /> Free
                </span>
              )}
            </div>
            <ul className="space-y-1.5">
              {g.items.map((it) => (
                <li key={it} className="flex items-start gap-2">
                  <Check
                    className={`h-3 w-3 mt-[3px] shrink-0 ${
                      g.free ? "text-gold-600" : dark ? "text-gold-300" : "text-gold-600"
                    }`}
                    strokeWidth={3}
                  />
                  <span className={`text-xs leading-snug ${dark ? "text-white/85" : "text-ivory-100"}`}>
                    {it}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        className={`mt-5 flex items-start gap-2 rounded-lg px-3 py-2.5 text-[11px] ${
          dark ? "bg-gold-400/10 text-gold-200" : "bg-gold-400/[0.08] text-gold-700"
        }`}
      >
        <Sparkles className="h-3.5 w-3.5 shrink-0 mt-px" />
        <span className="leading-snug">{pkg.offer}</span>
      </div>

      <Link
        href="/book-now"
        className={`mt-4 inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full text-xs font-medium tracking-[0.15em] uppercase transition-all duration-300 ${
          dark
            ? "bg-gradient-to-r from-gold-500 to-gold-300 text-ink-950 hover:shadow-[0_12px_30px_-8px_rgba(214,185,119,0.7)]"
            : "border border-black/15 text-ivory-50 hover:border-gold-500 hover:bg-gold-400/5"
        }`}
      >
        Enquire Now
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}
