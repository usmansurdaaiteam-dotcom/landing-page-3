# Daffy Studio — Motion Research

Research performed before implementation. Sources: current interaction writing on
premium furniture/editorial sites (Moooi "Paper Play" Awwwards case study, Lusano by
CUSP, Palmer Dinnerware by Uncommon, And More Stories digital showroom case study),
library documentation (Motion for React, Embla Carousel, GSAP/ScrollTrigger), and
maintainer guidance in Embla GitHub issues (#458, #890) on mobile carousel performance.

The supplied assets are ten client films (1080×1920 portrait), each with an explicit
BEFORE (raw warehouse footage) → AFTER (lifestyle worlds) arc. 159 scene stills were
extracted and classified into source / studio / lifestyle / campaign. Everything below
is evaluated against that material and a 390–430 px primary viewport.

---

## Patterns researched

### 1. Expanding center carousel

**Behavior:** Active slide occupies ~70–78vw; neighbours peek in at the edges,
slightly scaled down and dimmed. Swiping advances with momentum.

**Why useful:** The single most efficient way to show large portrait imagery on
mobile without losing sequence context. Our stills are 9:16, so a 74vw-wide slide is
nearly full-screen tall — imagery stays dominant.

**Mobile suitability:** Excellent — this is a native-feeling touch pattern.

**Performance:** Embla drives translation on the container; per-slide scale/opacity
tweens must be written directly to the DOM in Embla's `scroll` event, never through
React state (maintainer guidance, issue #458). `translate3d` on slides avoids iOS
stutter (issue #890).

**Candidate:** `embla-carousel-react` + direct-DOM tween helper.

**Decision: KEEP** — the backbone gallery primitive in Concepts 03, 04, 05.

---

### 2. Scroll-driven pinned transformation (sticky stage)

**Behavior:** A visual stage sticks to the viewport while scroll progress drives
which stage of the story (source → studio → lifestyle → film) is visible.

**Why useful:** This is Daffy's core story told with the user's own thumb: they
physically scroll the raw photo into the finished world.

**Mobile suitability:** Good if built on `position: sticky` + normal scrolling. Bad
if built on scroll hijacking; we never intercept the wheel/touch.

**Performance:** Motion's `useScroll` returns a MotionValue that bypasses React
re-render; mapped through `useTransform` into opacity/clip-path on compositable
layers.

**Candidate:** CSS sticky + `useScroll`/`useTransform` (no GSAP needed at this
complexity).

**Decision: KEEP** — the spine of Concept 03.

---

### 3. Story player (stage + segmented progress)

**Behavior:** Full-viewport media with segmented progress bars; autoplay advances,
tap right/left steps, press pauses, swipe changes chapter. Familiar from stories UI,
re-skinned as luxury editorial.

**Why useful:** Ten-second attention format matches our assets exactly (films are
9–27 s, stills are scene-graded). Lets raw imagery be shown at 100vh scale — "proof"
at full size.

**Mobile suitability:** Native mental model; requires generous tap zones and an
explicit pause affordance.

**Performance:** Timer-driven crossfades on two stacked layers only; `AnimatePresence`
with fade+scale. Video only mounted in the film chapter.

**Candidate:** Bespoke React state machine + Motion. No library exists that does
this well and lean.

**Decision: KEEP** — Concept 04's entire model.

---

### 4. Shared-element expansion (thumbnail → viewer)

**Behavior:** Tapping a media card expands it into a full-screen viewer; the image
geometry visibly travels rather than teleporting.

**Why useful:** In a deliverables report, the moment a small thumbnail becomes a
full-bleed image is the product proof. Continuity keeps the user oriented.

**Mobile suitability:** Excellent with correct scroll locking.

**Performance:** Motion `layoutId` handles FLIP with scale-distortion correction.
Must not animate `width/height` directly.

**Candidate:** Motion `layoutId` + `AnimatePresence`.

**Decision: KEEP** — Concept 02 viewer, Concept 05 details.

---

### 5. Accordion with expanding media panels

**Behavior:** Category rows (Source 3 / Studio 2 / Lifestyle 9 / Film 1) where the
active row expands to reveal a large gallery, others compress to labeled bars.

**Why useful:** Scales to 200+ products; count labels communicate volume; the
expansion itself dramatizes "limited → expanded".

**Mobile suitability:** Vertical accordion is the correct mobile pattern (horizontal
accordions fail under 430 px).

**Performance:** Animate with Motion `layout` on the container; media content uses
height auto-animation with clipped overflow. One expanded panel at a time bounds cost.

**Candidate:** Motion `layout` + `AnimatePresence`.

**Decision: KEEP** — Concept 05's model.

---

### 6. Card stack → fan-out ("messy input → controlled system")

**Behavior:** Raw source photos sit as a slightly rotated pile; interaction fans them
apart into an ordered row/grid.

**Why useful:** The metaphor maps 1:1 to Daffy's business. Raw imagery is celebrated,
not hidden.

**Mobile suitability:** Good as a tap/scroll-triggered state change; bad as free
dragging (requires precision).

**Performance:** 3–4 absolutely-positioned images animating transform only.

**Candidate:** Motion springs with indexed offsets.

**Decision: KEEP** — Concept 01's Raw panel and Concept 04's source chapter.

---

### 7. Before/after wipe (clip-path reveal)

**Behavior:** The finished image is revealed over the raw image by an animated
`clip-path: inset()` wipe, either scroll-linked or played once on view.

**Why useful:** The films themselves use a hard whip-cut from BEFORE to AFTER; a wipe
is the same rhetorical device made interactive. Because raw and finished frames share
product placement approximately, the wipe reads as the same object transforming.

**Mobile suitability:** Excellent — no gesture precision needed.

**Performance:** `clip-path` animates on the compositor in modern engines; two
stacked images only.

**Candidate:** Motion animating `clipPath` inset值.

**Decision: KEEP** — hero moments in Concepts 01 and 03.

---

### 8. Grid-to-canvas / draggable exploded canvas (Lusano-style)

**Behavior:** Products scattered on a large pannable 2D canvas.

**Why useful:** Memorable on desktop.

**Mobile suitability:** Poor — panning a 2D canvas with a thumb fights vertical
scrolling and hides content off-screen with no scent.

**Decision: REJECT** — desktop-first pattern; conflicts with mobile-first brief.

---

### 9. 3D coverflow / rotating product turntables

**Why considered:** Common in furniture e-commerce.

**Decision: REJECT** — tacky in this art direction; our assets are photographic
scenes, not 3D models. The brief explicitly bans spinning furniture.

---

### 10. Full smooth-scroll middleware (Lenis)

**Why considered:** Ubiquitous on award sites, pairs with GSAP.

**Evaluation:** All choreography here is either sticky-progress (works natively) or
in-view reveals. Lenis would add wheel normalization for marginal desktop gain while
risking mobile scroll feel, focus/anchor bugs, and modal scroll-lock complexity.

**Decision: REJECT** — native scrolling everywhere.

---

### 11. GSAP + ScrollTrigger

**Evaluation:** Superb for multi-element timeline choreography, but every scroll
behavior in this build is a single progress value mapped to 2–4 properties — well
within `useScroll` + `useTransform`. Adding a second animation runtime (~28 kB) and
imperative lifecycle management inside React for no unique capability fails the
"libraries don't design the product" test.

**Decision: REJECT** (revisit only if a future sequence needs scrubbed video or
SVG-path choreography).

---

### 12. View Transitions API

**Evaluation:** Elegant for cross-route morphs, but iOS Safari support for
cross-document/same-document transitions in our target patterns is still uneven, and
Motion's `layoutId` already covers within-page shared elements.

**Decision: REJECT for now.**

---

### 13. Scroll-driven CSS animations (`animation-timeline`)

**Evaluation:** No JS cost, but Safari support is still behind flags/partial for the
timeline features needed. Would fork the codebase into two motion systems.

**Decision: REJECT** — `useScroll` covers it with universal support.

---

### 14. Autoplaying inline video with IntersectionObserver

**Behavior:** Film posters play muted when meaningfully in view (≥60%), pause when
they leave, expandable to a full player.

**Mobile suitability:** Requires `playsInline muted`; battery-respectful because we
pause off-screen and mount at most one playing video.

**Decision: KEEP** — all film presentation.

---

### 15. Kinetic typography / character scrambles

**Decision: REJECT** — the brief's art direction is photography-first; type moves
only in restrained masked line reveals.

---

## Library decisions

| Dependency | Verdict | Reason |
|---|---|---|
| `motion` (Motion for React, MIT, ~35M weekly downloads) | **Use** | Layout/FLIP with distortion correction, `useScroll` MotionValues outside React render, springs, `AnimatePresence`, `useReducedMotion`. One runtime for everything. |
| `embla-carousel-react` (+ autoplay/fade plugins, MIT) | **Use** | Best-in-class touch physics, tiny, tween via direct DOM per maintainer guidance. |
| GSAP + ScrollTrigger | Skip | No unique capability needed; second runtime. |
| Lenis | Skip | Native scroll is the feature, not the compromise. |
| Swiper | Skip | Heavier than Embla; we need headless control. |
| shadcn/animated component kits | Skip | Stock components would design the product. |

## Performance ground rules adopted

1. Animate only `transform`, `opacity`, `clip-path`, `filter:blur` (sparingly, never continuous).
2. Carousel tweens write straight to `style` in Embla events — zero React re-renders per frame.
3. One playing `<video>` maximum, mounted lazily, paused off-screen.
4. All imagery lazy-loaded with tiny base64 blur placeholders (precomputed in the manifest).
5. `useReducedMotion` gates every Tier 3/4 sequence down to opacity-only state changes.
