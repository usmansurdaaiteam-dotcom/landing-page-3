/**
 * Daffy motion token system.
 * Four tiers: fast feedback → standard UI → premium reveal → cinematic.
 * Every animation in the prototype pulls from these; no ad-hoc curves.
 */
import type { Transition } from "motion/react";

export const EASE_UI = [0.32, 0.72, 0, 1] as const;
export const EASE_REVEAL = [0.22, 1, 0.36, 1] as const;
export const EASE_CINEMA = [0.65, 0, 0.35, 1] as const;

export const T = {
  /** Tier 1 — button/icon/indicator response */
  fast: { duration: 0.18, ease: "easeOut" } as Transition,
  /** Tier 1/2 — tabs, chips, captions, counters */
  ui: { duration: 0.32, ease: EASE_UI } as Transition,
  /** Tier 2 — image & text reveals */
  reveal: { duration: 0.7, ease: EASE_REVEAL } as Transition,
  /** Tier 3/4 — wipes, world changes, hero moments */
  cinema: { duration: 1.05, ease: EASE_CINEMA } as Transition,
};

export const SPRING = {
  /** Tier 1 — icons, chips, small markers */
  snappy: { type: "spring", stiffness: 420, damping: 34 } as Transition,
  /** Tier 2/3 — layout changes, stacks, card expansion */
  spatial: { type: "spring", stiffness: 220, damping: 30 } as Transition,
  /** Tier 3 — large panels and sheets */
  soft: { type: "spring", stiffness: 120, damping: 22 } as Transition,
};

/** Stagger for masked line reveals */
export const LINE_STAGGER = 0.07;
