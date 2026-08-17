"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { SPRING } from "@/lib/motion";
import type { Product } from "@/lib/products";

/**
 * P11 — Product switcher rail.
 * Horizontal thumb rail; the active marker springs between products
 * (layoutId). Built for hundreds of products: it's just a scrollable list.
 */
export function ProductRail({
  products,
  active,
  onSelect,
  tone = "dark",
  id = "rail",
  className = "",
}: {
  products: Product[];
  active: string;
  onSelect: (slug: string) => void;
  tone?: "dark" | "light";
  id?: string;
  className?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  const ring = tone === "dark" ? "ring-brass" : "ring-ink";
  const dim = tone === "dark" ? "opacity-55" : "opacity-45";

  return (
    <div
      ref={scrollerRef}
      role="tablist"
      aria-label="Products"
      className={`no-scrollbar flex gap-2.5 overflow-x-auto px-5 py-2 ${className}`}
      style={{ scrollSnapType: "x proximity" }}
    >
      {products.map((p) => {
        const isActive = p.slug === active;
        return (
          <button
            key={p.slug}
            ref={isActive ? activeRef : undefined}
            role="tab"
            aria-selected={isActive}
            aria-label={p.name}
            onClick={() => onSelect(p.slug)}
            className="relative shrink-0 cursor-pointer"
            style={{ scrollSnapAlign: "center" }}
          >
            <motion.span
              animate={{ scale: isActive ? 1 : 0.92 }}
              transition={SPRING.snappy}
              className={`block h-[72px] w-[58px] overflow-hidden rounded-lg ${
                isActive ? "" : dim
              }`}
            >
              <Image
                src={p.film.poster}
                alt=""
                width={116}
                height={144}
                sizes="58px"
                className="h-full w-full object-cover"
              />
            </motion.span>
            {isActive && (
              <motion.span
                layoutId={`${id}-marker`}
                transition={SPRING.snappy}
                className={`pointer-events-none absolute -inset-[3px] rounded-[10px] ring-1 ${ring}`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
