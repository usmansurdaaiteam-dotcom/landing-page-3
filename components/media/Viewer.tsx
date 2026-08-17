"use client";

import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Still } from "@/components/media/Still";
import { T, SPRING } from "@/lib/motion";
import type { Still as StillType } from "@/lib/products";

/**
 * P6 — Shared-element media takeover.
 * The tapped thumbnail (given the same layoutId) travels into a full-screen
 * viewer. Swipe down or the close control dismisses. Body scroll is locked
 * while open.
 */
export function Viewer({
  still,
  layoutId,
  onClose,
  onPrev,
  onNext,
  meta,
  index,
  count,
}: {
  still: StillType | null;
  layoutId?: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  meta?: string;
  index?: number;
  count?: number;
}) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!still) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [still, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {still && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-ink/92 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={T.ui}
          role="dialog"
          aria-modal="true"
          aria-label={still.caption}
        >
          <div className="flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))]">
            <span className="label text-ivory/60">
              {index !== undefined && count !== undefined
                ? `${String(index + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`
                : ""}
            </span>
            <button
              type="button"
              aria-label="Close viewer"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/25 text-ivory"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="m1 1 12 12M13 1 1 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <motion.div
            className="flex min-h-0 flex-1 items-center justify-center px-4 py-4"
            drag={reduced ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.08, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose();
            }}
          >
            <motion.div
              layoutId={layoutId}
              transition={SPRING.spatial}
              className="relative max-h-full overflow-hidden rounded-sm"
              style={{ aspectRatio: "9 / 16" }}
            >
              <Still still={still} sizes="92vw" className="max-h-[74svh] w-auto" />
            </motion.div>
          </motion.div>

          <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-display text-lg text-ivory">{still.caption}</p>
                {meta && <p className="label mt-1 text-ivory/50">{meta}</p>}
              </div>
              {(onPrev || onNext) && (
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={onPrev}
                    disabled={!onPrev}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/25 text-ivory disabled:opacity-30"
                  >
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden>
                      <path d="M6 1 1 6l5 5M1 6h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={onNext}
                    disabled={!onNext}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/25 text-ivory disabled:opacity-30"
                  >
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden>
                      <path d="m10 1 5 5-5 5M15 6H1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
