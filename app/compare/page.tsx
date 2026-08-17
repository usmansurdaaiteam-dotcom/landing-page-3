import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { concepts } from "@/lib/concepts";
import { ConceptSwitcher } from "@/components/navigation/ConceptSwitcher";
import { Wordmark } from "@/components/navigation/Wordmark";
import { Fade } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Daffy Studio — Compare Concepts",
};

const ROWS: { label: string; key: keyof (typeof concepts)[number] }[] = [
  { label: "Interaction model", key: "model" },
  { label: "Key interactions", key: "interaction" },
  { label: "Featured content", key: "product" },
];

export default function ComparePage() {
  return (
    <main className="min-h-svh bg-ink pb-28 text-ivory">
      <div className="mx-auto w-full max-w-[640px]">
      <header className="flex items-center justify-between px-5 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <Wordmark />
        <Link href="/concepts" className="label text-ivory/50 hover:text-brass">
          All concepts
        </Link>
      </header>

      <section className="px-5 pt-12">
        <h1 className="font-display text-4xl">Side by side</h1>
        <p className="mt-3 max-w-md text-[14px] leading-relaxed text-ivory/60">
          Same story, five interaction philosophies. Open any column on a phone
          — that is where they are meant to be judged.
        </p>
      </section>

      <section className="mt-10 flex flex-col gap-5 px-5">
        {concepts.map((c, i) => (
          <Fade key={c.id} delay={i * 0.05}>
            <Link
              href={c.href}
              className="hairline group flex gap-4 rounded-md border bg-ink-2 p-4"
            >
              <span className="relative block h-28 w-20 shrink-0 overflow-hidden rounded">
                <Image
                  src={c.thumb}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </span>
              <span className="min-w-0">
                <span className="label-wide text-brass/80">Concept {c.id}</span>
                <span className="font-display mt-1 block text-xl leading-tight">
                  {c.name}
                </span>
                {ROWS.map((r) => (
                  <span key={r.label} className="mt-2 block">
                    <span className="label block text-[9px] text-ivory/35">
                      {r.label}
                    </span>
                    <span className="block text-[13px] leading-relaxed text-ivory/70">
                      {String(c[r.key])}
                    </span>
                  </span>
                ))}
              </span>
            </Link>
          </Fade>
        ))}
      </section>
      </div>

      <ConceptSwitcher />
    </main>
  );
}
