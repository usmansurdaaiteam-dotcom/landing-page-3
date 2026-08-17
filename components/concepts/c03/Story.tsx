"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { getProduct, stillById } from "@/lib/products";
import { Still } from "@/components/media/Still";
import { FilmPlayer } from "@/components/media/FilmPlayer";
import { Deck, DeckControls } from "@/components/gallery/Deck";
import { ClipReveal, Fade, Lines } from "@/components/motion/Reveal";
import { Wordmark } from "@/components/navigation/Wordmark";
import { T } from "@/lib/motion";

const CHAPTERS = [
  { num: "01", label: "Source", note: "Warehouse floor. Phone light. As received." },
  { num: "02", label: "Studio", note: "Isolated, corrected, made precise." },
  { num: "03", label: "Lifestyle", note: "The same stool, given a world." },
  { num: "04", label: "Motion", note: "And then the world moves." },
];

export function Story() {
  const product = getProduct("homecoze");
  const raw = stillById(product, "homecoze-00");
  const studio = stillById(product, "homecoze-13");
  const lifestyle = stillById(product, "homecoze-10");
  const reduced = useReducedMotion();

  const seqRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: seqRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  // Chapter boundaries across the 400svh sequence
  const wipe = useTransform(
    p,
    [0.16, 0.34],
    ["inset(0 0 0 100%)", "inset(0 0 0 0%)"],
  );
  const studioOpacity = useTransform(p, [0.16, 0.3], [0, 1]);
  const lifeOpacity = useTransform(p, [0.44, 0.58], [0, 1]);
  const lifeScale = useTransform(p, [0.44, 0.72], [1.14, 1]);
  const filmOpacity = useTransform(p, [0.74, 0.86], [0, 1]);
  const railScale = scrollYProgress;

  const [chapter, setChapter] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = v < 0.2 ? 0 : v < 0.5 ? 1 : v < 0.78 ? 2 : 3;
    if (next !== chapter) setChapter(next);
  });

  const deckStills = product.stills.filter((s) => s.grade === "A");

  return (
    <div className="min-h-svh bg-ink pb-28 text-ivory">
      <div className="mx-auto w-full max-w-[600px]">
      <header className="flex items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <Wordmark />
        <span className="label-wide text-ivory/40">Concept 03</span>
      </header>

      {/* Intro */}
      <section className="px-5 pt-14 pb-10">
        <p className="label-wide text-brass">A transformation, told in order</p>
        <Lines
          as="h1"
          lines={["From source", "to story."]}
          className="font-display mt-4 text-[13vw] leading-[1.02] sm:text-6xl"
        />
        <Fade delay={0.25} className="mt-6 max-w-sm">
          <p className="text-[15px] leading-relaxed text-ivory/65">
            One bar stool for {product.client}. It arrived on concrete.
            Keep scrolling — your thumb does the transformation.
          </p>
        </Fade>
        <Fade delay={0.4} className="mt-10 flex items-center gap-3 text-ivory/40">
          <motion.svg
            width="12"
            height="18"
            viewBox="0 0 12 18"
            fill="none"
            aria-hidden
            animate={reduced ? undefined : { y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          >
            <path d="M6 1v15m0 0 5-5m-5 5-5-5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
          <span className="label">Scroll</span>
        </Fade>
      </section>

      {/* Sticky narrative sequence */}
      <div ref={seqRef} className="relative h-[420svh]">
        <div className="sticky top-0 h-svh overflow-hidden">
          {/* 01 — Raw */}
          <div className="absolute inset-0">
            <Still still={raw} sizes="100vw" priority />
            <span className="absolute inset-0 bg-ink/15" />
          </div>

          {/* 02 — Studio wipes over */}
          <motion.div
            className="absolute inset-0"
            style={
              reduced
                ? { opacity: studioOpacity }
                : { clipPath: wipe, willChange: "clip-path" }
            }
          >
            <Still still={studio} sizes="100vw" />
          </motion.div>

          {/* 03 — Lifestyle world grows */}
          <motion.div
            className="absolute inset-0"
            style={{ opacity: lifeOpacity }}
          >
            <motion.div
              className="h-full w-full"
              style={reduced ? undefined : { scale: lifeScale }}
            >
              <Still still={lifestyle} sizes="100vw" />
            </motion.div>
          </motion.div>

          {/* 04 — Film */}
          <motion.div
            className="absolute inset-0"
            style={{ opacity: filmOpacity }}
          >
            <FilmPlayer
              film={product.film}
              label={`${product.client} — product film`}
              className="h-full"
            />
          </motion.div>

          {/* Progress rail */}
          <div className="pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2">
            <div className="flex flex-col gap-5">
              {CHAPTERS.map((c, i) => (
                <div key={c.num} className="flex items-center gap-2.5">
                  <span
                    className={`font-display text-sm tabular-nums transition-colors duration-500 ${
                      chapter === i ? "text-brass" : "text-ivory/35"
                    }`}
                  >
                    {c.num}
                  </span>
                  <span
                    className={`label transition-all duration-500 ${
                      chapter === i
                        ? "translate-x-0 text-ivory opacity-100"
                        : "-translate-x-1 text-ivory/40 opacity-0"
                    }`}
                  >
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute top-0 -left-2 h-full w-px bg-ivory/15">
              <motion.div
                className="w-px origin-top bg-brass"
                style={{ scaleY: railScale, height: "100%" }}
              />
            </div>
          </div>

          {/* Chapter caption */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-5 pt-20 pb-8">
            <motion.div
              key={chapter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={T.reveal}
            >
              <p className="label-wide text-brass">
                {CHAPTERS[chapter].num} — {CHAPTERS[chapter].label}
              </p>
              <p className="font-display mt-2 text-2xl leading-snug text-ivory">
                {CHAPTERS[chapter].note}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Every frame deck */}
      <section className="pt-16">
        <div className="px-5">
          <Lines
            as="h2"
            lines={["Every frame,", "full size."]}
            className="font-display text-4xl leading-[1.05]"
          />
          <Fade className="mt-3">
            <p className="max-w-sm text-[14px] leading-relaxed text-ivory/60">
              {deckStills.length} finished scenes from one reference. Swipe
              through the set.
            </p>
          </Fade>
        </div>
        <DeckSection stills={deckStills} />
      </section>

      {/* Full film */}
      <section className="mt-16 px-5">
        <div className="hairline border-t pt-5">
          <p className="label-wide text-brass">The film</p>
          <p className="font-display mt-2 text-3xl">16 seconds of proof.</p>
        </div>
        <ClipReveal className="mt-6">
          <FilmPlayer
            film={product.film}
            label={`${product.client} — product film`}
            className="aspect-[9/16] max-h-[78svh] rounded-md"
          />
        </ClipReveal>
      </section>

      <footer className="mt-16 px-5">
        <p className="label text-ivory/35">
          Daffy Studio — source to story
        </p>
      </footer>
      </div>
    </div>
  );
}

function DeckSection({
  stills,
}: {
  stills: ReturnType<typeof getProduct>["stills"];
}) {
  const [active, setActive] = useState(0);
  return (
    <div className="mt-8">
      <Deck
        slideWidth="74%"
        onSelect={setActive}
        controls={({ prev, next, index, count }) => (
          <div className="mt-5 px-5">
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={T.ui}
              className="font-display min-h-7 text-xl text-ivory"
            >
              {stills[active]?.caption}
            </motion.p>
            <DeckControls
              prev={prev}
              next={next}
              index={index}
              count={count}
              className="mt-3"
            />
          </div>
        )}
      >
        {stills.map((s) => (
          <div key={s.id} className="aspect-[9/16] overflow-hidden rounded-md">
            <Still still={s} sizes="74vw" />
          </div>
        ))}
      </Deck>
    </div>
  );
}
