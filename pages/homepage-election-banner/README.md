# Homepage Election Banner

A CSS override for the election promo on the vpm.org homepage. The promo is the theme's own `.ga-banner` section, not a pasted block, so this build is a stylesheet only. It shows the two boxed tags as a plain eyebrow line, so they no longer look like buttons. It also gives the light-blue "Voter Guide" button navy text so it meets WCAG contrast (7.38:1), and sizes the buttons and photo for phone widths (768px and below).

- **Live URL:** https://www.vpm.org/ (homepage election promo)
- **Status:** not pasted. Waiting to confirm whether WordPress Additional CSS may override theme components. See `HANDOFF.md`.
- **Paste:** `ga-banner-eyebrow.css` goes whole into Appearance → Customize → Additional CSS. It changes every promo that uses `.ga-banner`, not just this one.
- **Preview:** `elections-promo-variants.html` mocks up the current banner next to Variant A (built) and Variant B (not built).

No widgets used.
