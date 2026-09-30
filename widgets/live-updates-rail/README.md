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

**Scope note:** the design mock also showed a distinct homepage 3-column dark-blue treatment of
the same feed. That's a visually different layout (not just a narrower rail) and wasn't built
here — flagged as an open question in `HANDOFF.md` rather than guessed at.

Run `/ship-widget live-updates-rail` before deploying to the CMS.
