"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "motion/react";
import { products, type Product, type Still as StillType } from "@/lib/products";
import { Still } from "@/components/media/Still";
import { Wordmark } from "@/components/navigation/Wordmark";
import { T, SPRING } from "@/lib/motion";

const SLIDE_MS = 3200;

interface Chapter {
  key: string;
  label: string;
  stills: StillType[];
  isFilm?: boolean;
}

function chaptersFor(p: Product): Chapter[] {
  const chapters: Chapter[] = [];
  const source = p.stills.filter((s) => s.cat === "source");
  const studio = p.stills.filter((s) => s.cat === "studio" && s.grade === "A");
  const lifestyle = p.stills.filter((s) => s.cat === "lifestyle" && s.grade === "A");
  const campaign = p.stills.filter((s) => s.cat === "campaign" && s.grade === "A");
  if (source.length) chapters.push({ key: "source", label: "Source", stills: source.slice(0, 4) });
  if (studio.length) chapters.push({ key: "studio", label: "Studio", stills: studio.slice(0, 4) });
  const life = [...lifestyle, ...campaign];
  if (life.length) chapters.push({ key: "lifestyle", label: "Lifestyle", stills: life.slice(0, 6) });
  chapters.push({ key: "film", label: "Film", stills: [], isFilm: true });
  return chapters;
}

