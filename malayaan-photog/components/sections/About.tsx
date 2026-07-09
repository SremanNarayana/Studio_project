"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 38, suffix: "+", label: "Five-Star Reviews" },
  { value: 500, suffix: "+", label: "Photoshoots Completed" },
  { value: 12, suffix: "", label: "Years of Craft" },
  { value: 100, suffix: "%", label: "Client Satisfaction" },
];

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const dur = 1800;
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
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

export function About() {
  return (
    <section id="about" className="section-pad relative">
      <div className="container-x grid lg:grid-cols-12 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm gold-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/about-photo.jpg"
              alt="Wedding couple holding hands with garlands"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
          </div>
          <div className="absolute -bottom-8 -right-8 hidden md:block glass p-6 rounded-sm gold-border w-56">
            <div className="font-display text-4xl gold-text">12+</div>
            <div className="text-xs uppercase tracking-[0.2em] text-ivory-100/60 mt-1">
              Years behind the lens
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <div className="eyebrow mb-6">— About The Studio</div>
          <h2 className="h-display mb-8">
            Our Passion <span className="italic gold-text">Behind The Lens</span>
          </h2>
          <p className="text-lg text-ivory-100/70 leading-relaxed font-light mb-6">
            Malayaan Photography specializes in capturing authentic emotions, timeless love
            stories, family milestones, and unforgettable celebrations. Every frame is
            carefully crafted to preserve memories that last forever.
          </p>
          <p className="text-base text-ivory-100/55 leading-relaxed font-light mb-12">
            From the first glance between a bride and groom, to the quiet wonder of a
            newborn's first weeks — we believe photographs are heirlooms in the making. Our
            studio blends documentary instinct with editorial polish to deliver imagery worthy
            of generations.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-black/10 border border-black/10">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-ink-900 p-6 sm:p-8 hover:bg-ink-850 transition-colors"
              >
                <div className="font-display text-4xl sm:text-5xl gold-text mb-2">
                  <CountUp to={s.value} suffix={s.suffix} />
                </div>
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-ivory-100/50">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
