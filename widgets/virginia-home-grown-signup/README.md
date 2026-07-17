# Virginia Home Grown Newsletter Signup

Newsletter signup embed for VPM's Virginia Home Grown. Includes three layout variants: full-width (split panel), inline (in-article), and sidebar. Styled from the "VPM Newsletter Design & Strategy" Figma file (June 2026) — green theme, no logo lockup (text badge only in the design).

Each form POSTs directly to Mailchimp's native embedded-form endpoint for the Virginia Home Grown audience (`list-manage.com/subscribe/post`) — no custom API, no backend, no JS. This is Mailchimp's own documented embed pattern (Audience > Signup forms > Embedded forms). The response opens in a new tab (`target="_blank"`) so the host page never navigates away.

This is unlike the combined multi-newsletter selector (`newsletter-signup/public/index.html`), which genuinely needs the shared Cloudflare API since one submission there can fan out across multiple audiences at once.

## Files

| File | Purpose |
|---|---|
| `preview.html` | Full browser preview, all three variants combined with labels |
| `html.html` | Paste into ACF HTML field — all three variants; delete the two you don't need for a given placement |
| `css.css` | Paste into ACF CSS field — all rules scoped to `.vpm-vhg-widget`/`.vpm-vhg__*`, safe to load site-wide |

No `js.js` — this widget has no JS dependency (native Mailchimp form POST only).

**Important:** `css.css`'s reset is scoped to `.vpm-vhg-widget *` rather than a bare `* { margin: 0; padding: 0; }`. Never widen that back to a global selector — in a real ACF CSS field (usually loaded site-wide, not sandboxed to the block), an unscoped reset would zero out spacing on every element on the page, not just this widget. Same split-file structure verified working for `morning-monitor-signup` in a real WordPress test (2026-07-17).

**Source:** VPM Newsletter Design & Strategy (Figma, June 22 2026)
