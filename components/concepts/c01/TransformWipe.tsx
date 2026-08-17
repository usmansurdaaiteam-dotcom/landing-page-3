"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Still } from "@/components/media/Still";
import { T } from "@/lib/motion";
import type { Still as StillType } from "@/lib/products";

/**
 * P3 — Transformation wipe (Tier 4 hero moment).
 * The finished frame wipes over the raw frame once, when the block is
 * meaningfully in view. Replayable. Reduced motion: crossfade.
 */
export function TransformWipe({
  raw,
  finished,
  className = "",
}: {
  raw: StillType;
  finished: StillType;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.55, once: true });
  const [revealed, setRevealed] = useState(false);
  const [runId, setRunId] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setRevealed(true), 650);
    return () => clearTimeout(t);
  }, [inView]);

  const replay = () => {
    setRevealed(false);
    setRunId((r) => r + 1);
    setTimeout(() => setRevealed(true), 420);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-md">
        {/* Raw layer */}
        <div className="absolute inset-0">
          <Still still={raw} sizes="92vw" />
          <span className="absolute inset-0 bg-ink/10" />
        </div>
        {/* Finished layer wipes over */}
        <motion.div
          key={runId}
          className="absolute inset-0"
          initial={
            reduced ? { opacity: 0 } : { clipPath: "inset(0 0 0 100%)" }
          }
          animate={
            revealed
              ? reduced
                ? { opacity: 1 }
                : { clipPath: "inset(0 0 0 0%)" }
              : reduced
                ? { opacity: 0 }
                : { clipPath: "inset(0 0 0 100%)" }
          }
          transition={T.cinema}
          style={reduced ? undefined : { willChange: "clip-path" }}
        >
          <Still still={finished} sizes="92vw" priority />
        </motion.div>

        {/* Stage labels */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-4">
          <motion.span
            animate={{ opacity: revealed ? 0.35 : 0.95 }}
            transition={T.ui}
            className="label rounded-full border border-ivory/25 bg-ink/45 px-3 py-1.5 text-ivory backdrop-blur-sm"
          >
            What arrived
          </motion.span>
          <motion.span
            animate={{ opacity: revealed ? 0.95 : 0.25 }}
            transition={T.ui}
            className="label rounded-full border border-brass/50 bg-ink/45 px-3 py-1.5 text-brass backdrop-blur-sm"
          >
            What we built
          </motion.span>
        </div>
      </div>

      <button
        type="button"
        onClick={replay}
        className="label mt-3 inline-flex items-center gap-2 text-ivory/55 transition-colors hover:text-brass"
      >
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M12.5 7A5.5 5.5 0 1 1 7 1.5c1.9 0 3.5.9 4.6 2.3M11.5 1v3h-3"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Replay transformation
      </button>
    </div>
  );
}
