# Live Updates Rail

A vertical rail of short reporter dispatches (microblog-style) for placement beside a story, on
a landing/topic page, or in a mobile "Updates" tab. Imported from a Claude Design mock; the
mock's reporter names and quotes were replaced with generic placeholders before filing here (see
below).

**Namespace:** `vpm-lur-`

**Deploy target:** WordPress ACF Code Block (split-file: `html.html` + `css.css` + `js.js`).

**Post types:**
- `text` — byline, timestamp, category, body (4-line clamp + "Show more" toggle if it overflows),
  optional "read more" link
- `image` — placeholder tile + optional caption; swap the placeholder `<div>` in `js.js`'s
  `renderPost()` for a real `<img>` once a source is wired in
- `audio` — play/pause button, scrubbable progress bar, elapsed/remaining time. **This is a
  visual mock only** — it animates a fake progress bar on a timer, there's no real `<audio>`
  element. Wiring up real playback is an open follow-up (see `HANDOFF.md`).
- `embed` — imported social-post styling (handle, source, quote)

**Content editing:** all post content lives in the `POSTS` array near the top of `js.js` — add,
remove, or reorder items there. The comment block above the array documents every field.

**Content placeholder note:** the original design mock used real VPM reporter bylines and
invented quotes attributed to actual candidates. Those were replaced with generic placeholder
names/quotes in this filed version — don't paste real names back in without real, sourced
copy behind them.

**Display variants:** all three read from the same `POSTS` array — set `data-variant` on the
`.vpm-lur` root; `js.js` renders the `homepage` and `mobile` variants' markup itself, so
`html.html`'s inner markup is ignored in either of those modes.
- Default (no `data-variant`) — vertical sidebar/desktop rail.
- `data-variant="homepage"` — condensed 3-card grid on the dark-blue brand field. Shows only
  posts flagged `homepageFeatured: true` in `js.js` (a hand-picked text/image/embed trio, matching
  the original design — it does **not** just take the first 3 posts). No share/copy-link/
  audio-scrub chrome, matching the original.
- `data-variant="mobile"` — adds a two-tab bar ("Stories" / "Updates · N") above the rail and
  swaps the icon+text share/copy-link row for full-width 44px touch buttons. "Stories" shows a
  placeholder list (`STORIES` array in `js.js`) standing in for the main article list this widget
  sits beside — real content, and a real relationship to the actual article feed, is still an
  open follow-up (see `HANDOFF.md`).

Run `/ship-widget live-updates-rail` before deploying to the CMS.
