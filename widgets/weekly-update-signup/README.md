# Weekly Update Newsletter Signup

Newsletter signup embed for VPM's Weekly Update. Includes three layout variants: full-width, inline (in-article), and sidebar. Styled from the "VPM Newsletter Design & Strategy" Figma file (June 2026) — navy background, light-blue CTA, yellow "weekly" accent.

Each form POSTs directly to Mailchimp's native embedded-form endpoint for the Weekly Update audience (`list-manage.com/subscribe/post`) — no custom API, no backend, no API key. This is Mailchimp's own documented embed pattern (Audience > Signup forms > Embedded forms).

A small inline script progressively enhances that: it intercepts the submit and calls the same endpoint's JSONP variant (`/subscribe/post-json?…&c=callback`), so the real Mailchimp result is confirmed in-page ("You're all set! Thank you for subscribing…") instead of in a Mailchimp-hosted new tab. Errors — an invalid address, a rejected domain — render in-place too. The native `action`/`method`/`target="_blank"` attributes are left intact, so with JS off (or if Mailchimp returns something unusable) the form still submits natively exactly as it did before.

This is unlike the combined multi-newsletter selector (`newsletter-signup/public/index.html`), which genuinely needs the shared Cloudflare API since one submission there can fan out across multiple audiences at once.

## Files

| File | Purpose |
|---|---|
| `preview.html` | Full browser preview, all three variants combined with labels |
| `html.html` | Paste into ACF HTML field — all three variants; delete the two you don't need for a given placement |
| `css.css` | Paste into ACF CSS field — all rules scoped to `.vpm-wu-widget`/`.vpm-wu__*`, safe to load site-wide |

The JS is a single inline `<script>` at the bottom of `index.html` (IIFE, no dependencies) handling the JSONP submit for all three layout variants. Nothing external to load.

**Important:** `css.css`'s reset is scoped to `.vpm-wu-widget *` rather than a bare `* { margin: 0; padding: 0; }`. Never widen that back to a global selector — in a real ACF CSS field (usually loaded site-wide, not sandboxed to the block), an unscoped reset would zero out spacing on every element on the page, not just this widget. Same split-file structure verified working for `morning-monitor-signup` in a real WordPress test (2026-07-17).

**Source:** VPM Newsletter Design & Strategy (Figma, June 22 2026)
