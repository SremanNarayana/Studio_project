"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Youtube, ArrowUpRight } from "lucide-react";

const CHANNEL_URL = "https://www.youtube.com/@MalayanPhotography";

type Video = {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
};

type Status = "loading" | "ready" | "error";

export function LatestVideo() {
  const [video, setVideo] = useState<Video | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/youtube/latest")
      .then((r) => (r.ok ? (r.json() as Promise<Video>) : Promise.reject(new Error("unavailable"))))
      .then((data) => {
        if (!active) return;
        setVideo(data);
        setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="latest-video" className="relative section-pad bg-white overflow-hidden">
      {/* Ambient depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(194,161,75,0.06),transparent_55%)]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-azure-200/20 blur-3xl" />

      <div className="container-x relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-5">
            <Youtube className="h-3.5 w-3.5 text-gold-600" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-azure-600 font-medium">
              On Film
            </span>
          </div>
          <h2 className="h-display">
            Latest from <span className="italic gold-text">Malayaan Photography</span>
          </h2>
          <p className="mt-5 text-ivory-200 font-light">
            Watch our latest wedding stories, cinematic films and special moments.
          </p>
        </motion.div>

        {/* Player */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-ink-850 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.35)] gold-border">
            {status === "loading" && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-ink-850 to-ink-800" />
            )}

            {status === "ready" && video && !playing && (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={`Play: ${video.title}`}
                className="group absolute inset-0 h-full w-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.dataset.fallback) {
                      img.dataset.fallback = "1";
                      img.src = `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`;
                    }
                  }}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/75 via-ink-950/10 to-ink-950/20" />
                {/* Play button */}
                <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-gold-500 to-gold-300 text-ink-950 shadow-[0_16px_40px_-12px_rgba(194,161,75,0.7)] transition-transform duration-300 group-hover:scale-110">
                  <Play className="ml-1 h-7 w-7 fill-ink-950" strokeWidth={1} />
                </span>
                {/* Title */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 text-left">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-gold-300 mb-1.5">
                    Latest Film
                  </div>
                  <div className="font-display text-xl sm:text-2xl text-white leading-tight line-clamp-2">
                    {video.title}
                  </div>
                </div>
              </button>
            )}

            {status === "ready" && video && playing && (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            )}

            {status === "error" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-800 border border-black/[0.06] text-gold-600">
                  <Youtube className="h-6 w-6" />
                </span>
                <p className="text-sm text-ivory-200 max-w-sm font-light">
                  Latest video currently unavailable. Please visit our YouTube channel.
                </p>
                <a
                  href={CHANNEL_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                >
                  <Youtube className="h-4 w-4" /> Watch on YouTube
                </a>
              </div>
            )}
          </div>

          {/* Channel link */}
          {status === "ready" && (
            <div className="mt-7 text-center">
              <a
                href={CHANNEL_URL}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ivory-200 transition-colors hover:text-gold-600"
              >
                Visit our YouTube channel
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
