"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { SPRING } from "@/lib/motion";

const CONCEPTS = ["01", "02", "03", "04", "05"];

/**
 * Prototype-review switcher. Deliberately small; sits above the safe area,
 * never competes with concept UI.
 */
export function ConceptSwitcher() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Concept switcher"
      className="fixed bottom-[max(0.9rem,env(safe-area-inset-bottom))] left-1/2 z-40 -translate-x-1/2"
    >
      <div className="flex items-center gap-0.5 rounded-full border border-ivory/15 bg-ink/70 p-1 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-lg">
        <Link
          href="/concepts"
          aria-label="All concepts"
          className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] tracking-widest transition-colors ${
            pathname === "/concepts" || pathname === "/compare"
              ? "text-brass"
              : "text-ivory/55 hover:text-ivory"
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <rect x="0.5" y="0.5" width="4.4" height="4.4" stroke="currentColor" />
            <rect x="7.1" y="0.5" width="4.4" height="4.4" stroke="currentColor" />
            <rect x="0.5" y="7.1" width="4.4" height="4.4" stroke="currentColor" />
            <rect x="7.1" y="7.1" width="4.4" height="4.4" stroke="currentColor" />
          </svg>
        </Link>
        {CONCEPTS.map((c) => {
          const href = `/concepts/${c}`;
          const active = pathname === href;
          return (
            <Link
              key={c}
              href={href}
              aria-current={active ? "page" : undefined}
              className="relative flex h-8 w-8 items-center justify-center rounded-full"
            >
              {active && (
                <motion.span
                  layoutId="concept-pill"
                  transition={SPRING.snappy}
                  className="absolute inset-0 rounded-full bg-ivory/10 ring-1 ring-brass/60"
                />
              )}
              <span
                className={`relative text-[10px] tracking-widest ${
                  active ? "text-brass" : "text-ivory/55"
                }`}
              >
                {c}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
