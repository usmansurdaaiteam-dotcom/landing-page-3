"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { T, LINE_STAGGER } from "@/lib/motion";
import { useRef, type ReactNode } from "react";

/**
 * P1 — Cinematic image reveal.
 * Clip-path rises + child settles from a restrained scale. Opacity-only when
 * reduced motion is requested.
 */
export function ClipReveal({
  children,
  className = "",
  delay = 0,
  amount = 0.3,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount }}
        transition={{ ...T.reveal, delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ clipPath: "inset(14% 4% 14% 4%)", opacity: 0.4 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      viewport={{ once: true, amount }}
      transition={{ ...T.reveal, delay }}
      className={className}
      style={{ willChange: "clip-path" }}
    >
      <motion.div
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount }}
        transition={{ ...T.reveal, delay }}
        className="relative h-full w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/**
 * P10 — Masked line reveal for headlines.
 * Pass each visual line as a separate string.
 * In-view detection happens on the (never-clipped) container — observing the
 * translated line itself would never intersect, since it sits fully inside
 * its overflow-hidden mask until it animates.
 */
export function Lines({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  as: Tag = "h2",
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className={`block ${lineClassName}`}
            initial={reduced ? { opacity: 0 } : { y: "112%" }}
            animate={
              inView
                ? reduced
                  ? { opacity: 1 }
                  : { y: 0 }
                : undefined
            }
            transition={{ ...T.reveal, delay: delay + i * LINE_STAGGER }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Simple opacity/rise reveal for secondary content (captions, meta rows). */
export function Fade({
  children,
  className = "",
  delay = 0,
  y = 14,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ ...T.reveal, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
