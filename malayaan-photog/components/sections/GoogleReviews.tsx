"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  APPROVED_REVIEWS,
  REVIEW_SUMMARY,
  GOOGLE_REVIEW_URL,
  type Review,
  type ReviewSummary,
} from "@/lib/reviews";

const EASE = [0.22, 1, 0.36, 1] as const;
const TRUNCATE_AT = 180; // chars before "Read more" kicks in

/** The Google "G" — a small, tasteful brand cue (not a full widget). */
function GoogleMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function Stars({ rating, size = "h-4 w-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          className={`${size} ${i < Math.round(rating) ? "fill-gold-400 text-gold-400" : "fill-ink-700 text-ink-700"}`}
          strokeWidth={1}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function metaLine(r: Review) {
  if (!r.reviewCount) return null;
  const reviews = `${r.reviewCount} review${r.reviewCount === 1 ? "" : "s"}`;
  const photos = r.photoCount ? ` · ${r.photoCount} photo${r.photoCount === 1 ? "" : "s"}` : "";
  return `${reviews}${photos}`;
}

/** Truncate on a word boundary so text never cuts mid-word. */
function truncate(text: string, at: number) {
  if (text.length <= at) return text;
  const slice = text.slice(0, at);
  const lastSpace = slice.lastIndexOf(" ");
  return slice.slice(0, lastSpace > 0 ? lastSpace : at).trimEnd();
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > TRUNCATE_AT;
  const shown = expanded || !isLong ? review.text : truncate(review.text, TRUNCATE_AT);
  const meta = metaLine(review);

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: EASE, delay: (index % 3) * 0.08 }}
      className="group relative flex w-[85%] shrink-0 snap-start flex-col rounded-2xl glass gold-border p-6 text-left shadow-[0_18px_50px_-38px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-44px_rgba(194,161,75,0.32)] sm:w-[calc((100%-1.25rem)/2)] sm:p-7 lg:w-[calc((100%-2.5rem)/3)]"
    >
      {/* Reviewer + meta */}
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-400/12 font-display text-lg text-gold-600">
          {review.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <div className="truncate font-display text-base leading-tight text-ivory-50">
            {review.name}
          </div>
          {meta && (
            <div className="mt-0.5 truncate text-[11px] text-ivory-200/60">{meta}</div>
          )}
        </div>
      </div>

      {/* Stars + date */}
      <div className="mt-4 flex items-center gap-3">
        <Stars rating={review.rating} />
        {review.date && (
          <span className="text-[11px] text-ivory-200/55">{review.date}</span>
        )}
      </div>

      {/* Review text (never rewritten) */}
      <p className="mt-3 flex-1 text-[14px] font-light leading-relaxed text-ivory-100/85">
        &ldquo;{shown}
        {!expanded && isLong ? "… " : "”"}
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="ml-0.5 font-medium text-gold-600 underline-offset-2 transition-colors hover:text-gold-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 rounded"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </p>

      {/* Source attribution */}
      <footer className="mt-5 flex items-center gap-1.5 border-t border-black/[0.06] pt-4 text-[11px] uppercase tracking-[0.18em] text-ivory-200/60">
        <GoogleMark className="h-3.5 w-3.5" />
        Google Review
        {review.uri && (
          <a
            href={review.uri}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${review.name}'s review on Google (opens in a new tab)`}
            className="ml-auto inline-flex items-center gap-1 whitespace-nowrap font-medium normal-case tracking-normal transition-colors hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 rounded"
          >
            View
            <ArrowRight className="h-3 w-3" />
          </a>
        )}
      </footer>
    </motion.article>
  );
}

