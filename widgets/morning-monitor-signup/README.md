# Morning Monitor Newsletter Signup

Newsletter signup embed for the VPM Morning Monitor. Includes three layout variants: full-width, inline (in-article), and sidebar. Styled from the "VPM Newsletter Design & Strategy" Figma file (June 2026).

Each form POSTs directly to Mailchimp's native embedded-form endpoint for the Morning Monitor audience (`list-manage.com/subscribe/post`) — no custom API, no backend, no JS. This is Mailchimp's own documented embed pattern (Audience > Signup forms > Embedded forms). The response opens in a new tab (`target="_blank"`) so the host page never navigates away.

This is unlike the combined multi-newsletter selector (`newsletter-signup/public/index.html`), which genuinely needs the shared Cloudflare API since one submission there can fan out across multiple audiences at once.

## Files

| File | Purpose |
|---|---|
| `preview.html` | Full browser preview, all three variants combined with labels |
| `html.html` | Paste into ACF HTML field — all three variants; delete the two you don't need for a given placement |
| `css.css` | Paste into ACF CSS field — all rules scoped to `.vpm-mm-widget`/`.vpm-mm__*`, safe to load site-wide |

No `js.js` — this widget has no JS dependency (native Mailchimp form POST only).

**Important:** `css.css`'s reset is scoped to `.vpm-mm-widget *` rather than a bare `* { margin: 0; padding: 0; }`. Never widen that back to a global selector — in a real ACF CSS field (usually loaded site-wide, not sandboxed to the block), an unscoped reset would zero out spacing on every element on the page, not just this widget.

A real WordPress test (2026-07-17) using an earlier, unsplit version (one file with an inline `<style>` tag, pasted into a single "HTML" field) showed the widget's structure/copy rendering but its styling missing (no button background, no decorative shapes) while the rest of the host page looked untouched — consistent with WordPress stripping the inline `<style>` tag from that field. The fix is this proper three-field split; the unscoped-reset risk above was a separate, related issue fixed proactively at the same time, not confirmed as the cause of that specific screenshot.

**Source:** VPM Newsletter Design & Strategy (Figma, June 22 2026)
