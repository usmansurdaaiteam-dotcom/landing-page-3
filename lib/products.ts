import manifest from "@/data/product-manifest.json";

export type StillCategory = "source" | "studio" | "lifestyle" | "campaign";

export interface Still {
  id: string;
  src: string;
  w: number;
  h: number;
  cat: StillCategory;
  grade: "A" | "B";
  caption: string;
  blur: string;
}

export interface Film {
  src: string;
  poster: string;
  duration: number;
}

export interface Product {
  slug: string;
  name: string;
  client: string;
  type: string;
  material: string;
  film: Film;
  hero: string;
  rawHero: string;
  counts: Partial<Record<StillCategory, number>>;
  total: number;
  stills: Still[];
}

export const products = manifest.products as unknown as Product[];

export function getProduct(slug: string): Product {
  const p = products.find((p) => p.slug === slug);
  if (!p) throw new Error(`Unknown product: ${slug}`);
  return p;
}

export function byCat(p: Product, cat: StillCategory, gradeA = false): Still[] {
  return p.stills.filter((s) => s.cat === cat && (!gradeA || s.grade === "A"));
}

export function stillById(p: Product, id: string): Still {
  const s = p.stills.find((s) => s.id === id);
  if (!s) throw new Error(`Unknown still: ${id}`);
  return s;
}

export const STAGES: { cat: StillCategory | "film"; label: string; num: string }[] = [
  { cat: "source", label: "Source", num: "01" },
  { cat: "studio", label: "Studio", num: "02" },
  { cat: "lifestyle", label: "Lifestyle", num: "03" },
  { cat: "campaign", label: "Campaign", num: "04" },
  { cat: "film", label: "Film", num: "05" },
];

/** Stages that actually have content for a product. */
export function stagesFor(p: Product) {
  return STAGES.filter((s) => s.cat === "film" || (p.counts[s.cat] ?? 0) > 0).map(
    (s, i) => ({ ...s, num: String(i + 1).padStart(2, "0") }),
  );
}
