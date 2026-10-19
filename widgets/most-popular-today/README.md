# most-popular-today

Sidebar widget showing the top 5 trending vpm.org stories over the trailing 24h, sourced
from Chartbeat. Used in two places:

- **Post-page sidebar**: a WordPress Custom HTML widget (wp-admin → Widgets → sidebar widget
  area), same mechanism as the newsletter and ads widgets.
- **Homepage hero sidebar**: pasted into the hero's Shared Module slot (a code block).

It's not an ACF block, since the content is the same site-wide list everywhere.

**Namespace:** `vpm-mpt-`

**Status:** built and `/ship-widget`-passed. Data source is a `GET /api/most-popular` route on
the `chartbeat-weekly` Cloudflare Worker, calling Chartbeat's `toppages` API server-side
(CORS-locked to `https://www.vpm.org`) so the API key never reaches the browser. Response shape:
`{ "stories": [{ "title": "...", "url": "..." }, ...] }`. Client-side cache is 5 minutes via
`sessionStorage`, matching the Worker's own in-isolate cache.

Shows the top 5 stories, ranked, with the #1 story given extra visual weight (a divider under it
and a bolder title) so the list reads as an actual ranking rather than a plain bulleted list.

## Homepage hero presets

The wpp-base theme adds `.hero-theme-election`, `.hero-theme-breaking` or `.hero-theme-pledge`
to `.hero-section` (no class = standard white). The widget's colors are `--mpt-*` roles, and each
preset only reassigns them. Inside a themed hero it also clears the theme's white
`section.page-code-block` wrapper (one `:has(.vpm-mpt)` rule), and in breaking and pledge it drops
its own top rule because the hero grid already draws one.

**Theme-owned color exception.** The hero-preset colors belong to wpp-base
(`assets/css/homepage-extras.css`), not `tokens.css`, so the widget mirrors them on purpose:
pledge gold `#f2a900`, pledge hover `#7a5200`, and the theme's `--red` (fallback `#c8102e`, which
differs from `--vpm-red`). Don't move them into `tokens.css` or "correct" them to token values.
If the theme changes a preset, update the matching block at the end of the widget's `<style>`.
`/ship` treats these three values as an accepted exception to the no-hard-coded-hex rule.

See `BRIEF.md` for original requirements and `HANDOFF.md` for build history and open items.
Not yet pasted into wp-admin → Widgets sidebar area. Staging's homepage hero runs an older paste
(8 items, no hero-preset support); re-paste from `index.html`.
