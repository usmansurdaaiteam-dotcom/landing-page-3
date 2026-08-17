import Link from "next/link";

export function Wordmark({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const color = tone === "dark" ? "text-ivory" : "text-ink";
  return (
    <Link
      href="/concepts"
      className={`inline-flex items-baseline gap-2 ${color} ${className}`}
      aria-label="Daffy Studio — all concepts"
    >
      <span className="font-display text-[15px] tracking-[0.42em] uppercase">
        Daffy&nbsp;Studio
      </span>
    </Link>
  );
}
