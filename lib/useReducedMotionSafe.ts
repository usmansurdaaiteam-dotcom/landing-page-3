"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/**
 * SSR-safe reduced-motion preference.
 * Motion's useReducedMotion reads matchMedia during the first client render,
 * which differs from the server render and causes hydration mismatches on
 * every branched initial style. useSyncExternalStore hydrates with the server
 * snapshot (false) and re-renders once the real preference is known;
 * consumers implement reduced motion as zero-duration transitions rather
 * than divergent DOM.
 */
export function useReducedMotionSafe(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
