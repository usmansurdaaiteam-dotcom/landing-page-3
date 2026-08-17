# Daffy Studio — Design Critique (self-review, round 1)

Performed after full implementation + first browser QA round (mobile 390/430,
tablet 768, desktop 1440 screenshots + interactive testing). Scores are
deliberately harsh; anything < 8 in an important category triggered an action.

## Bugs caught and fixed in this round

1. **Masked headline reveal never fired** — the animated line was observed by
   IntersectionObserver while fully clipped inside its mask, so intersection
   stayed at 0 and every serif headline was invisible. Observation moved to the
   container. (This one bug made every page look 40% cheaper.)
2. **Serif never rendered** — `@theme` font tokens resolve on `:root`, but the
   next/font variables were declared on `<body>`, so `--font-display` computed
   to invalid and silently fell back to sans. Variables moved to `<html>`.
3. **Baked "AFTER" captions** from the source films appeared in hero/poster
   picks — repointed all heroes/posters to caption-free frames. (Baked
   "BEFORE" labels on raw stills were deliberately *kept*: they read as proof.)
4. Next/Image aspect + position console warnings, thin progress bars, small
   tap targets, desktop stretching — all fixed.

## Scores after fixes

| Category | C01 Canvas | C02 Report | C03 Story | C04 Player | C05 Explorer |
|---|---|---|---|---|---|
| Visual impact | 8 | 8 | 9 | 9 | 8 |
| Clarity | 9 | 9 | 8 | 8 | 9 |
| Premium feeling | 8 | 9 | 8 | 8 | 8 |
| Product storytelling | 9 | 8 | 9 | 8 | 7→8¹ |
| Transformation proof | 9 | 8 | 9 | 8 | 7→8¹ |
| Mobile UX | 8 | 9 | 8 | 8 | 8 |
| Motion quality | 8 | 8 | 8 | 9 | 8 |
| Originality | 8 | 7→8² | 8 | 8 | 8 |
| Performance | 9 | 9 | 8 | 9 | 9 |
| Scalability | 9 | 8 | 7³ | 9 | 10 |

¹ C05 initially opened on "Studio" which for some products holds only 2
frames; source row previews now celebrate the raw shots, and the footer states
the scale story explicitly.
² C02 risks reading as "just a nice grid" — the shared-element takeover and
real counts are what save it; kept restrained on purpose (that is its
philosophy).
³ C03 is a hand-tuned narrative for one product by design; it trades
scalability for cinema. Accepted.

## Weakest moments identified (fix list for round 2)

1. **C03 chapter caption vs visual mismatch at boundaries** — the caption
   rail switched chapters at even scroll quarters while the visuals cross at
   0.25 / 0.51 / 0.80 of sequence progress. Thresholds must match the actual
   transform midpoints.
2. **C04 gesture hint** is set at 30% ivory over photography — illegible.
   Needs a scrim or higher opacity, and it should disappear after first
   interaction rather than sit there forever.
3. **C01 wipe labels** ("What arrived" / "What we built") crowd each other at
   390px on top of bright imagery. Stack them at the corners with stronger
   scrims.
4. **Index concept-card label** legibility over bright frames (fixed with a
   top scrim this round).
5. **Compare page density** — 12.5px body in cells is at the floor; bump
   line-height.

## What was deliberately NOT done

- No parallax anywhere: portrait imagery at near-full-bleed doesn't need it.
- No page-transition theatrics between concepts: the switcher is a review
  tool, not part of any one concept's story.
- No lightbox zoom/pinch: out of scope for prototype; Viewer supports swipe
  dismiss + keyboard.
