# AP Election Results Embed

Frames the Associated Press live-results iframe in VPM chrome for a dedicated
`/elections/results` page: a full-bleed dark-blue hero, the results panel overlapping up
into it on a white card with the 3-stripe accent bar, and a disclosure note making clear
that AP — not VPM News — calls races.

**Source:** option `1b` from the Claude Design project
[AP Election Results Embed](https://claude.ai/design/p/708851ce-2dce-423c-9bb6-374b4edac521?file=AP+Election+Results+Embed.dc.html).
Rebuilt from the design-canvas mockup — namespaced, tokens inlined, container-query
responsive, hardened against hostile host CSS.

**Namespace:** `vpm-apres-` · **Target:** Brightspot HTML Embed module

## Files

| File | Purpose |
|---|---|
| `index.html` | The paste target — scoped `<style>` + markup in one block |
| `preview.html` | Browser preview at three container widths |

Brightspot takes a single HTML field, so this is a single file rather than the ACF
split-file shape some other widgets use.

## Customizing

- **AP layout** — the `src` on `.vpm-apres__frame` points at AP layout `57278/30777`.
  Swap the URL to point at a different published AP layout.
- **Copy** — eyebrow, status pill, `<h2>`, dek, panel label and note are plain text.
  Keep the copy **day-agnostic**: name dates rather than saying "today," so the same
  block runs the day before, on Election Day, and through the certification days.
- **Status pill** — "Polls closed 7 p.m." is the one line that genuinely changes on the
  day. Before polls close, something like "Polls close 7 p.m." reads correctly.

## Notes

### Heading level
The title is an `<h2>`, on the assumption that the Brightspot page template renders its
own page headline above the module. **If it doesn't, promote it to `<h1>`** — a results
page with no `h1` is its own accessibility problem. There is a comment in the markup at
that spot.

### Full-bleed
Brightspot embed modules render inside a constrained content column, so the hero is
*not* edge-to-edge by default. `index.html` carries a commented-out breakout rule
(`margin-left: calc(50% - 50vw)`) near the top of the style block. Enable it only after
checking the page template: it fails silently if any ancestor sets `overflow: hidden`,
and it introduces horizontal scroll on pages whose scrollbar is counted in `100vw`.

### AP's resizer — an approved external dependency
The widget loads
`https://interactives.apelections.org/election-results/assets/microsite/resizeClient.js`.
This is a **deliberate exception** to the repo's no-external-dependencies rule, approved
because without it the results iframe either scrolls internally or leaves dead space as
races expand. Verified working: the frame grew 520px → 1468px once results rendered.

It's loaded through a guard (`document.querySelector('script[src*="…"]')`) rather than a
bare `<script src>`, because Brightspot may detach and re-inject the block and a bare tag
would append a second copy each time. One script serves every copy of the widget on the
page. The iframe keeps `min-height: 520px` as a floor, so if the script is blocked the
panel still holds its shape.

### The one un-namespaced class
`ap-embed` on the iframe is **required and must not be renamed**. AP's resizer selects
`iframe.ap-embed` — verified by reading the script source — so namespacing it silently
breaks auto-resize with no error. It's the only class in the widget outside `vpm-apres-*`.

### Responsive
Layout is driven by **container queries** on the widget's own width, not the viewport, so
a copy in a 320px sidebar lays out narrow even on a 1440px page. Three steps:

| Container | Hero pad-bottom | Panel overlap | Panel inset |
|---|---|---|---|
| ≥ 900px | 120px | −96px | 40px |
| 600–899px | 72px | −56px | 24px |
| < 600px | 32px | none | 0 |

The overlap is decoration and is dropped entirely below 600px, where it would otherwise
eat the dek. A `@supports` viewport fallback covers engines without container queries —
approximate only, since it keys off the window.

The container queries target `.vpm-apres__inner`, not `.vpm-apres`. That wrapper exists
solely because a `@container` rule styles a container's *descendants* and can never style
the container element itself. Don't remove it — the responsive steps silently stop
working if you do.

### Type
`tokens.css` fonts are declared but **not** `@import`ed — a webfont fetch would be a second
external dependency and a render-blocker. Public Sans / Oswald apply if vpm.org already
serves them, otherwise it falls back through GT America to system sans.

## Pre-ship

Run through the CMS harness — **passes**:

- No `id` attributes; safe placed twice on a page
- Survives delayed hydration + detach/re-inject; resizer script stays at exactly 1
- Styles hold under hostile host CSS (`a { color: … !important }`, 3rem `h2`, global
  letter-spacing). The note link needs `!important` on its color for this — that's why
  it's there, and it's scoped tightly enough that the host's own links stay red.
- No horizontal scroll at 320px; no console errors
- Visible focus ring on the note link; no z-index fight with the sticky Stream Player

Contrast (all pass AA): dek 10.7:1, eyebrow 6.6:1, source credit 6.0:1, note link 10.8:1.

`/ship-widget ap-election-results` **passed** on 2026-08-04. All eight harness scenarios,
accessibility, and convention audit green; see the session report. Re-run it if the AP
layout URL or the resizer dependency changes.
