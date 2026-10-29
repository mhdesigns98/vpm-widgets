# Homepage Election Banner (.ga-banner): Handoff
*Status: blocked. Waiting for WPP (Web Publisher PRO) to say whether WP Additional CSS overrides of theme components are OK*
*Last updated: 2026-10-29 · restyled the promo tags as an eyebrow line and fixed CTA contrast, as a CSS override · Last verified: 2026-10-29 (CSS injected into live vpm.org homepage in a browser; checked computed styles at desktop and 375px; primary button contrast measured 7.38:1)*
*Live vs repo: diverged. The live site still shows boxed tags and a white-on-light-blue button; the CSS here has not been pasted*

## Current state
The vpm.org homepage election promo is the theme's `.ga-banner` section (vendor theme `wpp-base`, `assets/css/components.css` ~lines 122-175). It is not a paste-in block. Feedback said the two boxed tags ("VPM's Election Coverage", "Updated Through November") look like buttons. `ga-banner-eyebrow.css` fixes that, and it also fixes the "Voter Guide" button, which fails WCAG contrast (white on `#6CACE4`, 2.43:1). Nothing is live yet.

## Decisions made (and why)
- **Variant A (plain eyebrow line) over Variant B (accent rule plus the update note under the buttons).** It changes the least and keeps the freshness note near the headline. Mockups are in `elections-promo-variants.html`.
- **CSS override, not markup change.** Editors can't change the template, and markup changes need a WPP ticket. The second tag carries an inline style from the theme, so the override needs `!important`.
- **Navy text on the light-blue button, not a new color.** It uses only the theme's existing `--dark-navy` (#101820) and keeps the button color.
- **No new headline or label copy written yet.** Copy goes through the `vpm-design` skill once the questions below are answered.

## In progress / next steps
- [ ] Get WPP's answer on adding styles in Appearance → Customize → Additional CSS. If yes, paste `ga-banner-eyebrow.css` there and check the live homepage at desktop and phone width. If no, send them the CSS as a theme change request for `.ga-tag` / `.ga-btn.primary` in `components.css`.
- [ ] Answer the open questions from the Codex critique (not committed, because this repo is public): (1) push only the Voter Guide until Nov. 3 and make "Latest Stories" a text link? (2) what "Updated Through November" should mean, ideally a label that changes by phase (pre-vote, results, analysis); (3) can the banner move away from the two ads around it?
- [ ] Then draft the label and headline copy through `vpm-design`, adding a Nov. 3 date or deadline signal.

## Gotchas / things that will bite you
- `.ga-banner` styles are global: the override changes every future promo that uses this component, not just this one.
- The theme's own breakpoint stacks `.ga-inner` at 1024px (`overrides.css`), and the override's mobile rule stacks the tags at ≤768px.
- The second tag's inline style (`border:1px solid rgba(255,255,255,0.4)` etc.) is written by the template, so a theme update could change it and break the `!important` override.
- No multi-model code review was run at save time. The CSS is ~35 lines, already checked in the live page, and the banner as a whole went through a Codex critique.

## Key files
- `ga-banner-eyebrow.css`: paste-ready Additional CSS (eyebrow tags plus button contrast)
- `elections-promo-variants.html`: mockup of current vs. Variant A vs. Variant B

## Session log
- 2026-10-29: Built tag variants, chose A, wrote CSS override, ran a Codex critique, added contrast fix, verified on live page in browser. Blocked on WPP.
