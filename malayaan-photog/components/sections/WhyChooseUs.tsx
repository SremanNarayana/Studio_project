"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const features = [
  { title: "Cinematic Storytelling", desc: "Every wedding plays back like your favorite film." },
  { title: "Creative Direction", desc: "Concepts, locations, styling — we sculpt the day." },
  { title: "Professional Editing", desc: "Master-grade color and tone, frame by frame." },
  { title: "Premium Albums", desc: "Hand-bound on archival fine art paper." },
  { title: "Fast Delivery", desc: "Sneak peeks in 48 hours. Full edit within weeks." },
  { title: "High-End Equipment", desc: "Flagship cameras, prime lenses, gimbal kits." },
  { title: "Personalized Experience", desc: "One studio. One vision. One dedicated team." },
  { title: "Natural & Authentic", desc: "We catch the in-between moments others miss." },
  { title: "Luxury Presentation", desc: "Every deliverable arrives gallery-ready." },
  { title: "Client-Focused Workflow", desc: "Transparent process, transparent pricing." },
];

export function WhyChooseUs() {
  return (
    <section className="section-pad">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-16"
        >
          <div className="eyebrow mb-5">— Why Choose Us</div>
          <h2 className="h-display">
            Built On <span className="italic gold-text">Craft</span> & Care
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 5) * 0.05 }}
              className="relative p-6 rounded-sm glass gold-border hover:bg-black/[0.06] transition-all duration-500 group"
            >
              <div className="h-9 w-9 rounded-full bg-gold-400/15 text-gold-600 flex items-center justify-center mb-4 group-hover:bg-gold-400 group-hover:text-ink-950 transition">
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <h3 className="font-display text-lg leading-tight mb-2">{f.title}</h3>
              <p className="text-xs text-ivory-100/55 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
