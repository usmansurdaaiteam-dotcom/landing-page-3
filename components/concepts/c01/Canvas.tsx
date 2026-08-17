"use client";

import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { products, stillById, stagesFor } from "@/lib/products";
import { ProductRail } from "@/components/product/ProductRail";
import { TransformWipe } from "@/components/concepts/c01/TransformWipe";
import { StagePanel } from "@/components/concepts/c01/StagePanel";
import { Lines, Fade } from "@/components/motion/Reveal";
import { Wordmark } from "@/components/navigation/Wordmark";
import { T } from "@/lib/motion";

export function Canvas() {
  const [slug, setSlug] = useState("eclipse");
  const product = products.find((p) => p.slug === slug)!;
  const stages = stagesFor(product);
  const [openStage, setOpenStage] = useState<string>("studio");

  const effectiveOpen = stages.some((s) => s.cat === openStage)
    ? openStage
    : stages.find((s) => s.cat !== "source")?.cat ?? stages[0].cat;

  const raw = stillById(product, product.rawHero);
  const finished = stillById(product, product.hero);
  const finishedCount = product.stills.filter((s) => s.cat !== "source").length + 1;
  const sourceCount = product.counts.source ?? 0;

  const switchProduct = (next: string) => {
    if (next === slug) return;
    setSlug(next);
    setOpenStage("studio");
  };

  return (
    <div className="min-h-svh bg-ink pb-28 text-ivory">
      <div className="mx-auto w-full max-w-[600px]">
      <header className="flex items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <Wordmark />
        <span className="label-wide text-ivory/40">Concept 01</span>
      </header>

      <section className="px-5 pt-10">
        <Lines
          as="h1"
          lines={["One product.", "Many worlds."]}
          className="font-display text-[11vw] leading-[1.04] sm:text-5xl"
        />
        <Fade delay={0.2}>
          <p className="mt-4 max-w-sm text-[14.5px] leading-relaxed text-ivory/60">
            Tap a stage. The canvas gives it room — everything else waits,
            still visible, still in order.
          </p>
        </Fade>
      </section>

      <div className="sticky top-0 z-30 -mx-0 mt-6 bg-ink/85 backdrop-blur-md">
        <ProductRail
          products={products}
          active={slug}
          onSelect={switchProduct}
          id="c01"
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={slug}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={T.reveal}
        >
          <section className="px-5 pt-6">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-2xl leading-tight">
                {product.name}
              </h2>
              <span className="label shrink-0 text-ivory/40">
                {product.client}
              </span>
            </div>
            <p className="label mt-1.5 text-ivory/45">{product.material}</p>

            <TransformWipe raw={raw} finished={finished} className="mt-5" />

            <Fade className="mt-7 flex items-center gap-4">
              <div>
                <p className="font-display text-2xl text-ivory">{sourceCount}</p>
                <p className="label mt-0.5 text-ivory/45">references in</p>
              </div>
              <svg width="34" height="10" viewBox="0 0 34 10" fill="none" className="text-brass" aria-hidden>
                <path d="M0 5h32m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1" />
              </svg>
              <div>
                <p className="font-display text-2xl text-brass">{finishedCount}</p>
                <p className="label mt-0.5 text-ivory/45">finished assets out</p>
              </div>
            </Fade>
          </section>

          <section className="mt-8 px-5">
            <LayoutGroup id={`canvas-${slug}`}>
              <div className="flex flex-col gap-2.5">
                {stages.map((stage) => (
                  <StagePanel
                    key={stage.cat}
                    num={stage.num}
                    label={
                      stage.cat === "source"
                        ? "Raw source"
                        : stage.cat === "studio"
                          ? "Studio output"
                          : stage.cat === "lifestyle"
                            ? "Lifestyle worlds"
                            : stage.cat === "campaign"
                              ? "Campaign"
                              : "Film"
                    }
                    count={
                      stage.cat === "film" ? 1 : (product.counts[stage.cat] ?? 0)
                    }
                    open={effectiveOpen === stage.cat}
                    onToggle={() =>
                      setOpenStage(
                        effectiveOpen === stage.cat && stage.cat !== "source"
                          ? "source"
                          : stage.cat,
                      )
                    }
                    product={product}
                    cat={stage.cat}
                  />
                ))}
              </div>
            </LayoutGroup>
          </section>
        </motion.div>
      </AnimatePresence>

      <footer className="mt-16 px-5">
        <p className="label text-ivory/35">
          Swipe the rail above — every product carries its own worlds.
        </p>
      </footer>
      </div>
    </div>
  );
}
