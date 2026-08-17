import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { concepts } from "@/lib/concepts";
import { ClipReveal, Fade, Lines } from "@/components/motion/Reveal";
import { ConceptSwitcher } from "@/components/navigation/ConceptSwitcher";
import { Wordmark } from "@/components/navigation/Wordmark";

export const metadata: Metadata = {
  title: "Daffy Studio — Five Concepts",
  description:
    "Five interaction philosophies for the same story: raw references in, commercial visual worlds out.",
};

export default function ConceptsIndex() {
  return (
    <main className="min-h-svh bg-ink pb-28 text-ivory">
      <header className="flex items-center justify-between px-5 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <Wordmark />
        <Link href="/compare" className="label text-ivory/50 underline-offset-4 hover:text-brass">
          Compare
        </Link>
      </header>

      <section className="px-5 pt-14 pb-4">
        <Lines
          as="h1"
          lines={["From source", "to story."]}
          className="font-display text-[13.5vw] leading-[1.02] text-ivory sm:text-6xl"
        />
        <Fade delay={0.25} className="mt-6 max-w-md">
          <p className="text-[15px] leading-relaxed text-ivory/65">
            Clients hand us imperfect references photographed on warehouse
            floors. We hand back studio imagery, lifestyle worlds, campaigns
            and film. Five prototypes explore how that transformation should
            feel in the hand.
          </p>
        </Fade>
        <Fade delay={0.35} className="mt-8 flex gap-8">
          <div>
            <p className="font-display text-3xl text-brass">10</p>
            <p className="label mt-1 text-ivory/45">Products</p>
          </div>
          <div>
            <p className="font-display text-3xl text-brass">159</p>
            <p className="label mt-1 text-ivory/45">Finished stills</p>
          </div>
          <div>
            <p className="font-display text-3xl text-brass">10</p>
            <p className="label mt-1 text-ivory/45">Films</p>
          </div>
        </Fade>
      </section>

      <section className="mt-10 flex flex-col gap-12 px-5">
        {concepts.map((c, i) => (
          <article key={c.id}>
            <Link href={c.href} className="group block">
              <ClipReveal className="relative aspect-[4/5] overflow-hidden rounded-md sm:aspect-[16/10]">
                <Image
                  src={c.thumb}
                  alt={c.name}
                  fill
                  sizes="(min-width: 640px) 60vw, 92vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  priority={i === 0}
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                <span className="label-wide absolute top-4 left-4 text-ivory/75">
                  Concept {c.id}
                </span>
                <span className="absolute right-4 bottom-4 left-4">
                  <span className="font-display block text-3xl leading-tight text-ivory">
                    {c.name}
                  </span>
                </span>
              </ClipReveal>
            </Link>
            <Fade className="mt-4" delay={0.08}>
              <p className="text-[14px] leading-relaxed text-ivory/60">
                {c.philosophy}
              </p>
              <p className="label mt-3 text-brass/85">{c.interaction}</p>
              <p className="mt-3 text-[13px] text-ivory/40">{c.product}</p>
              <Link
                href={c.href}
                className="label mt-5 inline-flex items-center gap-2 border-b border-brass/50 pb-1 text-ivory transition-colors hover:text-brass"
              >
                Open concept
                <svg width="14" height="10" viewBox="0 0 16 12" fill="none" aria-hidden>
                  <path d="m10 1 5 5-5 5M15 6H1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </Fade>
            {i < concepts.length - 1 && (
              <div className="hairline mt-12 border-t" />
            )}
          </article>
        ))}
      </section>

      <footer className="mt-20 px-5">
        <p className="label text-ivory/35">
          Daffy Studio — prototype build · real client assets
        </p>
      </footer>

      <ConceptSwitcher />
    </main>
  );
}
