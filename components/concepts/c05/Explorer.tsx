"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { products, type Still as StillType } from "@/lib/products";
import { Still } from "@/components/media/Still";
import { Viewer } from "@/components/media/Viewer";
import { FilmPlayer } from "@/components/media/FilmPlayer";
import { Deck, DeckControls } from "@/components/gallery/Deck";
import { Fade, Lines } from "@/components/motion/Reveal";
import { Wordmark } from "@/components/navigation/Wordmark";
import { T, SPRING } from "@/lib/motion";

const CATS = [
  { key: "source", label: "Source" },
  { key: "studio", label: "Studio" },
  { key: "lifestyle", label: "Lifestyle" },
  { key: "campaign", label: "Campaign" },
  { key: "film", label: "Film" },
] as const;

export function Explorer() {
  const [slug, setSlug] = useState("marc-main");
  const product = products.find((p) => p.slug === slug)!;
  const [open, setOpen] = useState<string>("studio");
  const [zoom, setZoom] = useState<{ list: StillType[]; index: number } | null>(null);

  const rows = useMemo(
    () =>
      CATS.map((c) => ({
        ...c,
        stills:
          c.key === "film"
            ? []
            : product.stills.filter((s) => s.cat === c.key),
      })).filter((r) => r.key === "film" || r.stills.length > 0),
    [product],
  );

  const effectiveOpen = rows.some((r) => r.key === open)
    ? open
    : rows.find((r) => r.key !== "source")?.key ?? rows[0].key;

  const switchProduct = (next: string) => {
    if (next === slug) return;
    setSlug(next);
    setOpen("studio");
  };

  return (
    <div className="min-h-svh bg-cream pb-28 text-ink">
      <header className="flex items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <Wordmark tone="light" />
        <span className="label-wide text-ink/40">Concept 05</span>
      </header>

      <section className="px-5 pt-10">
        <p className="label-wide text-brass-2">Asset explorer</p>
        <Lines
          as="h1"
          lines={["Open a category.", "It takes the room."]}
          className="font-display mt-3 text-[9.4vw] leading-[1.06] sm:text-4xl"
        />
      </section>

      {/* Product chips */}
      <div className="sticky top-0 z-30 mt-6 bg-cream/90 backdrop-blur-md">
        <div
          role="tablist"
          aria-label="Products"
          className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-3"
        >
          {products.map((p) => {
            const active = p.slug === slug;
            return (
              <button
                key={p.slug}
                role="tab"
                aria-selected={active}
                onClick={() => switchProduct(p.slug)}
                className="relative shrink-0 cursor-pointer rounded-full px-4 py-2"
              >
                {active && (
                  <motion.span
                    layoutId="c05-chip"
                    transition={SPRING.snappy}
                    className="absolute inset-0 rounded-full bg-ink"
                  />
                )}
                <span
                  className={`label relative ${active ? "text-ivory" : "text-ink/55"}`}
                >
                  {p.client}
                </span>
              </button>
            );
          })}
        </div>
        <div className="hairline border-t" />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={slug}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={T.reveal}
        >
          <section className="px-5 pt-6 pb-2">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-2xl">{product.name}</h2>
              <span className="label text-ink/40 tabular-nums">
                {product.total} assets
              </span>
            </div>
            <p className="label mt-1 text-ink/45">{product.material}</p>
          </section>

          <section className="mt-4 flex flex-col gap-2 px-3">
            {rows.map((row) => {
              const isOpen = effectiveOpen === row.key;
              return (
                <motion.div
                  key={row.key}
                  layout
                  transition={SPRING.spatial}
                  className={`overflow-hidden rounded-lg ${
                    isOpen ? "bg-ink text-ivory" : "hairline border bg-transparent"
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? "" : row.key)}
                    className="flex w-full cursor-pointer items-center justify-between px-4 py-4 text-left"
                  >
                    <span>
                      <span
                        className={`font-display block text-2xl ${
                          isOpen ? "text-ivory" : "text-ink"
                        }`}
                      >
                        {row.label}
                      </span>
                      <span
                        className={`label mt-0.5 block ${
                          isOpen ? "text-brass" : "text-ink/45"
                        }`}
                      >
                        {row.key === "film"
                          ? `1 film · ${Math.round(product.film.duration)}s`
                          : `${row.stills.length} visuals`}
                      </span>
                    </span>
                    {/* Collapsed preview strip */}
                    {!isOpen && row.key !== "film" && (
                      <span className="flex gap-1">
                        {row.stills.slice(0, 3).map((s) => (
                          <span
                            key={s.id}
                            className="block h-12 w-9 overflow-hidden rounded-sm opacity-80"
                          >
                            <Image
                              src={s.src}
                              alt=""
                              width={36}
                              height={64}
                              sizes="36px"
                              className="h-full w-full object-cover"
                            />
                          </span>
                        ))}
                      </span>
                    )}
                    {!isOpen && row.key === "film" && (
                      <span className="block h-12 w-9 overflow-hidden rounded-sm opacity-80">
                        <Image
                          src={product.film.poster}
                          alt=""
                          width={36}
                          height={64}
                          sizes="36px"
                          className="h-full w-full object-cover"
                        />
                      </span>
                    )}
                    {isOpen && (
                      <motion.span
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 45 }}
                        transition={SPRING.snappy}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-ivory/25 text-ivory"
                      >
                        <svg width="11" height="11" viewBox="0 0 10 10" fill="none" aria-hidden>
                          <path d="M5 0v10M0 5h10" stroke="currentColor" strokeWidth="1.1" />
                        </svg>
                      </motion.span>
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={SPRING.spatial}
                        className="overflow-hidden"
                      >
                        {row.key === "film" ? (
                          <div className="px-4 pb-5">
                            <FilmPlayer
                              film={product.film}
                              label={`${product.client} — film`}
                              className="aspect-[9/16] max-h-[70svh] rounded-md"
                            />
                          </div>
                        ) : (
                          <CategoryDeck
                            key={`${slug}-${row.key}`}
                            stills={row.stills}
                            onZoom={(i) => setZoom({ list: row.stills, index: i })}
                          />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </section>
        </motion.div>
      </AnimatePresence>

      <Fade className="mt-12 px-5">
        <div className="hairline border-t pt-5">
          <p className="font-display text-2xl leading-snug">
            One system.
            <br />
            <span className="text-brass-2">Built for 200+ products.</span>
          </p>
          <p className="mt-3 max-w-sm text-[13.5px] leading-relaxed text-ink/55">
            Every product carries the same four categories. Switch above —
            the structure holds, only the worlds change.
          </p>
        </div>
      </Fade>

      <Viewer
        still={zoom ? zoom.list[zoom.index] : null}
        onClose={() => setZoom(null)}
        onPrev={
          zoom && zoom.index > 0
            ? () => setZoom({ ...zoom, index: zoom.index - 1 })
            : undefined
        }
        onNext={
          zoom && zoom.index < zoom.list.length - 1
            ? () => setZoom({ ...zoom, index: zoom.index + 1 })
            : undefined
        }
        index={zoom?.index}
        count={zoom?.list.length}
        meta={product.name}
      />
    </div>
  );
}

function CategoryDeck({
  stills,
  onZoom,
}: {
  stills: StillType[];
  onZoom: (index: number) => void;
}) {
  const [active, setActive] = useState(0);
  return (
    <div className="pb-5">
      <Deck
        slideWidth="72%"
        onSelect={setActive}
        controls={({ prev, next, index, count }) => (
          <div className="mt-4 px-4">
            <div className="flex items-start justify-between gap-3">
              <motion.p
                key={active}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={T.ui}
                className="font-display min-h-6 text-lg text-ivory"
              >
                {stills[active]?.caption}
              </motion.p>
              <button
                type="button"
                aria-label="Zoom image"
                onClick={() => onZoom(active)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ivory/25 text-ivory"
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.1" />
                  <path d="m10 10 3 3M6 4v4M4 6h4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <DeckControls
              prev={prev}
              next={next}
              index={index}
              count={count}
              className="mt-2"
            />
          </div>
        )}
      >
        {stills.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onZoom(i)}
            className="block aspect-[9/16] w-full cursor-zoom-in overflow-hidden rounded-md"
          >
            <Still still={s} sizes="72vw" />
          </button>
        ))}
      </Deck>
    </div>
  );
}
