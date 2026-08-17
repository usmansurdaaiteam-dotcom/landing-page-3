"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";

/**
 * P4 — Center-weighted deck.
 * Active slide dominates (~74vw), neighbours peek in scaled + dimmed.
 * Scale/opacity are tweened straight to the DOM inside Embla's scroll event —
 * zero React re-renders per frame (per Embla maintainer guidance).
 */
export function Deck({
  children,
  slideWidth = "74%",
  gap = "4vw",
  onSelect,
  startIndex = 0,
  className = "",
  tweenScale = 0.09,
  tweenOpacity = 0.5,
  controls,
}: {
  children: ReactNode[];
  slideWidth?: string;
  gap?: string;
  onSelect?: (index: number) => void;
  startIndex?: number;
  className?: string;
  tweenScale?: number;
  tweenOpacity?: number;
  /** render prop for custom controls, receives api helpers */
  controls?: (h: {
    prev: () => void;
    next: () => void;
    index: number;
    count: number;
  }) => ReactNode;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: false,
    startIndex,
    skipSnaps: false,
  });
  const [index, setIndex] = useState(startIndex);
  const nodes = useRef<HTMLElement[]>([]);

  const tween = useCallback(
    (api: EmblaCarouselType) => {
      const engine = api.internalEngine();
      const scrollProgress = api.scrollProgress();
      api.scrollSnapList().forEach((snap, i) => {
        let diff = snap - scrollProgress;
        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((lp) => {
            if (lp.index === i) diff = snap - lp.target();
          });
        }
        const d = Math.min(Math.abs(diff * engine.slideRegistry.length), 1.6);
        const node = nodes.current[i];
        if (!node) return;
        node.style.transform = `scale(${1 - d * tweenScale})`;
        node.style.opacity = String(Math.max(1 - d * tweenOpacity, 0.25));
      });
    },
    [tweenScale, tweenOpacity],
  );

  useEffect(() => {
    if (!emblaApi) return;
    nodes.current = emblaApi
      .slideNodes()
      .map((n) => n.firstElementChild as HTMLElement);
    const handleSelect = () => {
      setIndex(emblaApi.selectedScrollSnap());
      onSelect?.(emblaApi.selectedScrollSnap());
    };
    tween(emblaApi);
    handleSelect();
    emblaApi
      .on("scroll", tween)
      .on("reInit", tween)
      .on("select", handleSelect);
    return () => {
      emblaApi.off("scroll", tween).off("reInit", tween).off("select", handleSelect);
    };
  }, [emblaApi, tween, onSelect]);

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className={className}>
      <div className="embla" ref={emblaRef}>
        <div className="embla__container" style={{ marginLeft: `calc(${gap} * -1)` }}>
          {children.map((child, i) => (
            <div
              key={i}
              className="embla__slide"
              style={{ flex: `0 0 ${slideWidth}`, paddingLeft: gap }}
            >
              <div
                style={{ willChange: "transform, opacity" }}
                className="transition-none"
              >
                {child}
              </div>
            </div>
          ))}
        </div>
      </div>
      {controls?.({ prev, next, index, count: children.length })}
    </div>
  );
}

/** Elegant hairline arrow buttons + counter used by most decks. */
export function DeckControls({
  prev,
  next,
  index,
  count,
  tone = "dark",
  className = "",
}: {
  prev: () => void;
  next: () => void;
  index: number;
  count: number;
  tone?: "dark" | "light";
  className?: string;
}) {
  const border =
    tone === "dark" ? "border-ivory/20 text-ivory" : "border-ink/20 text-ink";
  const dim = tone === "dark" ? "text-ivory/50" : "text-ink/50";
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span className={`label tabular-nums ${dim}`}>
        {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          aria-label="Previous"
          onClick={prev}
          className={`flex h-10 w-10 items-center justify-center rounded-full border ${border} transition-transform duration-150 active:scale-90`}
        >
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden>
            <path d="M6 1 1 6l5 5M1 6h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={next}
          className={`flex h-10 w-10 items-center justify-center rounded-full border ${border} transition-transform duration-150 active:scale-90`}
        >
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden>
            <path d="m10 1 5 5-5 5M15 6H1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
