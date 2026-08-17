# Daffy Studio — Motion-First Prototype

Five interactive, mobile-first concepts for Daffy Studio: a furniture visual
production company that turns imperfect warehouse references into studio
imagery, lifestyle worlds, campaigns and film.

## Run

```bash
npm install
npm run dev
# open http://localhost:3000 (best judged at ~390–430px mobile width)
```

## Routes

| Route | Concept |
|---|---|
| `/concepts` | Index — all five concepts |
| `/concepts/01` | Transformation Canvas — expanding stage panels, raw stack fan-out, transformation wipe |
| `/concepts/02` | Deliverables Report — light editorial project report, shared-element viewer |
| `/concepts/03` | Source to Story — scroll-driven sticky narrative with raw→studio wipe |
| `/concepts/04` | Stage Player — chaptered story player with segmented autoplay |
| `/concepts/05` | Category Explorer — accordion category system built for 200+ products |
| `/compare` | Side-by-side comparison |

## Assets

Sourced from ten supplied client films (1080×1920). Each film was
scene-detected; 159 stills were extracted, visually classified
(source / studio / lifestyle / campaign) and web-optimized with precomputed
blur placeholders. Films were re-encoded for mobile delivery. See
`docs/asset-audit.md` and `data/product-manifest.json`.

## Stack & docs

Next.js (App Router) · TypeScript · Tailwind v4 · Motion for React · Embla
Carousel. Native scrolling only; `prefers-reduced-motion` respected in every
primitive.

- `docs/motion-research.md` — interaction patterns researched, kept and rejected
- `docs/interaction-palette.md` — the 11 reusable interaction primitives + motion tokens
- `docs/asset-audit.md` — asset pipeline and inventory
- `docs/design-critique.md` — self-critique and fix log
