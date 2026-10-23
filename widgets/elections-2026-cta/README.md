# 2026 Elections — CTA

Promo for VPM News' 2026 Virginia election coverage, placed on article and story pages. Photo
beside a dark-blue panel with an eyebrow, headline, short body and a single CTA linking to
`vpm.org/elections`. Rebuilt from the 2025 election CTA on current VPM tokens: sentence-case
headline, uppercase CTA, 3-stripe accent bar, sharp corners.

One widget across the 2026 cycle. It ran for the Aug. 4 primary as
`elections-2026-primary-cta` and was updated in place for the Nov. 3 general election
(folder renamed, namespace `vpm-elec26cta-` unchanged). Swap the copy rather than forking a
new widget for the next race.

Current copy: general election, Tuesday, Nov. 3, 2026. U.S. Senate and all 11 U.S. House
seats; polls close at 7 p.m.

## Files

| File | Purpose |
|---|---|
| `preview.html` | Full browser preview (full-width + 320px column) |
| `html.html` | Paste into ACF HTML field |
| `css.css` | Paste into ACF CSS field |

No JS. The widget is static markup, so there is nothing to re-init if the CMS detaches and
re-injects it.

## Customizing

- **Photo:** replace the `src` on `.vpm-elec26cta__img` with a VPM-owned image (16:9 or
  wider, ~1200px). It ships pointing at a placehold.co placeholder, so **swap it before
  publishing.** `alt` is intentionally empty: the image is decorative and the headline
  beside it carries the meaning.
- **No photo:** delete the whole `<figure class="vpm-elec26cta__media">` block. The panel
  fills the full width with no layout change needed. Worth considering in a narrow article
  sidebar, where the stacked photo pushes the CTA down.
- **Copy:** eyebrow, `<h2>` and body paragraph are plain text in `html.html`.
- **CTA target:** `href` on `.vpm-elec26cta__link` (currently `https://vpm.org/elections`).

## Notes

- Layout uses a **container query**, so it stacks in a narrow sidebar or article column on a
  wide page, not just on small screens. Two columns from 720px of widget width. A `@supports`
  viewport fallback covers older engines.
- Tokens are inlined and namespaced `--vpm-elec26cta-*` so host CSS custom properties can't
  leak in.
- Copy is deliberately **day-agnostic**: it names Nov. 3 as a date rather than saying
  "today" or "tomorrow," so the same block can run before, on and after Election Day without
  a swap. Keep it that way when editing.
- The `<h2>` assumes the block sits below the article's `<h1>`. Fine in-body or in a sidebar.
- It goes stale once the general is old news. Plan to pull it rather than let it sit.

## Analytics hooks
GTM reads these attributes for the GA4 `module_view` and `module_click` events (setup: `docs/election-tracking.md`). Don't remove or rename them.
- The outer wrapper has `data-module="promo-large"`.
- Every link has `data-module="promo-large"` and `data-module-position`, 1-based in DOM order. `.vpm-elec26cta__link` is position 1.
- A new link gets the next position number. Only links carry a position; GTM's view trigger relies on that to match wrappers only.
