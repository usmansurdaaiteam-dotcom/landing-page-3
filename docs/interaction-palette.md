# Daffy Studio — Interaction Palette

Eleven reusable primitives. Each concept draws a *subset* — never all of them.
Every primitive is assigned a motion tier (see tokens in `lib/motion.ts`).

Motion tokens:

| Token | Value | Used for |
|---|---|---|
| `fastFeedback` | 0.18 s, ease-out | Tier 1 — buttons, chips, indicators |
| `standardUi` | 0.32 s, `cubic-bezier(0.32, 0.72, 0, 1)` | Tier 1/2 — tabs, captions, counters |
| `premiumReveal` | 0.7 s, `cubic-bezier(0.22, 1, 0.36, 1)` | Tier 2 — image/text reveals |
| `cinematic` | 1.05 s, `cubic-bezier(0.65, 0, 0.35, 1)` | Tier 3/4 — wipes, world changes |
| `spring.snappy` | stiffness 420, damping 34 | Tier 1 — icons, chips |
| `spring.spatial` | stiffness 220, damping 30 | Tier 2/3 — layout, stacks, expansion |
| `spring.soft` | stiffness 120, damping 24 | Tier 3 — large panels |

---

## P1 — Cinematic image reveal (Tier 2)
Image enters via `clip-path: inset(x% 0 0 0)` + scale 1.06→1 as it crosses 25% of
viewport. Used instead of opacity/translateY for all primary imagery.
**Used in:** all concepts. **Reduced motion:** opacity-only.

## P2 — Raw stack → fan-out (Tier 3)
Source photos rest as a rotated pile (2–4°, offset 8–14 px). On view/tap they spring
apart into an ordered arrangement. Communicates messy → controlled.
**Used in:** 01 (Raw panel), 04 (source chapter).

## P3 — Transformation wipe (Tier 4 — hero moment)
Finished image wipes over the raw image via animated inset clip. Triggered once,
prominently, per page. Scroll-linked in 03; staged in 01.
**Used in:** 01 hero, 03 source→studio boundary.

## P4 — Center-weighted deck (Tier 2)
Embla carousel; active slide ~74vw, neighbours peek at ~13vw with scale 0.92 and
55% opacity, tweened directly in the scroll event. Caption + count follow active
index. Arrows provided as non-gesture fallback.
**Used in:** 03 (stage galleries), 05 (expanded category), 02 (related row).

## P5 — Panel expansion / accordion (Tier 3)
Active category expands (spring.spatial); siblings compress to labeled bars but stay
visible so the system is always legible. Only one open at a time.
**Used in:** 01 (canvas blocks), 05 (explorer rows).

## P6 — Shared-element takeover (Tier 3)
Thumbnail expands into full-screen viewer via Motion `layoutId`; backdrop fades in;
body scroll locks; swipe-down or button to dismiss.
**Used in:** 02 (deliverable viewer), 05 (zoom).

## P7 — Sticky story progress (Tier 3)
Content scrolls normally while a stage rail / progress line interpolates. No
scroll hijacking; progress is derived, never imposed.
**Used in:** 03 (timeline spine), 02 (section indicator).

## P8 — Story player chapters (Tier 3)
Segmented autoplay bars; tap zones left/right; press-and-hold pauses; swipe moves
between chapters. Interaction always wins over autoplay.
**Used in:** 04 only.

## P9 — Poster-to-film (Tier 2)
Poster frame with pulse-free play affordance; video fades in over the poster once
≥60% in view (muted, playsInline) and pauses off-screen. Tap for sound/fullscreen.
**Used in:** all concepts' film stages.

## P10 — Masked line reveal (Tier 2, typography)
Headline lines rise out of `overflow: hidden` wrappers with 60 ms stagger, once per
view. The only typographic motion in the system.
**Used in:** section headings everywhere.

## P11 — Product switch crossfade (Tier 3)
Selecting a product: thumbnail rail marker springs (layoutId), page content
crossfades with 30 px directional slide while counts/text swap. Foundation for 200+
products; state keyed by slug, no route reload.
**Used in:** 01, 04, 05 switchers; 02/03 entry from index.

---

## Assignment matrix

| Concept | Primary primitives | Hero moment (Tier 4) |
|---|---|---|
| 01 Transformation Canvas | P5 P2 P3 P11 P1 | Raw→Studio wipe inside expanding canvas |
| 02 Deliverables Report | P6 P7 P1 P9 P10 | First shared-element takeover |
| 03 Source to Story | P7 P3 P4 P1 P9 | Scroll-linked transformation wipe |
| 04 Stage Player | P8 P2 P9 P11 | Film chapter takeover |
| 05 Category Explorer | P5 P4 P6 P11 P1 | Studio panel expansion |

## Motion budget rule

At any moment: one primary movement + at most one subtle secondary response.
Autoplay progress bars pause while the user gestures. Nothing loops forever except
video playback itself.
