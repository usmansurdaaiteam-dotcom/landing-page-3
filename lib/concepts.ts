export interface ConceptMeta {
  id: string;
  href: string;
  name: string;
  philosophy: string;
  interaction: string;
  model: string;
  product: string;
  thumb: string;
  tone: "dark" | "light";
}

export const concepts: ConceptMeta[] = [
  {
    id: "01",
    href: "/concepts/01",
    name: "Transformation Canvas",
    philosophy:
      "One living canvas. Stages expand and contract around whichever part of the transformation you touch.",
    interaction: "Expanding stage panels · raw stack fan-out · transformation wipe",
    model: "Spatial — content blocks physically trade room",
    product: "All ten products, switchable",
    thumb: "/assets/products/eclipse/s07.jpg",
    tone: "dark",
  },
  {
    id: "02",
    href: "/concepts/02",
    name: "Deliverables Report",
    philosophy:
      "The client-proof document. A luxury project report where every number is real and every thumbnail opens into full-bleed evidence.",
    interaction: "Shared-element media takeover · sticky section rail · live counts",
    model: "Editorial — typography and restraint carry it",
    product: "Dunstone Design collection (36 assets)",
    thumb: "/assets/products/dunstone/s11.jpg",
    tone: "light",
  },
  {
    id: "03",
    href: "/concepts/03",
    name: "Source to Story",
    philosophy:
      "A narrative you scroll through. The raw warehouse photo is held on screen until your own thumb transforms it.",
    interaction: "Sticky stage · scroll-linked transformation wipe · stage decks",
    model: "Cinematic — scroll drives the story, never hijacked",
    product: "Homecoze bar stool, deep dive",
    thumb: "/assets/products/homecoze/s13.jpg",
    tone: "dark",
  },
  {
    id: "04",
    href: "/concepts/04",
    name: "Stage Player",
    philosophy:
      "A story player in editorial clothing. Four chapters — source, studio, lifestyle, film — that play themselves until you take over.",
    interaction: "Segmented autoplay · tap/swipe chapters · product drawer",
    model: "Temporal — the page is a timeline you can seize",
    product: "All ten products, switchable",
    thumb: "/assets/products/rattan/s10.jpg",
    tone: "dark",
  },
  {
    id: "05",
    href: "/concepts/05",
    name: "Category Explorer",
    philosophy:
      "The scalable system. Categories breathe — the one you open takes the room, the rest wait as labeled bars.",
    interaction: "Accordion expansion · center-weighted decks · zoom viewer",
    model: "Structural — built to hold 200+ products",
    product: "Marc & Main chair series, switchable",
    thumb: "/assets/products/marc-main/s07.jpg",
    tone: "dark",
  },
];
