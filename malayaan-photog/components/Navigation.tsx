"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const links = [
  { href: "/#portfolio", label: "Portfolio" },
  { href: "/gallery", label: "Gallery" },
  { href: "/#services", label: "Services" },
  { href: "/#process", label: "Process" },
  { href: "/packages", label: "Packages" },
  { href: "/#about", label: "About" },
  { href: "/book-now", label: "Book Now" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-3 sm:top-4 lg:top-5 z-50 flex justify-center px-3 sm:px-4 lg:px-6">
        <div
          className={`w-full max-w-7xl rounded-full border shadow-[0_12px_40px_-14px_rgba(0,0,0,0.5)] transition-all duration-500 ${
            scrolled
              ? "py-1.5 backdrop-blur-2xl bg-[#14100e]/90 border-[#c8a96a]/25"
              : "py-2 bg-[#14100e]/55 backdrop-blur-md border-[#c8a96a]/10"
          }`}
        >
          <div className="w-full px-2.5 sm:px-3 lg:px-4 flex items-center justify-between">
            <Link href="/" className="flex items-center group -ml-1" aria-label="Malayaan Photography">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Malayaan Photography"
                data-logo="true"
                style={{ height: scrolled ? "56px" : "80px" }}
                className="object-contain transition-all duration-500 group-hover:scale-105"
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-4 xl:gap-5">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="relative text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-white/75 transition-all duration-300 hover:text-[#c8a96a] hover:[text-shadow:0_0_12px_rgba(200,169,106,0.55)] after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-[#c8a96a] after:transition-all after:duration-300 hover:after:w-full"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/track"
              className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold-400/60 text-gold-300 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] hover:bg-gold-400 hover:text-ink-950 transition-all"
            >
              Track Project
            </Link>

            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-2 text-white"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink-950/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Malayaan Photography" data-logo="true" style={{ height: "64px" }} className="object-contain" />
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col items-center justify-center gap-8 mt-20">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-3xl tracking-wide hover:text-gold-600"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              {/* Track Project — the desktop pill is hidden on mobile, so surface it here */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: links.length * 0.06 }}
              >
                <Link
                  href="/track"
                  onClick={() => setOpen(false)}
                  className="font-display text-3xl tracking-wide text-gold-600 hover:text-gold-500"
                >
                  Track Project
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
