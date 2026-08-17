"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { T } from "@/lib/motion";
import type { Film } from "@/lib/products";

/**
 * P9 — Poster-to-film.
 * Poster first; video mounts lazily, autoplays muted when ≥60% in view and
 * pauses off-screen. Under reduced motion, playback is tap-initiated.
 */
export function FilmPlayer({
  film,
  className = "",
  label,
}: {
  film: Film;
  className?: string;
  label?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Autoplay management — user intent always wins over autoplay.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView && !reduced) {
      v.play().catch(() => {});
    } else if (!inView) {
      v.pause();
    }
  }, [inView, reduced, started]);

  const onTime = useCallback(() => {
    const v = videoRef.current;
    if (v && v.duration) setProgress(v.currentTime / v.duration);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const shouldMount = inView || started;

  return (
    <div
      ref={wrapRef}
      className={`group relative overflow-hidden bg-ink-2 ${className}`}
    >
      <Image
        src={film.poster}
        alt={label ? `${label} — film poster` : "Film poster"}
        width={720}
        height={1280}
        sizes="92vw"
        className="h-full w-full object-cover"
      />
      {shouldMount && (
        <video
          ref={videoRef}
          src={film.src}
          poster={film.poster}
          muted={muted}
          loop
          playsInline
          preload="metadata"
          onPlay={() => {
            setPlaying(true);
            setStarted(true);
          }}
          onPause={() => setPlaying(false)}
          onTimeUpdate={onTime}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            started ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Tap surface */}
      <button
        type="button"
        aria-label={playing ? "Pause film" : "Play film"}
        onClick={togglePlay}
        className="absolute inset-0 h-full w-full cursor-pointer"
      />

      {/* Center play affordance when paused */}
      <AnimatePresence>
        {!playing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={T.ui}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-ivory/40 bg-ink/40 backdrop-blur-sm">
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden>
                <path d="M2 1.8v16.4c0 .9 1 1.5 1.8 1L17 11c.8-.5.8-1.6 0-2.1L3.8.8C3 .3 2 .9 2 1.8Z" fill="#f4efe7" />
              </svg>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom chrome */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent pt-14 pb-4">
        <div className="flex items-end justify-between px-4">
          {label ? (
            <span className="label text-ivory/80">{label}</span>
          ) : (
            <span />
          )}
          <button
            type="button"
            aria-label={muted ? "Unmute" : "Mute"}
            onClick={(e) => {
              e.stopPropagation();
              setMuted((m) => !m);
              const v = videoRef.current;
              if (v && v.paused) v.play().catch(() => {});
            }}
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-ivory/30 bg-ink/40 backdrop-blur-sm"
          >
            {muted ? (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M8 2 4.5 5H2v6h2.5L8 14V2Z" fill="#f4efe7" />
                <path d="m11 6 4 4m0-4-4 4" stroke="#f4efe7" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M8 2 4.5 5H2v6h2.5L8 14V2Z" fill="#f4efe7" />
                <path d="M10.5 5.5a3.6 3.6 0 0 1 0 5M12.3 3.7a6 6 0 0 1 0 8.6" stroke="#f4efe7" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
        {/* Progress hairline */}
        <div className="mt-3 h-px w-full bg-ivory/15">
          <div
            className="h-px bg-brass"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
