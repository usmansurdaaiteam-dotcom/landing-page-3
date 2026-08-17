"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Still } from "@/components/media/Still";
import { FilmPlayer } from "@/components/media/FilmPlayer";
import { SourceFan } from "@/components/concepts/c01/SourceFan";
import { T, SPRING } from "@/lib/motion";
import { sortForDisplay, type Product, type Still as StillType } from "@/lib/products";

/** Large active visual + thumb strip; crossfade on thumb tap. */
function FeatureGallery({ stills, panelKey }: { stills: StillType[]; panelKey: string }) {
  const [active, setActive] = useState(0);
  const current = stills[Math.min(active, stills.length - 1)];
  return (
    <div>
      <div className="relative aspect-[3/4] overflow-hidden rounded">
        <AnimatePresence initial={false}>
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={T.reveal}
            className="absolute inset-0"
          >
            <Still still={current} sizes="92vw" />
          </motion.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-4 pt-12 pb-3">
          <p className="font-display text-lg text-ivory">{current.caption}</p>
        </div>
      </div>
      {stills.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {stills.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={s.caption}
              aria-current={i === active}
              onClick={() => setActive(i)}
              className="relative h-[76px] w-[57px] shrink-0 overflow-hidden rounded-sm"
            >
              <Still still={s} sizes="57px" className={i === active ? "" : "opacity-45"} />
              {i === active && (
                <motion.span
                  layoutId={`fg-marker-${panelKey}`}
                  transition={SPRING.snappy}
                  className="absolute inset-0 rounded-sm ring-1 ring-brass"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function StagePanel({
  num,
  label,
  count,
  open,
  onToggle,
  product,
  cat,
}: {
  num: string;
  label: string;
  count: number;
  open: boolean;
  onToggle: () => void;
  product: Product;
  cat: "source" | "studio" | "lifestyle" | "campaign" | "film";
}) {
  const filtered =
    cat === "film" ? [] : product.stills.filter((s) => s.cat === cat);
  const stills = cat === "source" ? filtered : sortForDisplay(filtered);

  return (
    <motion.section
      layout
      transition={SPRING.spatial}
      className={`hairline overflow-hidden rounded-md border ${
        open ? "bg-ink-2" : "bg-transparent"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-4 px-4 py-4 text-left"
      >
        <span
          className={`font-display text-xl tabular-nums transition-colors duration-300 ${
            open ? "text-brass" : "text-ivory/35"
          }`}
        >
          {num}
        </span>
        <span className="flex-1">
          <span className={`label-wide block ${open ? "text-ivory" : "text-ivory/60"}`}>
            {label}
          </span>
        </span>
        <span className="label text-ivory/40 tabular-nums">
          {cat === "film" ? "1 film" : `${count} visuals`}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={SPRING.snappy}
          className={`flex h-7 w-7 items-center justify-center rounded-full border ${
            open ? "border-brass/60 text-brass" : "border-ivory/20 text-ivory/50"
          }`}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path d="M5 0v10M0 5h10" stroke="currentColor" strokeWidth="1.1" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={SPRING.spatial}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5">
              {cat === "source" ? (
                <SourceFan stills={stills} />
              ) : cat === "film" ? (
                <FilmPlayer
                  film={product.film}
                  label={`${product.client} — campaign film`}
                  className="aspect-[9/16] max-h-[72svh] rounded"
                />
              ) : (
                <FeatureGallery stills={stills} panelKey={`${product.slug}-${cat}`} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
