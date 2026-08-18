"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Share2,
  Download,
  MapPin,
  Check,
  Loader2,
} from "lucide-react";
import type { GalleryItem } from "@/lib/gallery";
import { GALLERY_BLUR } from "@/lib/gallery";

export function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: GalleryItem[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const [zoomed, setZoomed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const open = index !== null && index >= 0 && index < items.length;
  const item = open ? items[index] : null;

  const go = useCallback(
    (dir: number) => {
      if (index === null) return;
      const next = (index + dir + items.length) % items.length;
      setZoomed(false);
      onIndex(next);
    },
    [index, items.length, onIndex]
  );

  // Reset zoom whenever the shown image changes.
  useEffect(() => setZoomed(false), [index]);

  // Keyboard navigation + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, go, onClose]);

  // Reset the transient button states whenever the shown image changes.
  useEffect(() => {
    setCopied(false);
    setDownloading(false);
  }, [index]);

  const share = async () => {
    if (!item) return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    const data = { title: `${item.title} — Malayaan Photography`, text: item.description, url };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(data);
      } else if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      } else {
        window.prompt("Copy this link:", url);
      }
    } catch {
      /* user dismissed the share sheet — no-op */
    }
  };

  const download = async () => {
    if (!item) return;
    const src = item.coverImage;
    const safe =
      item.title
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase() || "photo";
    try {
      setDownloading(true);
      // Fetch as a blob so the file actually downloads (an <a download> can't
      // force-save cross-origin images). Unsplash & same-origin assets allow CORS.
      const res = await fetch(src, { mode: "cors" });
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      const ext = (blob.type.split("/")[1] || "jpg").split("+")[0];
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objUrl;
      a.download = `malayaan-${safe}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objUrl);
    } catch {
      // Fallback: open the image in a new tab so the user can save it manually.
      window.open(src, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-ink-950/95 backdrop-blur-xl flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={`${item.title}, ${item.category}`}
          onClick={onClose}
          onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touchStartX.current = null;
          }}
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-4 sm:px-6 py-4 text-ivory-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0">
              <div className="font-display text-lg sm:text-xl truncate">{item.title}</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-ivory-100/50">
                {index! + 1} / {items.length}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IconBtn
                label={zoomed ? "Zoom out" : "Zoom in"}
                pressed={zoomed}
                onClick={() => setZoomed((z) => !z)}
              >
                {zoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
              </IconBtn>
              <IconBtn label={copied ? "Link copied" : "Share"} onClick={share}>
                {copied ? (
                  <Check className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Share2 className="h-5 w-5" />
                )}
              </IconBtn>
              <IconBtn label="Download" onClick={download} disabled={downloading}>
                {downloading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Download className="h-5 w-5" />
                )}
              </IconBtn>
              <IconBtn label="Close" onClick={onClose}>
                <X className="h-5 w-5" />
              </IconBtn>
            </div>
          </div>

          {/* Stage */}
          <div className="relative flex-1 flex items-center justify-center px-4 sm:px-16 pb-4 min-h-0">
            <IconBtn
              label="Previous"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className="!absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10"
            >
              <ChevronLeft className="h-6 w-6" />
            </IconBtn>

            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-500 ${
                    zoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
                  }`}
                  onClick={() => setZoomed((z) => !z)}
                >
                  <Image
                    src={item.coverImage}
                    alt={`${item.title} — ${item.category} in ${item.location}`}
                    fill
                    sizes="100vw"
                    placeholder="blur"
                    blurDataURL={GALLERY_BLUR}
                    className="object-contain"
                    priority
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            <IconBtn
              label="Next"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className="!absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10"
            >
              <ChevronRight className="h-6 w-6" />
            </IconBtn>
          </div>

          {/* Caption */}
          <div
            className="px-5 sm:px-8 pb-6 pt-2 text-center text-ivory-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[10px] uppercase tracking-[0.3em] text-gold-300 mb-1.5">
              {item.category}
            </div>
            {item.description && (
              <p className="text-sm text-ivory-100/70 max-w-xl mx-auto font-light">
                {item.description}
              </p>
            )}
            <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-ivory-100/50">
              <MapPin className="h-3 w-3" /> {item.location}
              <span className="mx-1">·</span>
              {new Date(item.date).toLocaleDateString("en-IN", {
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  className = "",
  pressed,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  pressed?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      title={label}
      onClick={onClick}
      className={`h-11 w-11 rounded-full border flex items-center justify-center text-ivory-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
        pressed ? "border-gold-400/60 bg-white/10" : "border-white/15 hover:bg-white/10"
      } ${className}`}
    >
      {children}
    </button>
  );
}
