"use client";

import { motion } from "framer-motion";
import {
  Camera,
  Film,
  Heart,
  Sparkles,
  Users,
  Baby,
  Smile,
  HomeIcon,
  Crown,
  BookOpen,
  Wand2,
  Image as ImageIcon,
} from "lucide-react";

const services = [
  { icon: Heart, title: "Wedding Photography", desc: "Documenting your day with editorial elegance and unscripted emotion." },
  { icon: Film, title: "Cinematic Wedding Films", desc: "Feature-quality films that play like memory in motion." },
  { icon: Sparkles, title: "Pre-Wedding Shoots", desc: "Story-driven sessions in destinations that frame your love." },
  { icon: Crown, title: "Engagement Photography", desc: "Refined portraits for the moments leading up to forever." },
  { icon: Users, title: "Couple Shoots", desc: "Intimate sessions that celebrate connection and chemistry." },
  { icon: Camera, title: "Maternity Photography", desc: "Soft, luminous frames for the most anticipated chapter." },
  { icon: Baby, title: "Baby Photography", desc: "Delicate compositions of those first fleeting weeks." },
  { icon: Smile, title: "Kids Photography", desc: "Playful, candid storytelling for every milestone." },
  { icon: HomeIcon, title: "Family Portraits", desc: "Heirloom imagery the next generation will treasure." },
  { icon: BookOpen, title: "Traditional Event Coverage", desc: "Functions, ceremonies, and culture documented with care." },
  { icon: ImageIcon, title: "Album Designing", desc: "Hand-curated layouts printed on archival premium paper." },
  { icon: Wand2, title: "Professional Retouching", desc: "Color, tone, and detail polished by master editors." },
];

export function Services() {
  return (
    <section id="services" className="section-pad bg-ink-900/40 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(194,161,75,0.08),transparent_60%)]" />
      <div className="container-x relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <div className="eyebrow mb-5">— What We Offer</div>
          <h2 className="h-display">
            Services Crafted For <span className="italic gold-text">Every Story</span>
          </h2>
          <p className="mt-6 text-ivory-100/60 font-light">
            From the first look to the final album, every detail is handled with care.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/5 border border-black/5">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (i % 6) * 0.05 }}
              className="group relative bg-ink-900 p-8 sm:p-10 hover:bg-ink-850 transition-all duration-500 cursor-default"
            >
              <div className="absolute top-0 left-0 h-px w-0 bg-gradient-to-r from-azure-400 to-transparent group-hover:w-full transition-all duration-700" />
              <div className="absolute top-6 right-6 font-display text-xs text-ivory-100/20">
                0{i + 1 < 10 ? i + 1 : i + 1}
              </div>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold-400/30 text-gold-600 mb-6 group-hover:bg-gold-400 group-hover:text-ink-950 group-hover:border-gold-400 transition-all duration-500">
                <s.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl mb-3">{s.title}</h3>
              <p className="text-sm text-ivory-100/55 leading-relaxed font-light">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
