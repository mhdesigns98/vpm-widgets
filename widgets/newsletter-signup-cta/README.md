# newsletter-signup-cta

Compact inline CTA banner linking to the full newsletter signup page
(https://www.vpm.org/stay-connected-to-what-matters — the combined multi-newsletter
form in `vpm-newsletter-signup`). Intended for reuse across many article/section pages
that shouldn't each embed the full signup form — one link out to the canonical page instead.

- **Namespace:** `vpm-nlcta-`
- **Format:** WordPress ACF split-file (`html.html` + `css.css`; no JS needed)
- **Deploy target:** WordPress ACF HTML/CSS fields, any vpm.org page
- **Swap before shipping:** eyebrow/title/body copy and the target URL, if the
  destination page ever changes.

Run `/ship-widget newsletter-signup-cta` before deploying into the CMS.
