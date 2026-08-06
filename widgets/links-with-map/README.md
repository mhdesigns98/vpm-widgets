# Links With Map

A reusable two-pane directory block: a Google My Maps embed beside a multi-column list of
outbound links. Built for VPM's WordPress ACF Code Block fields; the first instance is the
Virginia wineries directory (62 wineries, A–Z).

On the Un-Wine'd page it sits below [`unwined-episode`](../unwined-episode/), whose jump links
target it. The `#vineyards` anchor belongs to the page, not to this block — wrap it:

```html
<div id="vineyards" style="scroll-margin-top: 96px;"></div>
<!-- this block goes here -->
```

That keeps the block id-free and safe to place twice. See `unwined-episode/README.md` for the
combined single-field stylesheet if you'd rather paste one CSS for the whole page.

## Per-instance changes

Only two things change between uses:

1. **The map** — swap the `src` on `.vpm-lwm__frame` for any Google My Maps embed URL, and
   update the iframe `title` to describe it.
2. **The list** — replace the `<li class="vpm-lwm__item">` entries, and the
   `.vpm-lwm__heading` text above them.

Map side is a modifier on the section: `vpm-lwm--map-right` puts the map on the right (what
the wineries page uses); remove it and the map goes left. The flip only applies in the
side-by-side layout — stacked, the map is always first.

Layout knobs are custom properties on `.vpm-lwm` and are safe to override per instance:
`--vpm-lwm-col-width` (minimum width of one column of links, default `14rem` — two columns
need `2 × col-width + col-gap` to fit the list pane, so raising it past ~15rem drops the pane
back to a single column at typical article widths),
`--vpm-lwm-gap`, `--vpm-lwm-sticky-top`, and `--vpm-lwm-player-clearance`.

## Usage (ACF split-file)

| ACF field | File |
|---|---|
| HTML | `html.html` |
| CSS | `css.css` |

There is no `js.js` — the block is static. The harness treats a missing `js.js` as valid and
logs one 404 while probing for it; that's the harness, not the widget.

`preview.html` is a browser-only preview. It inlines the CSS and renders three shells (full
width map-right, full width map-left, 320px sidebar), cloning the single source instance via
a small script so the 62 links live in one place in that file. Nothing in `preview.html` ships.

## Notes

- No `id` attributes anywhere. The section's accessible name comes from `aria-label`, so the
  block is safe to place more than once on a page.
- The list uses CSS multi-column rather than grid, because columns flow down-then-across and
  that's the only flow that keeps an A–Z list scannable in more than one column.
- Layout switches on a container query at 860px, not a viewport media query, so it stacks
  correctly inside a narrow sidebar on a wide page.
- The grid lives on an inner `.vpm-lwm__grid`, not on `.vpm-lwm` itself — an element can't
  respond to its own container query, only its descendants can.
- The sticky map is height-capped with `--vpm-lwm-player-clearance` so the fixed Stream Player
  can't cover its lower edge.
- Link color carries `!important`, matching `elections-2026-primary-cta`. It's the one place the
  host fights back with `!important` of its own (`.article-body a { color: … !important }`), and
  without it the links render in the host's forced color.
