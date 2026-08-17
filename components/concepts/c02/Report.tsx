"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { getProduct, sortForDisplay, type Still as StillType } from "@/lib/products";
import { Still } from "@/components/media/Still";
import { Viewer } from "@/components/media/Viewer";
import { FilmPlayer } from "@/components/media/FilmPlayer";
import { Counter } from "@/components/concepts/c02/Counter";
import { ClipReveal, Fade, Lines } from "@/components/motion/Reveal";
import { Wordmark } from "@/components/navigation/Wordmark";

const SECTIONS = [
  { id: "source", label: "Source", heading: "What arrived" },
  { id: "studio", label: "Studio", heading: "Studio details" },
  { id: "lifestyle", label: "Lifestyle", heading: "Lifestyle worlds" },
  { id: "campaign", label: "Campaign", heading: "Campaign" },
  { id: "film", label: "Film", heading: "The film" },
] as const;

export function Report() {
  const product = getProduct("dunstone");
  const [viewerState, setViewerState] = useState<{
    list: StillType[];
    index: number;
  } | null>(null);
  const [activeSection, setActiveSection] = useState("source");

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 32,
  });

  const groups = useMemo(() => {
    const bySec: Record<string, StillType[]> = {};
    for (const s of product.stills) {
      (bySec[s.cat] ??= []).push(s);
    }
    for (const key of Object.keys(bySec)) {
      if (key !== "source") bySec[key] = sortForDisplay(bySec[key]);
    }
    return bySec;
  }, [product]);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveSection(e.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    Object.values(sectionRefs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const open = (list: StillType[], index: number) =>
    setViewerState({ list, index });

  const current = viewerState
    ? viewerState.list[viewerState.index]
    : null;

  return (
    <div className="min-h-svh bg-ivory pb-28 text-ink">
      <div className="mx-auto w-full max-w-[600px]">
      <header className="flex items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <Wordmark tone="light" />
        <span className="label-wide text-ink/40">Concept 02</span>
      </header>

      {/* Title block */}
      <section className="px-5 pt-12">
        <p className="label-wide text-brass-2">Project delivery</p>
        <Lines
          as="h1"
          lines={["Heritage Timber", "Collection"]}
          className="font-display mt-3 text-[10.5vw] leading-[1.04] sm:text-5xl"
        />
        <Fade delay={0.2} className="hairline mt-6 grid grid-cols-2 gap-y-4 border-t pt-5">
          <div>
            <p className="label text-ink/40">Client</p>
            <p className="mt-1 text-[14px]">{product.client}</p>
          </div>
          <div>
            <p className="label text-ink/40">Pieces</p>
            <p className="mt-1 text-[14px]">Console · mirror · bar chair</p>
          </div>
          <div>
            <p className="label text-ink/40">Received</p>
            <p className="mt-1 text-[14px]">3 warehouse references</p>
          </div>
          <div>
            <p className="label text-ink/40">Delivered</p>
            <p className="mt-1 text-[14px]">{product.total} finished assets</p>
          </div>
        </Fade>
      </section>

      {/* Headline metrics */}
      <section className="mt-10 px-5">
        <div className="hairline flex items-end justify-between rounded-md border bg-cream/60 px-5 py-6">
          <div>
            <p className="font-display text-5xl">
              <Counter value={3} />
            </p>
            <p className="label mt-1 text-ink/50">sources in</p>
          </div>
          <svg width="44" height="12" viewBox="0 0 44 12" fill="none" className="mb-4 text-brass-2" aria-hidden>
            <path d="M0 6h42m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1" />
          </svg>
          <div className="text-right">
            <p className="font-display text-5xl text-brass-2">
              <Counter value={product.total} />
            </p>
            <p className="label mt-1 text-ink/50">assets out</p>
          </div>
        </div>
      </section>

      {/* Sticky section rail */}
      <div className="sticky top-0 z-30 mt-10 bg-ivory/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-5 py-3">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`label transition-colors duration-300 ${
                activeSection === s.id ? "text-brass-2" : "text-ink/35"
              }`}
            >
              {s.label}
            </a>
          ))}
        </div>
        <motion.div
          className="h-px origin-left bg-brass-2"
          style={{ scaleX: progress }}
        />
        <div className="hairline border-t" />
      </div>

      {/* SOURCE */}
      <section
        id="source"
        ref={(el) => {
          sectionRefs.current.source = el;
        }}
        className="scroll-mt-24 px-5 pt-12"
      >
        <SectionHeading
          index="01"
          heading="What arrived"
          note={`${groups.source?.length ?? 0} references — photographed as-is`}
        />
        <div className="mt-6 flex flex-col gap-5">
          {groups.source?.map((s, i) => (
            <ClipReveal key={s.id}>
              <MediaCell
                still={s}
                onOpen={() => open(groups.source, i)}
                aspect="aspect-[4/5]"
                sizes="92vw"
                captionTone="light"
              />
            </ClipReveal>
          ))}
        </div>
        <Fade className="mt-5">
          <p className="max-w-sm text-[14px] leading-relaxed text-ink/55">
            No staging, no lighting, no retouching. This is the entire brief we
            were given — and it is enough.
          </p>
        </Fade>
      </section>

      {/* STUDIO */}
      <section
        id="studio"
        ref={(el) => {
          sectionRefs.current.studio = el;
        }}
        className="scroll-mt-24 px-5 pt-16"
      >
        <SectionHeading
          index="02"
          heading="Studio details"
          note={`${groups.studio?.length ?? 0} controlled frames`}
        />
        <div className="mt-6 grid grid-cols-2 gap-4">
          {groups.studio?.map((s, i) => {
            const feature = i % 3 === 0;
            return (
              <ClipReveal
                key={s.id}
                delay={(i % 2) * 0.07}
                className={feature ? "col-span-2" : ""}
              >
                <MediaCell
                  still={s}
                  onOpen={() => open(groups.studio, i)}
                  aspect={feature ? "aspect-[4/5]" : "aspect-[3/4]"}
                  sizes={feature ? "92vw" : "45vw"}
                />
              </ClipReveal>
            );
          })}
        </div>
      </section>

      {/* Pull quote */}
      <section className="px-5 pt-16">
        <Fade>
          <p className="font-display text-[26px] leading-snug text-ink">
            “The pieces never left the warehouse.
            <span className="text-brass-2"> The worlds came to them.”</span>
          </p>
        </Fade>
      </section>

      {/* LIFESTYLE */}
      <section
        id="lifestyle"
        ref={(el) => {
          sectionRefs.current.lifestyle = el;
        }}
        className="scroll-mt-24 px-5 pt-16"
      >
        <SectionHeading
          index="03"
          heading="Lifestyle worlds"
          note={`${groups.lifestyle?.length ?? 0} scenes across three pieces`}
        />
        <div className="mt-6 grid grid-cols-2 gap-4">
          {groups.lifestyle?.map((s, i) => {
            const feature = s.grade === "A" && i % 5 === 0;
            return (
              <ClipReveal
                key={s.id}
                delay={(i % 2) * 0.07}
                className={feature ? "col-span-2" : ""}
              >
                <MediaCell
                  still={s}
                  onOpen={() => open(groups.lifestyle, i)}
                  aspect={feature ? "aspect-[4/5]" : "aspect-[3/4]"}
                  sizes={feature ? "92vw" : "46vw"}
                />
              </ClipReveal>
            );
          })}
        </div>
      </section>

      {/* CAMPAIGN */}
      <section
        id="campaign"
        ref={(el) => {
          sectionRefs.current.campaign = el;
        }}
        className="scroll-mt-24 px-5 pt-16"
      >
        <SectionHeading
          index="04"
          heading="Campaign"
          note={`${groups.campaign?.length ?? 0} editorial frames`}
        />
        <div className="mt-6 flex flex-col gap-5">
          {groups.campaign?.map((s, i) => (
            <ClipReveal key={s.id}>
              <MediaCell
                still={s}
                onOpen={() => open(groups.campaign, i)}
                aspect="aspect-[4/5]"
                sizes="92vw"
              />
            </ClipReveal>
          ))}
        </div>
      </section>

      {/* FILM */}
      <section
        id="film"
        ref={(el) => {
          sectionRefs.current.film = el;
        }}
        className="scroll-mt-24 px-5 pt-16"
      >
        <SectionHeading index="05" heading="The film" note="23 seconds · 1080 × 1920" />
        <ClipReveal className="mt-6">
          <FilmPlayer
            film={product.film}
            label="Dunstone Design — collection film"
            className="aspect-[9/16] max-h-[76svh] rounded-md"
          />
        </ClipReveal>
      </section>

      <footer className="mt-16 px-5">
        <div className="hairline border-t pt-6">
          <p className="font-display text-2xl leading-snug">
            Three pieces arrived on a truck.
            <br />
            <span className="text-brass-2">A collection left as a campaign.</span>
          </p>
          <p className="label mt-6 text-ink/40">
            Daffy Studio — deliverables report
          </p>
        </div>
      </footer>
      </div>

      <Viewer
        still={current}
        onClose={() => setViewerState(null)}
        onPrev={
          viewerState && viewerState.index > 0
            ? () =>
                setViewerState({
                  ...viewerState,
                  index: viewerState.index - 1,
                })
            : undefined
        }
        onNext={
          viewerState && viewerState.index < viewerState.list.length - 1
            ? () =>
                setViewerState({
                  ...viewerState,
                  index: viewerState.index + 1,
                })
            : undefined
        }
        index={viewerState?.index}
        count={viewerState?.list.length}
        meta={product.client}
      />
    </div>
  );
}

function SectionHeading({
  index,
  heading,
  note,
}: {
  index: string;
  heading: string;
  note: string;
}) {
  return (
    <div className="hairline border-t pt-4">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-brass-2">{index}</span>
        <Lines
          as="h2"
          lines={[heading]}
          className="font-display text-3xl leading-tight"
        />
      </div>
      <p className="label mt-2 text-ink/45">{note}</p>
    </div>
  );
}

function MediaCell({
  still,
  onOpen,
  aspect,
  sizes,
  captionTone = "none",
}: {
  still: StillType;
  onOpen: () => void;
  aspect: string;
  sizes: string;
  captionTone?: "light" | "none";
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${still.caption}`}
      className="group relative block w-full cursor-zoom-in overflow-hidden rounded-sm text-left"
    >
      <div className={`${aspect} overflow-hidden`}>
        <Still
          still={still}
          sizes={sizes}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      {captionTone === "light" && (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-3 pt-12 pb-2.5">
          <span className="label text-ivory/85">{still.caption}</span>
        </span>
      )}
    </button>
  );
}