function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const cc = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(cc - center);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
    setOverflowing(el.scrollWidth - el.clientWidth > 4);
  };

  useEffect(() => {
    onScroll();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(onScroll);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const step = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const gap = 20;
    const amount = first ? first.offsetWidth + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  const goTo = (i: number) => {
    const el = ref.current;
    const c = el?.children[i] as HTMLElement | undefined;
    c?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <div role="group" aria-roledescription="carousel" aria-label="Google reviews">
      <div
        ref={ref}
        onScroll={onScroll}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-2 lg:mt-14 lg:px-0"
      >
        {reviews.map((r, i) => (
          <ReviewCard key={`${r.name}-${i}`} review={r} index={i} />
        ))}
      </div>

      {/* Desktop prev/next — subtle circular controls (only when scrollable) */}
      <div className={`mt-7 hidden items-center justify-center gap-3 ${overflowing ? "lg:flex" : ""}`}>
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={atStart}
          aria-label="Previous reviews"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-ivory-100 transition-all duration-300 hover:border-gold-500/60 hover:text-gold-600 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={atEnd}
          aria-label="Next reviews"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-ivory-100 transition-all duration-300 hover:border-gold-500/60 hover:text-gold-600 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Mobile / tablet pagination dots */}
      {reviews.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2 lg:hidden">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to review ${i + 1}`}
              aria-current={active === i}
              className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 ${
                active === i ? "w-6 bg-gold-500" : "w-1.5 bg-ivory-200/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function GoogleReviews() {
  // Client-approved reviews are the source of truth. Only fall back to live
  // Google Places data if that list is empty. Both paths are real — nothing
  // here is ever fabricated.
  const [data, setData] = useState<{ summary: ReviewSummary | null; reviews: Review[] }>({
    summary: REVIEW_SUMMARY,
    reviews: APPROVED_REVIEWS,
  });

  useEffect(() => {
    if (APPROVED_REVIEWS.length > 0) return; // manual reviews take priority
    let alive = true;
    fetch("/api/reviews")
      .then((r) => (r.ok ? r.json() : null))
      .then((live) => {
        if (!alive || !live) return;
        if (Array.isArray(live.reviews) && live.reviews.length > 0) {
          setData({ summary: live.summary ?? REVIEW_SUMMARY, reviews: live.reviews });
        } else if (live.summary) {
          setData((d) => ({ ...d, summary: live.summary }));
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const { reviews, summary } = data;
  const hasReviews = reviews.length > 0;

  return (
    <section id="reviews" className="section-pad bg-ink-900">
      <div className="container-x">
        {/* Header — the strongest element in the hierarchy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mb-5 flex items-center justify-center gap-2.5">
            <GoogleMark />
            <span className="eyebrow">Google Reviews</span>
          </div>
          <h2 className="h-display">
            Loved by the <span className="italic gold-text">Couples</span> We Capture
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm font-light leading-relaxed text-ivory-200 sm:text-base">
            Real stories from couples who trusted Malayaan Photography with their most
            beautiful moments.
          </p>
        </motion.div>

        {/* Optional real rating summary — hidden until confirmed data exists */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mx-auto mt-8 flex w-fit items-center gap-5 rounded-full glass gold-border px-7 py-4"
          >
            <GoogleMark className="h-6 w-6" />
            <div className="h-8 w-px bg-black/10" />
            <div className="flex items-center gap-3">
              <span className="font-display text-2xl text-ivory-50">
                {summary.rating.toFixed(1)}
              </span>
              <div className="flex flex-col">
                <Stars rating={summary.rating} />
                <span className="mt-1 text-[11px] uppercase tracking-[0.15em] text-ivory-200/70">
                  Based on {summary.count} Google review{summary.count === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Primary CTA */}
        <div className="mt-10 flex justify-center">
          <motion.a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share your experience — write a Google review for Malayaan Photography (opens in a new tab)"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="group inline-flex items-center gap-2.5 rounded-full border border-gold-400/30 bg-ivory-50 px-9 py-4 text-xs font-medium uppercase tracking-[0.18em] text-gold-300 transition-colors duration-300 hover:border-gold-400/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900"
          >
            Share Your Experience
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </motion.a>
        </div>

        {/* Real Google reviews — carousel: 3 desktop / 2 tablet / 1 mobile */}
        {hasReviews && <ReviewsCarousel reviews={reviews} />}

        {/* Secondary link + supporting line */}
        <div className="mt-12 flex flex-col items-center gap-5">
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs uppercase tracking-[0.2em] text-ivory-200/80 transition-colors hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900"
          >
            See More Reviews on Google
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </a>
          <p className="text-xs font-light italic text-ivory-200/60">
            Your experience matters to us.
          </p>
        </div>
      </div>
    </section>
  );
}
