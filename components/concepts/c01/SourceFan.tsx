"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Still } from "@/components/media/Still";
import { SPRING } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import type { Still as StillType } from "@/lib/products";

/**
 * P2 — Raw stack → fan-out.
 * Source photos arrive as a messy rotated pile, then spring apart into an
 * ordered row: messy input → controlled system.
 */
export function SourceFan({ stills }: { stills: StillType[] }) {
  const items = stills.slice(0, 3);
  const [fanned, setFanned] = useState(false);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    const t = setTimeout(() => setFanned(true), reduced ? 0 : 480);
    return () => clearTimeout(t);
  }, [reduced]);

  const stacked = [
    { rotate: -5, x: "-4%", y: 10, scale: 0.96 },
    { rotate: 3, x: "3%", y: 4, scale: 0.98 },
    { rotate: 0, x: "0%", y: 0, scale: 1 },
  ];

  return (
    <div>
      <div className="relative">
        <div className="flex gap-2.5">
          {items.map((s, i) => (
            <motion.div
              key={s.id}
              className="relative aspect-[9/16] min-w-0 flex-1 overflow-hidden rounded"
              initial={false}
              animate={
                fanned || reduced
                  ? { rotate: 0, x: "0%", y: 0, scale: 1 }
                  : stacked[i % stacked.length]
              }
              transition={
                reduced
                  ? { duration: 0 }
                  : { ...SPRING.spatial, delay: fanned ? i * 0.06 : 0 }
              }
              style={{ zIndex: items.length - i }}
            >
              <Still still={s} sizes="30vw" />
              <span className="absolute inset-0 rounded ring-1 ring-ivory/10 ring-inset" />
            </motion.div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="label text-ivory/45">
          {items.length} reference{items.length > 1 ? "s" : ""} · shot in the
          warehouse
        </p>
        <button
          type="button"
          onClick={() => {
            setFanned(false);
            setTimeout(() => setFanned(true), 420);
          }}
          className="label text-ivory/55 transition-colors hover:text-brass"
        >
          Restack
        </button>
      </div>
    </div>
  );
}
