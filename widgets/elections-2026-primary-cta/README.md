# 2026 Primary — Homepage CTA

Homepage promo for VPM News' 2026 Virginia primary coverage. Photo on the left, dark-blue
panel on the right with an eyebrow, headline, short body, and a single CTA linking to
`vpm.org/elections`. Structurally a rebuild of the 2025 election CTA, restyled on current
VPM tokens — sentence-case headline, uppercase CTA, 3-stripe accent bar, sharp corners.

Companion to `elections-2026-primary/` (the full coverage module); dates here match it —
Election Day Tuesday, Aug. 4; early voting ended Aug. 1.

## Files

| File | Purpose |
|---|---|
| `preview.html` | Full browser preview (full-width + 320px column) |
| `html.html` | Paste into ACF HTML field |
| `css.css` | Paste into ACF CSS field |

No JS — the widget is static markup, so there is nothing to re-init if the CMS
detaches and re-injects it.

## Customizing

- **Photo:** replace the `src` on `.vpm-elec26cta__img` with a VPM-owned image (16:9 or
  wider, ~1200px). It ships pointing at a placehold.co placeholder — **swap it before
  publishing.** `alt` is intentionally empty: the image is decorative and the headline
  beside it carries the meaning.
- **No photo:** delete the whole `<figure class="vpm-elec26cta__media">` block. The panel
  fills the full width with no layout change needed.
- **Copy:** eyebrow, `<h2>`, and body paragraph are plain text in `html.html`.
- **CTA target:** `href` on `.vpm-elec26cta__link` (currently `https://vpm.org/elections`).

## Notes

- Layout uses a **container query**, so it stacks correctly in a narrow sidebar on a wide
  page — not just on small screens. A `@supports` viewport fallback covers older engines.
- Tokens are inlined and namespaced `--vpm-elec26cta-*` so host CSS custom properties
  can't leak in.
- Copy is deliberately **day-agnostic**: it names Aug. 4 as a date rather than saying
  "today" or "tomorrow," so the same block can run the day before, on Election Day, and
  in the results days after without a swap. Keep it that way when editing.
- It does go stale once the primary is old news — plan to pull it rather than let it sit.

## Pre-ship

Not yet run through `/ship-widget`. Do that before it goes into the CMS.
