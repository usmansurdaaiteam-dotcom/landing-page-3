"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Still } from "@/components/media/Still";
import { T } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
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
  const reduced = useReducedMotionSafe();

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
          initial={{ clipPath: "inset(0 0 0 100%)" }}
          animate={{
            clipPath: revealed ? "inset(0 0 0 0%)" : "inset(0 0 0 100%)",
          }}
          transition={reduced ? { duration: 0 } : T.cinema}
          style={{ willChange: "clip-path" }}
        >
          <Still still={finished} sizes="92vw" priority />
        </motion.div>

        {/* Stage labels — diagonal corners so they never crowd each other */}
        <div className="pointer-events-none absolute inset-0">
          <motion.span
            animate={{ opacity: revealed ? 0.3 : 1 }}
            transition={T.ui}
            className="label absolute top-3.5 left-3.5 rounded-full border border-ivory/25 bg-ink/55 px-3 py-1.5 text-ivory backdrop-blur-sm"
          >
            What arrived
          </motion.span>
          <motion.span
            animate={{ opacity: revealed ? 1 : 0.2 }}
            transition={T.ui}
            className="label absolute right-3.5 bottom-3.5 rounded-full border border-brass/50 bg-ink/55 px-3 py-1.5 text-brass backdrop-blur-sm"
          >
            What we built
          </motion.span>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={replay}
        whileTap={{ scale: 0.94 }}
        animate={{ opacity: revealed ? 1 : 0.35 }}
        className="label mt-3 inline-flex items-center gap-2 text-ivory/55 transition-colors hover:text-brass"
      >
        <motion.svg
          key={runId}
          initial={{ rotate: 0 }}
          animate={{ rotate: runId > 0 ? -360 : 0 }}
          transition={T.reveal}
          width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M12.5 7A5.5 5.5 0 1 1 7 1.5c1.9 0 3.5.9 4.6 2.3M11.5 1v3h-3"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
        Replay transformation
      </motion.button>
    </div>
  );
}
