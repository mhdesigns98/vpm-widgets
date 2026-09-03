# CMS Test Harness

Simulates the hostile parts of VPM's real CMS environments (Brightspot, WordPress) so widgets get broken here instead of in production. Born from the Morning Monitor popup's post-deploy bugs: hydration timing, the persistent Stream Player stealing focus, and click interception.

## Usage

```bash
cd /path/to/vpm-widgets     # the repo root
python3 -m http.server 8471
# open http://localhost:8471/harness/harness.html?widget=SLUG
```

Query params:
- `widget=SLUG` — folder name under `/widgets/`
- `mode=single|acf|auto` (default `auto`) — `acf` loads `html.html`/`css.css`/`js.js` as separate injected blocks the way WordPress ACF does; `single` parses `index.html`; `auto` tries ACF first, falls back to single.

In `acf` mode only `html.html` and `css.css` are required. `js.js` is optional — a static
widget with no behavior is valid, and the harness loads it fine. Expect one 404 in the
browser console from the harness probing for the absent `js.js`; that's the harness, not
the widget.

## What it throws at your widget

1. **Delayed hydration** — injected 2.5s after page load, then detached and re-injected 3s later (watch for double-init and dead listeners)
2. **Sticky Stream Player** — fixed bottom bar at z-index 2147483000 that steals focus every 20s
3. **Hostile host CSS** — `!important` link colors, oversized headings, global letter-spacing (tests style scoping)
4. **Click interception** — invisible full-viewport overlay for the first 3s (CTAs must recover)
5. **Narrow container** — second copy rendered in a 320px sidebar
6. **JS error surfacing** — widget errors appear in the on-screen log
7. **Duplicate id audit** — the two copies are scanned for repeated `id`s after re-render. Any id inside a widget breaks the moment the block is placed twice on one page (invalid HTML; `aria-labelledby` resolves to the wrong element)
8. **Duplicate external script audit** — `<script src>` tags the widget adds are counted by URL after re-render. A vendor script (AP's resizer, a chart library, a player SDK) appended without a `querySelector` guard loads once per copy *and* again on every re-render, stacking duplicate listeners and re-running vendor init. Host-page scripts are excluded via a baseline snapshot, so two widget copies sharing one guarded vendor script reads as a pass
9. **Cross-instance independence** — each slot's `innerHTML` is snapshotted right after injection, then re-checked 2s later. A widget that finds its own root with a page-wide selector (`document.querySelector('.widget-root')` instead of scoping to its own injected container, e.g. `document.currentScript.previousElementSibling`) silently wires the second copy's async init onto the *first* copy's DOM — the tell is that one slot's markup changes (its fetch/render landed) while the other's never does. Compares relatively (one changed, one didn't) so a static widget with no async behavior in either copy reads as neutral, not a failure. First caught in `pbs-show-playlist` (2026-08-31): both copies passed the duplicate-id and duplicate-script checks while one was silently dead because of an unscoped `querySelector`.
10. **Relative CSS asset paths (single-file mode, static lint)** — the harness injects a single-file widget's markup straight into its own page, the way a raw ACF HTML block would. A widget whose real deploy is an iframe embed gets its own document at runtime, so a relative `url(...)` in its CSS resolves fine there — but resolves against the *harness's* location here, which will 404. This is flagged as a lint warning, not a live pass/fail, since it depends on deploy shape. Use an absolute URL for any local asset instead. First caught in `virginia-home-grown-playlist` (2026-09-01): the leaf-pattern background 404'd in the harness even though it would have resolved correctly once actually iframe-embedded.

Toolbar buttons let you re-run any scenario manually. Run `/ship-widget SLUG` in Claude Code for the full guided pre-deploy check.
