# Virginia Home Grown Newsletter Signup

Newsletter signup embed for VPM's Virginia Home Grown. Bundles three layout variants in one preview file: full-width (split panel), inline (in-article), and sidebar. Styled from the "VPM Newsletter Design & Strategy" Figma file (June 2026) — green theme, no logo lockup (text badge only in the design).

Each form POSTs directly to Mailchimp's native embedded-form endpoint for the Virginia Home Grown audience (`list-manage.com/subscribe/post`) — no custom API, no backend, no JS. This is Mailchimp's own documented embed pattern (Audience > Signup forms > Embedded forms). The response opens in a new tab (`target="_blank"`) so the host page never navigates away.

This is unlike the combined multi-newsletter selector (`newsletter-signup/public/index.html`), which genuinely needs the shared Vercel API since one submission there can fan out across multiple audiences at once.

**Source:** VPM Newsletter Design & Strategy (Figma, June 22 2026)