export function Player() {
  const [slug, setSlug] = useState("rattan");
  const product = products.find((p) => p.slug === slug)!;
  const chapters = useMemo(() => chaptersFor(product), [product]);

  const [chapterIdx, setChapterIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const reduced = useReducedMotion();

  const chapter = chapters[Math.min(chapterIdx, chapters.length - 1)];
  const fill = useMotionValue(0);
  const controlsRef = useRef<AnimationPlaybackControls | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const held = useRef(false);

  const goTo = useCallback(
    (c: number, s = 0) => {
      const ci = ((c % chapters.length) + chapters.length) % chapters.length;
      setChapterIdx(ci);
      setSlideIdx(s);
      fill.set(0);
    },
    [chapters.length, fill],
  );

  const advance = useCallback(() => {
    const ch = chapters[chapterIdx];
    if (!ch.isFilm && slideIdx < ch.stills.length - 1) {
      setSlideIdx((i) => i + 1);
      fill.set(0);
    } else {
      goTo(chapterIdx + 1);
    }
  }, [chapters, chapterIdx, slideIdx, goTo, fill]);

  const rewind = useCallback(() => {
    if (slideIdx > 0) {
      setSlideIdx((i) => i - 1);
      fill.set(0);
    } else if (chapterIdx > 0) {
      const prevCh = chapters[chapterIdx - 1];
      goTo(chapterIdx - 1, prevCh.isFilm ? 0 : Math.max(prevCh.stills.length - 1, 0));
    } else {
      fill.set(0);
    }
  }, [slideIdx, chapterIdx, chapters, goTo, fill]);

  // Autoplay engine for still chapters
  useEffect(() => {
    controlsRef.current?.stop();
    if (chapter.isFilm) return; // video drives its own progress
    if (reduced || paused || drawerOpen) return;
    fill.set(0);
    const controls = animate(fill, 1, {
      duration: SLIDE_MS / 1000,
      ease: "linear",
      onComplete: advance,
    });
    controlsRef.current = controls;
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterIdx, slideIdx, slug, paused, drawerOpen, reduced, chapter.isFilm]);

  // Film chapter: play/pause video with state
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !chapter.isFilm) return;
    if (paused || drawerOpen) v.pause();
    else v.play().catch(() => {});
  }, [paused, drawerOpen, chapter.isFilm, chapterIdx]);

  const onTapStart = () => {
    held.current = false;
    holdTimer.current = setTimeout(() => {
      held.current = true;
      setPaused(true);
    }, 220);
  };

  const clearHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
  };

  const onTap = (e: MouseEvent | TouchEvent | PointerEvent) => {
    clearHold();
    if (held.current) {
      setPaused(false);
      return;
    }
    const x =
      "clientX" in e ? e.clientX : (e as TouchEvent).changedTouches?.[0]?.clientX ?? 0;
    if (x < window.innerWidth * 0.34) rewind();
    else advance();
  };

  const onTapCancel = () => {
    clearHold();
    if (held.current) setPaused(false);
  };

  const switchProduct = (next: string) => {
    setDrawerOpen(false);
    if (next === slug) return;
    setSlug(next);
    setChapterIdx(0);
    setSlideIdx(0);
    fill.set(0);
  };

  const still = chapter.isFilm ? null : chapter.stills[Math.min(slideIdx, chapter.stills.length - 1)];

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-ink text-ivory md:inset-x-auto md:left-1/2 md:w-[460px] md:-translate-x-1/2 md:border-x md:border-ivory/10">
      {/* Media stage */}
      <motion.div
        className="absolute inset-0"
        onTapStart={onTapStart}
        onTap={onTap}
        onTapCancel={onTapCancel}
        onPanEnd={(_, info) => {
          clearHold();
          if (info.offset.x < -70) goTo(chapterIdx + 1);
          else if (info.offset.x > 70) goTo(chapterIdx - 1);
        }}
      >
        <AnimatePresence initial={false}>
          {chapter.isFilm ? (
            <motion.div
              key={`film-${slug}`}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={T.reveal}
              className="absolute inset-0"
            >
              <video
                ref={videoRef}
                src={product.film.src}
                poster={product.film.poster}
                muted
                playsInline
                autoPlay={!reduced}
                preload="auto"
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  if (v.duration) fill.set(v.currentTime / v.duration);
                }}
                onEnded={() => goTo(0)}
                className="h-full w-full object-cover"
              />
            </motion.div>
          ) : (
            still && (
              <motion.div
                key={still.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={T.reveal}
                className="absolute inset-0"
              >
                <Still still={still} sizes="100vw" priority />
              </motion.div>
            )
          )}
        </AnimatePresence>
        {/* Legibility gradients */}
        <span className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-ink/75 to-transparent" />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink/80 to-transparent" />
      </motion.div>

      {/* Top chrome */}
      <div className="relative z-10 px-5 pt-[max(1.1rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <Wordmark />
          <span className="label-wide text-ivory/45">Concept 04</span>
        </div>

        {/* Segmented progress */}
        <div className="mt-4 flex gap-1.5">
          {chapters.map((c, i) => (
            <div key={c.key} className="h-[3px] flex-1 overflow-hidden rounded-full bg-ivory/20">
              {i < chapterIdx ? (
                <div className="h-full w-full bg-ivory/90" />
              ) : i === chapterIdx ? (
                <ChapterFill
                  fill={fill}
                  slideIdx={slideIdx}
                  slideCount={c.isFilm ? 1 : c.stills.length}
                />
              ) : null}
            </div>
          ))}
        </div>

        {/* Chapter labels */}
        <div className="mt-3 flex gap-5">
          {chapters.map((c, i) => (
            <button
              key={c.key}
              type="button"
              onClick={() => goTo(i)}
              className={`label cursor-pointer transition-colors duration-300 ${
                i === chapterIdx ? "text-brass" : "text-ivory/45"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom chrome */}
      <div className="relative z-10 mt-auto px-5 pb-[max(4.6rem,calc(env(safe-area-inset-bottom)+3.9rem))]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${slug}-${chapter.key}-${slideIdx}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={T.ui}
          >
            <p className="label-wide text-brass">
              {product.client}
            </p>
            <p className="font-display mt-1.5 text-2xl leading-tight">
              {chapter.isFilm ? `${product.name} — the film` : still?.caption}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 flex items-center justify-between">
          <span className="label text-ivory/45 tabular-nums">
            {chapter.isFilm
              ? `${Math.round(product.film.duration)}s film`
              : `${slideIdx + 1} / ${chapter.stills.length}`}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={paused ? "Resume" : "Pause"}
              onClick={() => setPaused((p) => !p)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/25 bg-ink/35 backdrop-blur-sm"
            >
              {paused ? (
                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden>
                  <path d="M1.5 1.3v11.4c0 .6.7 1 1.2.7l9-5.7c.5-.3.5-1 0-1.4l-9-5.7c-.5-.3-1.2 0-1.2.7Z" fill="currentColor" />
                </svg>
              ) : (
                <svg width="10" height="14" viewBox="0 0 10 14" fill="none" aria-hidden>
                  <path d="M1 1v12M9 1v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              )}
            </button>
            <button
              type="button"
              aria-label="Choose product"
              onClick={() => setDrawerOpen(true)}
              className="flex h-10 items-center gap-2 rounded-full border border-ivory/25 bg-ink/35 px-4 backdrop-blur-sm"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <rect x="0.5" y="0.5" width="4.4" height="4.4" stroke="currentColor" />
                <rect x="7.1" y="0.5" width="4.4" height="4.4" stroke="currentColor" />
                <rect x="0.5" y="7.1" width="4.4" height="4.4" stroke="currentColor" />
                <rect x="7.1" y="7.1" width="4.4" height="4.4" stroke="currentColor" />
              </svg>
              <span className="label">Products</span>
            </button>
          </div>
        </div>
        <p className="label mt-3 text-center text-[9px] text-ivory/30">
          Tap sides to step · hold to pause · swipe for chapters
        </p>
      </div>

      {/* Product drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close product drawer"
              className="absolute inset-0 z-20 bg-ink/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              className="absolute inset-x-0 bottom-0 z-30 rounded-t-2xl bg-ink-2 px-5 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={SPRING.soft}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.4 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 90) setDrawerOpen(false);
              }}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ivory/20" />
              <p className="label-wide text-ivory/50">Choose a product</p>
              <div className="mt-4 grid grid-cols-5 gap-2.5">
                {products.map((p) => (
                  <button
                    key={p.slug}
                    type="button"
                    aria-label={p.name}
                    onClick={() => switchProduct(p.slug)}
                    className={`relative overflow-hidden rounded-md ${
                      p.slug === slug ? "ring-1 ring-brass" : "opacity-70"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.film.poster}
                      alt=""
                      className="aspect-[3/4] w-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
              <p className="font-display mt-4 text-lg">{product.name}</p>
              <p className="label mt-1 text-ivory/45">
                {product.client} · {product.total} assets
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChapterFill({
  fill,
  slideIdx,
  slideCount,
}: {
  fill: ReturnType<typeof useMotionValue<number>>;
  slideIdx: number;
  slideCount: number;
}) {
  // Segment fill = completed slides + current slide progress
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = (v: number) => {
      const total = slideCount > 0 ? (slideIdx + v) / slideCount : v;
      if (ref.current) ref.current.style.transform = `scaleX(${total})`;
    };
    update(fill.get());
    const unsub = fill.on("change", update);
    return unsub;
  }, [fill, slideIdx, slideCount]);
  return (
    <div
      ref={ref}
      className="h-full w-full origin-left bg-brass"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
