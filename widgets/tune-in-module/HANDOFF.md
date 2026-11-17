# Tune-in Module — Handoff
*Status: active — built and merged; pasted on the staging test post, not yet on vpm.org*
*Last updated: 2026-11-17 · Built, critiqued, shipped and iterated the merged Watch + Listen CTA (PRs #58–#64) · Last verified: 2026-11-17 — staging test post measured in-browser after the final re-paste: both copies (623px main, 296px sidebar) have all 8 labels centered, all buttons 52px, no overflow, Public Sans loaded*
*Live vs repo: in sync on staging (re-pasted from `main` after #64); not on vpm.org yet*

## Current state
`widgets/tune-in-module/` is a single-file, no-JS WordPress HTML block: a VPM dark-blue band with a Watch group (VPM PBS, PBS Kids, VPM on YouTube, More PBS channels), a Listen group (VPM News 88.9, VPM Music, Podcasts, Past music shows) and a "TV and radio schedules" link. It merges the old `watch-page-header` and `listen-stream-bar`. `/ship` passed (harness, hostile CSS, keyboard, WebKit) before the later label/size/dot changes; each later change was re-linted and re-measured, but the full harness was not re-run after #61–#64.

## Decisions made (and why)
- **Text buttons, not image tiles** — the module sits above a show list and must stay short; tile images said less than labels.
- **Container queries, not viewport media queries** — a sidebar copy on a wide screen overflowed under media queries.
- **Every button 52px (room for two lines)** — wrapped labels made rows uneven; uniform height beats avoiding every wrap. Costs ~60px of height on phones.
- **No live dots or legend** — labels already identify the stations; the dots needed a legend, ate label width and caused most alignment bugs.
- **Labels use vpm.org's own names** (VPM News 88.9, VPM Music, Past music shows) so outsiders understand them.
- **No tracking code** — GA4's existing `click` event already logs `link_classes` + `link_url`; report on `click` where Link classes contains `vpm-tunein`. Renaming those classes breaks report continuity.
- **bit.ly stream links stay** (Mark confirmed they're correct). **Watch links open new tab, Listen links same tab** (matches originals).
- **Phone view hides the "Tune in to VPM" h2 visually** (kept for screen readers) — three stacked headings above the buttons was too much.

## In progress / next steps
- [ ] Decide placement on vpm.org/shows (below the "Shows" heading, or a sidebar) by viewing it on staging; both widths pass.
- [ ] Paste `<section class="vpm-tunein">…</section>` from `index.html` into a WordPress Custom HTML block on vpm.org/shows.
- [ ] Re-run `/ship tune-in-module` once before the vpm.org paste (the harness pass predates #61–#64).
- [ ] Ask the site team whether the header radio player can be linked to; the stream buttons currently open raw MP3 files (WCVEFM.mp3, WCVEHD2.mp3) outside vpm.org.
- [ ] Small hardening PR from the end-of-session review (Codex + agy): add `position: relative` to `.vpm-tunein__btn` so the hidden screen-reader span is contained; add `clip-path: inset(50%)` alongside `clip` in `.vpm-tunein__sr`; wrap the schedules `&rarr;` in `<span aria-hidden="true">`; merge the duplicate `.vpm-tunein__intro` rule in the 600px block; add the schedules link to the reduced-motion reset. Re-run `/ship` after.
- [ ] Later: consider replacing the Watch and Listen page headers with this widget.

## Gotchas / things that will bite you
- vpm.org returns 403 to curl; use a real browser to inspect it.
- "Washed-out" button colours in an editor screenshot were not from the theme (vpm.org has no global link hover/opacity rule); judge on the front-end preview, not the editor.
- The staging test post's console error ("Unexpected token '<'") comes from the newsletter signup block (doubled `<script>` tag), not this widget. No live vpm.org page has it; the source is an old snippet file in the `newsletter-signup` repo (fix: mhdesigns98/newsletter-signup PR #6, unmerged as of 2026-11-17).
- **Paste as an admin.** WordPress strips the inline `<style>` from Custom HTML blocks saved by anyone without the `unfiltered_html` capability (Editors/Authors by default), leaving the band unstyled. If an editor later re-saves the post, check the styles survived.
- **bit.ly may be blocked** by ad/tracker blockers and some school or office networks (staging already logged `ERR_BLOCKED_BY_CLIENT` requests). If stream clicks look low in GA4 or users report dead buttons, swap the bit.ly links for their direct stream URLs.
- The old `/listen/stream?channel=…` player URLs from the Brightspot era now 404.

Review: multi-model (Codex + agy, 2026-11-17) on the full widget diff. Rejected as checked: uneven heights with `grid-auto-rows` (measured 52px for every button, wrapped or not), `clip: rect(0 0 0 0)` "invalid" (browsers accept it; hidden text measured working), `wpautop` breaking the style block (Custom HTML blocks aren't auto-paragraphed; staging rendered correctly), container-query fallback (supported in all current browsers).

## Key files
- `widgets/tune-in-module/index.html` — the widget; paste only the `<section>` block.
- `widgets/tune-in-module/README.md` — usage, GA4 reporting recipe.
- Staging test post: `https://stg-vpmnews-staging.kinsta.cloud/uncategorized/2026-11-17/test-preferred-source-widget/`

## Session log
- 2026-11-17: Evaluated merging Watch + Listen headers; built, critiqued (Codex), shipped; GA4 attributes added then dropped for existing click tracking; relabelled for outsiders; equal-height buttons; centered labels; removed live dots. PRs #58–#64 merged.
