import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from "lucide-react";
import { SERVICE_AREAS as serviceAreas } from "@/lib/seo";

const services = [
  "Wedding Photography",
  "Cinematic Wedding Films",
  "Pre-Wedding Shoots",
  "Maternity Photography",
  "Baby Photography",
  "Family Portraits",
];

const quick = [
  { href: "/#portfolio", label: "Portfolio" },
  { href: "/#services", label: "Services" },
  { href: "/#process", label: "Process" },
  { href: "/track", label: "Track My Project" },
  { href: "/#contact", label: "Contact" },
];

const insta = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80",
  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=80",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&q=80",
  "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&q=80",
  "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?w=400&q=80",
];

export function Footer() {
  return (
    <footer className="relative bg-[#0a0a0d] text-white/80 overflow-hidden">
      {/* Gold top accent bar */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
      {/* Soft ambient glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-gold-400/[0.04] blur-3xl pointer-events-none" />

      <div className="relative container-x px-6 sm:px-10 lg:px-20 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <div className="mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Malayaan Photography"
                data-logo="true"
                style={{ height: "140px" }}
                className="object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed text-white/55 mb-6 max-w-sm">
              Capturing emotions. Creating timeless memories. A premium photography studio
              crafting stories across Tamil Nadu since day one.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-white/15 text-white/70 hover:border-gold-400 hover:text-gold-300 hover:bg-gold-400/10 transition-all"
                  aria-label="social"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs tracking-[0.3em] uppercase text-azure-300 font-medium mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              {quick.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/70 hover:text-gold-300 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs tracking-[0.3em] uppercase text-azure-300 font-medium mb-5">
              Services
            </h4>
            <ul className="space-y-3 text-sm">
              {services.map((s) => (
                <li key={s} className="text-white/65">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs tracking-[0.3em] uppercase text-azure-300 font-medium mb-5">
              Contact
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-gold-300 shrink-0" />
                <span className="text-white/70">
                  Therkkupatty, Melur, Surakkundu, Tamil Nadu 625106
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-4 w-4 mt-0.5 text-gold-300 shrink-0" />
                <a href="tel:+917708113657" className="text-white/70 hover:text-gold-300">
                  +91 77081 13657
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="h-4 w-4 mt-0.5 text-gold-300 shrink-0" />
                <a
                  href="mailto:hello@malayaanphotography.com"
                  className="text-white/70 hover:text-gold-300"
                >
                  hello@malayaanphotography.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Areas we serve — local SEO content */}
        <div className="mt-16 pt-10 border-t border-white/10">
          <h4 className="text-xs tracking-[0.3em] uppercase text-azure-300 font-medium mb-5">
            Photography Across Tamil Nadu
          </h4>
          <p className="text-sm text-white/55 leading-relaxed max-w-4xl">
            Malayaan Photography proudly serves couples and families across Tamil Nadu —
            including{" "}
            {serviceAreas.map((area, i) => (
              <span key={area}>
                <span className="text-white/75">{area}</span>
                {i < serviceAreas.length - 1 ? ", " : ""}
              </span>
            ))}
            . From candid wedding photography and cinematic films to pre-wedding shoots,
            maternity, baby, house-warming and traditional event coverage — we travel
            across the state to capture your story.
          </p>
        </div>

        <div className="mt-12 pt-10 border-t border-white/10">
          <h4 className="text-xs tracking-[0.3em] uppercase text-azure-300 font-medium mb-5">
            @malayaan.photography
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {insta.map((src, i) => (
              <a
                key={i}
                href="#"
                className="aspect-square overflow-hidden rounded-lg group relative border border-white/5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center transition-all">
                  <Instagram className="h-5 w-5 opacity-0 group-hover:opacity-100 text-gold-300" />
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Malayaan Photography. All rights reserved.</p>
          <p className="font-display tracking-wider">
            Crafted with elegance in <span className="text-gold-300">Tamil Nadu</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
