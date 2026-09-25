# Virginia Home Grown Playlist — Brief
*Written: 2026-09-01*

## Problem / Why
`pbs-show-playlist` (the generic PBS episode-playlist widget, currently hardcoded to Virginia
Home Grown's show ID) is styled with generic VPM tokens — dark blue / yellow. The Show
Producer asked for it to look like Virginia Home Grown's own sub-brand instead, matching the
green/leaf-pattern look already established in `virginia-home-grown-signup`.

## User moment
Unchanged from the original widget's brief: a Virginia Home Grown viewer lands on the show
page after watching an episode on TV or seeing a social post. They want to watch that episode
(or the latest one) and browse recent episodes they may have missed — without leaving the page.

## What done looks like
- New dedicated widget at `vpm-widgets/widgets/virginia-home-grown-playlist/`
- Same data and functionality as `pbs-show-playlist` — PBS Media Manager via the existing
  `pbs-api` Cloudflare Worker, thumbnail strip, click-to-swap, autoplay-next on completion,
  postMessage height auto-resize (WordPress iframe embed)
- Visually rebranded to VHG's green sub-brand: `--vhg-green` (#2E8B57) / `--vhg-green-dark`
  (#194225), Oswald uppercase headlines, leaf-pattern background accents, `.vpm-vhg__*` class
  namespace — matching `virginia-home-grown-signup`'s established look
- `pbs-show-playlist` is left untouched, understood as the generic template other PBS shows
  duplicate from (per its own brief's out-of-scope note)
- Ships through `/ship-widget` before going anywhere near WordPress

## Out of scope (v1)
- Any functional/behavioral change — this is visual only, not a feature request
- Season filtering, search, watch history, full archive (same exclusions as the original widget)
- Changes to `pbs-show-playlist` itself

## Deploy target & constraints
Same as `pbs-show-playlist`: WordPress iframe embed on the vpm.org Virginia Home Grown show
page, widget HTML hosted on the Widget Lab (GitHub Pages), no external dependencies beyond the
existing `pbs-api` Worker.

## Open questions
None — confirmed this replaces `pbs-show-playlist` on the live VHG show page once shipped.
