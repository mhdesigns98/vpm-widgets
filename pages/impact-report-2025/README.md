# 2025 Impact Report

The 2025 Impact Report page on vpm.org, as deployed: hero, sticky jump-links nav, and the
"Awards Received During 2025" section. A **full page** assembled from WordPress Code Blocks,
not a single embed — same shape as `basics-virginia/`.

- **Live (staging):** https://vpmnews.kinsta.cloud/understanding-impact-of-vpm/
- **Preview:** https://mhdesigns98.github.io/vpm-widgets/pages/impact-report-2025/preview.html
- **Predecessor:** `annual-report-2025/` — the earlier single-file build of the same report.

## Files

| File | Where it goes |
|---|---|
| `css.css` | one Code Block, inside `<style>`, placed above the hero block. Covers the whole page. |
| `js.js` | any Code Block, inside `<script>` — placement no longer matters, see below. |
| `html-hero-nav.html` | the hero + jump-links Code Block |
| `html-awards.html` | the awards Code Block |
| `preview.html` | local/GitHub Pages preview only — not pasted anywhere |

## Page assembly — the jump-link anchors

**All seven jump links in `html-hero-nav.html` point at anchors the *page* owns, not this
folder.** Their absence from these files is intentional. Do not "fix" it by adding ids here.

Each target is a CMS section header block, placed above the corresponding content:

```html
<section class="page-section page-section-header" id="awards"> … </section>
```

| Jump link | Anchor lives on |
|---|---|
| `#leadership` | CMS section header |
| `#making-impact` | CMS section header |
| `#news` | CMS section header |
| `#arts-culture` | CMS section header |
| `#education` | CMS section header |
| `#thank-you` | CMS section header |
| `#awards` | CMS section header, placed directly above the `html-awards.html` block |

`#awards` is the one that looks wrong and isn't. `html-awards.html` carries
`id="vpm-awards2025-title"` on its `<h2>` — that's the `aria-labelledby` target, not a jump
target — and deliberately has no `id="awards"`, because an earlier version had that id
duplicated across two nested sections. The CMS header sitting above the block is what the
Awards link resolves to.

**Scroll offset.** These CMS headers have no `scroll-margin-top` of their own, and
`.vpm-jump-links` is `position: sticky; top: 0`, measured at 61px tall on staging — so before
this fix every jump landed the heading at `top: 0`, fully behind the nav. `css.css` handles it
page-wide with `html { scroll-padding-top: 96px }`, which puts the heading 35px clear. Raise
that value if the sticky site header or the persistent player grows.

Two things that look like they already cover this, and don't:

- `.impact-section { scroll-margin-top: … }` in `css.css` doesn't apply — the CMS headers
  aren't `.impact-section`.
- `--vpm-cms-header-height` doesn't reach them either. `js.js` sets it on the
  `.vpm-impact-component` element (the awards section), not on `:root`, so it inherits only to
  that section's descendants.

Verified live on staging 2026-08-06: all seven ids present in the DOM, all seven resolve.

Same pattern, differently owned: `unwined-episode/README.md` documents page-supplied anchors
for a block whose targets the *editor* must wrap by hand. Here the CMS section headers already
supply them, so there is nothing for the editor to add.

## Why this exists (the bug it fixes)

The awards counts rendered as nothing. Two independent causes, both traced to a
`.vpm-impact-component` wrapper element that the shared CSS and JS assumed but which the page
never had:

1. **Invisible numbers.** The shared stylesheet declared *every* design token on
   `.vpm-impact-component` — including `--vpm-gold`. With no wrapper, `--vpm-gold` resolved to
   empty, so `.num-box`'s `background: linear-gradient(135deg, var(--vpm-gold) 0%, #F5FF4D 100%)`
   was invalid at computed-value time and fell back to transparent. The numbers are
   `color: var(--vpm-navy)` = `#003865`, sitting on the section's `#003865` navy panel — contrast
   ≈ 1:1. `--vpm-navy` survived only because a second stylesheet also declared it at `:root`.
   **Fix:** tokens promoted to `:root` in `css.css`, plus `--vpm-gold: var(--vpm-yellow)` as an
   alias so the naming mismatch between the two sheets can't recur.

2. **Counters stuck at 0.** The script's second line is
   `const root = document.querySelector(".vpm-impact-component"); if (!root) return;`. Adding the
   class to the awards section is necessary — but not sufficient, because the script ran inline
   during parsing from a Code Block *above* the awards markup, so the query returned null anyway.
   **Fix:** `js.js` defers to `DOMContentLoaded`. Body is byte-identical to the original; only the
   wrapper changed.

The awards section therefore carries the class as the script's hook:

```html
<section class="impact-section vpm-impact-component">
```

`css.css` includes a `.vpm-impact-component.impact-section` neutralizer so using the class this
way doesn't drag in the standalone-page framing (`max-width`, white background, padding, Inter).

Also fixed while in there: `.impact-card__title` referenced `--font-heading` and `--color-navy`,
neither ever declared anywhere; and `id="awards"` was duplicated across two nested sections
(it now lives only on the CMS-generated section header — see *Page assembly* above).

## Deviations from the Widget Lab conventions

Called out deliberately — this is a page, not a self-contained embed:

- **Tokens live on `:root`, not copied into a scoped block.** That is the fix. Scoping them to a
  wrapper is exactly what broke the page. `tokens.css` is still the canonical source of the values.
- **Classes are not all under one namespace.** Three namespaces coexist as deployed:
  `vpm-impact25-*` (hero, jump links), `vpm-awards2025 *`, and the unprefixed shared
  `.impact-*` / `.numbers-*` / `.testimonial-card` set.
- **`css.css` retains rules for sections not on this page** (`.impact-nav`, `.impact-card*`,
  `.numbers-*`, `.letter-details`, `.testimonial-card`). The sheet is shared with the other
  impact-report sections; pruning them would break those.
- **The script's scrollspy is dead code here.** It targets `.impact-nav` / `.nav-link`, but this
  page's nav is `.vpm-jump-links`. Sticky-nav highlighting will not work until those selectors are
  reconciled. Same for the letter `read more` toggle (`.letter-details`, absent).

## Verification status

Verified live on staging: `--vpm-gold` resolves, `.num-box` and `.total` render the gold gradient,
and the counters animate to 11 / 6 / 4 / 3 / 2 / 2 / 1 (total 29) when scrolled into view.
The `DOMContentLoaded` branch was tested in isolation for both `readyState` paths; the full
parse-order run on a fresh page load has not been re-checked since `js.js` was pasted in.

Jump-link anchors verified on staging 2026-08-06 by DOM inspection: all seven ids
(`leadership`, `making-impact`, `news`, `arts-culture`, `education`, `thank-you`, `awards`) are
present as `.page-section-header` sections and resolve. The `scroll-padding-top: 96px` added to
`css.css` on the same date is **not yet live** — it takes effect when the stylesheet Code Block
is re-pasted.
This page has **not** been through `/ship-widget` — see the pre-ship checklist in the repo
`CLAUDE.md`. Note it would flag the `id` attributes the CMS section headers rely on.
