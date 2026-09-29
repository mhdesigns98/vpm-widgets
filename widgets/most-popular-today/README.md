# most-popular-today

Sidebar widget showing the top 5 trending vpm.org stories over the trailing 24h, sourced
from Chartbeat. Deployed as a **WordPress Custom HTML widget** (wp-admin → Widgets → sidebar
widget area), same mechanism as the newsletter and ads widgets — not an ACF block, since the
content is the same site-wide list on every post rather than per-post data.

**Namespace:** `vpm-mpt-`

**Status:** built and `/ship-widget`-passed. Data source is a `GET /api/most-popular` route on
the `chartbeat-weekly` Cloudflare Worker, calling Chartbeat's `toppages` API server-side
(CORS-locked to `https://www.vpm.org`) so the API key never reaches the browser. Response shape:
`{ "stories": [{ "title": "...", "url": "..." }, ...] }`. Client-side cache is 5 minutes via
`sessionStorage`, matching the Worker's own in-isolate cache.

Shows the top 5 stories, ranked, with the #1 story given extra visual weight (larger, blue rank
numeral) so the list reads as an actual ranking rather than a plain bulleted list.

See `BRIEF.md` for original requirements and `HANDOFF.md` for build history and open items.
Not yet pasted into wp-admin → Widgets sidebar area.
