# 2026 Primary — Homepage CTA

Homepage promo for VPM News' 2026 Virginia primary coverage. Photo on the left, dark-blue
panel on the right with an eyebrow, headline, short body, and a single CTA linking to
`vpm.org/elections`. Structurally a rebuild of the 2025 election CTA, restyled on current
VPM tokens — sentence-case headline, uppercase CTA, 3-stripe accent bar, sharp corners.

Companion to `elections-2026-primary/` (the full coverage module); dates here match it —
Election Day Tuesday, Aug. 4; early voting ended Aug. 1.

## Requires

**Base layer** — `/base/reset.css` → `/base/tokens.css` → `/base/atoms.css`, pasted once per
page into the **first** Code Block's CSS field, above that block's own CSS. See
[`/base/README.md`](../../base/README.md).

This widget consumes the shared atoms (`vpm-accent-bar`, `vpm-eyebrow`, `vpm-h2`, `vpm-body`,
`vpm-measure`, `vpm-media`, `vpm-img`, `vpm-btn vpm-btn--accent`, `vpm-btn__arrow`,
`vpm-on-dark`) and no longer defines its own. `css.css` is layout only.

`vpm-ui` on the root `<section>` is what activates all of it. Without it the widget renders as
readable-but-unstyled content — degraded, not broken.

## Files

| File | Purpose |
|---|---|
| `preview.html` | Full browser preview (full-width + 320px column) |
| `html.html` | Paste into ACF HTML field |
| `css.css` | Paste into ACF CSS field |

No JS — the widget is static markup, so there is nothing to re-init if the CMS
detaches and re-injects it.

## Customizing

- **Photo:** replace the `src` on the `.vpm-img` inside `.vpm-elec26cta__media` with a
  VPM-owned image (16:9 or
  wider, ~1200px). It ships pointing at a placehold.co placeholder — **swap it before
  publishing.** `alt` is intentionally empty: the image is decorative and the headline
  beside it carries the meaning.
- **No photo:** delete the whole `<figure class="vpm-elec26cta__media">` block. The panel
  fills the full width with no layout change needed.
- **Copy:** eyebrow, `<h2>`, and body paragraph are plain text in `html.html`.
- **CTA target:** `href` on `.vpm-elec26cta__cta` (currently `https://vpm.org/elections`).

## Notes

- Layout uses a **container query**, so it stacks correctly in a narrow sidebar on a wide
  page — not just on small screens. A `@supports` viewport fallback covers older engines.
- Tokens come from the base layer and are scoped to `.vpm-ui` rather than `:root`, so host
  CSS custom properties can't leak in and the widget's own can't leak out.
- The base `.vpm-media` frame holds 16:9 while stacked. At ≥720px this widget releases it
  (`aspect-ratio: auto`) so the photo fills the column height instead of dictating it —
  overriding an atom's ratio is layout, which is the widget's job, not the atom's.
- Copy is deliberately **day-agnostic**: it names Aug. 4 as a date rather than saying
  "today" or "tomorrow," so the same block can run the day before, on Election Day, and
  in the results days after without a swap. Keep it that way when editing.
- It does go stale once the primary is old news — plan to pull it rather than let it sit.

## Pre-ship

Run through the CMS harness on 2026-08-06 after migrating onto the base layer
(`harness/harness.html?widget=elections-2026-primary-cta&mode=acf`) — clean pass:

- Delayed hydration + detach/re-inject: no errors, no double-init
- Two copies share **one** base-layer injection; no duplicate `id`s
- Hostile host CSS repelled — heading stays 32px/white, CTA keeps its colors against the
  host's `!important` red link rule
- CTA clickable once the click-interceptor overlay clears
- 320px sidebar column renders correctly
- Only console 404 is the harness probing for the absent `js.js` (expected for a static
  widget, per `harness/README.md`)
- Base-absent check: degrades to readable unstyled content, does not collapse

Computed geometry was diffed against the pre-migration build and is identical (button
`12px 24px` / `0.56px` tracking / `#6CACE4`; eyebrow `1.56px` tracking; title `38.4px`
line-height; body `26.4px` line-height, `464.3px` measure).

Still to do before the CMS: swap the placeholder photo, and run `/ship-widget` for the
guided pass.
