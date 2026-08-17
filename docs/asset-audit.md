# Daffy Studio — Asset Audit

## What was supplied

Two Google Drive links resolving to the same archive: **10 finished client films**
(`Final Videos/*.mp4`), all 1080×1920 portrait H.264, 9.6–26.8 s. No still
photography was supplied.

Every film follows the same arc: **BEFORE** — raw product footage on warehouse /
workshop concrete — then a whip transition into a sequence of **AFTER** lifestyle,
studio and campaign scenes, usually ending on a dusk/dark closing frame.

## Extraction pipeline

1. Scene-cut detection per film (`ffprobe` scene score > 0.22, flash transitions
   < 0.45 s discarded) → 163 scene midpoint stills at full 1080×1920.
2. Labeled contact sheets per product; every still visually reviewed and classified.
3. 159 keepers exported at 900×1600 JPEG (4 broken/black frames excluded).
4. 20 px base64 blur placeholders precomputed into the manifest.
5. Films re-encoded 720×1280 CRF 27 + faststart (265 MB → ~35 MB total);
   poster = first A-grade lifestyle still.

Originals remain untouched in the Drive archive; nothing destructive was performed.

## Classification model

`source` (raw warehouse frames) · `studio` (clean/minimal backdrops) ·
`lifestyle` (styled worlds) · `campaign` (human model / editorial collage) ·
plus the film itself as `motion`. Grades: A = concept-ready, B = supporting volume.

## Product inventory (10 products, 159 stills + 10 films)

| Slug | Product | Client | Source | Studio | Lifestyle | Campaign | Film |
|---|---|---|---|---|---|---|---|
| `eclipse` | Eclipse Dining Table | Eclipse | 3 | — | 5 | 1 | 10.4 s |
| `homecoze` | Swivel Bar Stool | Homecoze | 4 | 2 | 8 | — | 16.3 s |
| `rattan` | Rattan Lounge Armchair | Republic of Rattan | 3 | 1 | 9 | 5 | 12.1 s |
| `innovation` | Modular Sofa | Innovation Living | 3 | — | 4 | 2 | 9.6 s |
| `marc-main` | Bentwood Chair Series | Marc & Main | 4 | 3 | 14 | 1 | 26.8 s |
| `outdoor-living` | Hanging Egg Chair | Outdoor Living Direct | 3 | — | 6 | — | 9.6 s |
| `made-studio` | Sculpted Garden Table | Made Studio | 3 | 3 | 6 | — | 13.7 s |
| `art-aspire` | Curve-Back Dining Chair | Art Aspire | 4 | 1 | 13 | 2 | 13.0 s |
| `vast` | Alfresco Recliner Set | Vast Furniture | 3 | — | 5 | 2 | 11.7 s |
| `dunstone` | Heritage Timber Collection | Dunstone Design | 3 | 4 | 25 | 3 | 23.0 s |

## Strength notes

- **Strongest transformation pairs** (raw and finished frames share product pose):
  eclipse 00→03, outdoor-living 00→04, innovation 00→03, vast 02→03,
  made-studio 00→03, rattan 00→03. These drive the wipe hero moments.
- **True studio shots with model:** homecoze s12/s13 (white studio) — used wherever
  a "studio output" needs to read unmistakably as studio.
- **Volume champion:** dunstone (36 scenes, 3 product types) — used to demonstrate
  collection-scale output in Concept 02.
- **Weak/excluded:** `marc-main-22`, `dunstone-36`, `rattan-18` (near-black end
  frames), `homecoze-11` (broken half-black collage frame).
- **Ambiguous kept as B:** triptych collage frames (`vast-05`, `vast-08`,
  `eclipse-06`) — legitimate campaign-format artifacts from the films.

## Honesty constraints observed

Stills are frames from delivered films, so captions in the UI describe scenes
("Pool pavilion", "As received — workshop") and never claim resolutions or media
that don't exist. Counts shown in the concepts are real counts from this manifest.
