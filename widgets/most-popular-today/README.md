# most-popular-today

Sidebar widget showing the top 5 trending vpm.org stories over the trailing 24h, sourced
from Chartbeat. Deployed as a **WordPress Custom HTML widget** (wp-admin → Widgets → sidebar
widget area), same mechanism as the newsletter and ads widgets — not an ACF block, since the
content is the same site-wide list on every post rather than per-post data.

**Namespace:** `vpm-mpt-`

**Status:** stub — the widget's fetch/render/cache logic is built, but `ENDPOINT` in the
`<script>` block is a placeholder. It needs a real data source before this can ship:

- Likely a small Cloudflare Worker proxying the Chartbeat API (reusing or extending
  `chartbeat-weekly`'s existing integration), so the Chartbeat API key isn't exposed in the
  pasted wp-admin widget HTML.
- Expected response shape: `{ "stories": [{ "title": "...", "url": "..." }, ...] }`.
- Cache interval currently set to 15 minutes via `sessionStorage`; not yet confirmed against
  the brief's open question.

See `BRIEF.md` for full requirements and open questions. Run `/ship-widget most-popular-today`
before deploying, once the endpoint is real.
