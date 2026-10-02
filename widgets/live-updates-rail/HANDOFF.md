# Live Updates Rail — Handoff
*Status: parked — waiting on more newsroom feedback before any new build work*
*Last updated: 2026-10-02 · First team feedback mapped; PR #8 closed; no code changed · Last verified: unverified (no render check this session)*
*Live vs repo: n/a — never pasted into a CMS. Widget merged to main (PRs #3–#7, #12); no open PRs*

## Current state
Split-file ACF widget (`vpm-lur-`) with three variants (sidebar rail, `homepage` 3-card grid,
`mobile` tab bar) all reading one hardcoded `POSTS` array in `js.js`. Post types: `text`,
`image` (gray placeholder tile), `audio` (visual mock, no real playback), `embed` (styled quote).
All content is placeholder. `/ship-widget` has not been run.

## Team feedback received 2026-10-02 (initial — one person, more expected)
Requested content types, mapped against what exists:
- **Converted radio readers** (with/without image, sometimes linking to other publications): mostly
  works as `text` + `link`. Needs: an image allowed on any post type, an outside-source label
  ("via …"), and outside links opening in a new tab.
- **Grey-zone text** (between breaking and standard news, later folds into a story): works as `text`.
  Needs: an optional "Now part of: [full story]" link added after the story runs, plus an updated time.
- **Sound bites / video** for a later story: audio is mock only, so it needs real `<audio>`. Video
  needs a new `video` type (native `<video>` or YouTube/PBS iframe; iframe privacy/weight undecided).
- **Standalone image + caption** (e.g. a General Assembly moment): needs a real `<img>` src, body
  text optional on image posts, and a credit field separate from the caption.
- **Occasional reporter social share**: `embed` lacks a link to the original post; Share menu links
  are `#`.
- **Road closures + map** (move-in, graduations, events): the biggest lift. Probably also needs a
  `pinned` flag to keep it at the top of the rail.
- **Threading**: wanted as an option, not necessarily on at launch. A past attempt failed because
  threading was bolted onto a finished product.

## Decisions made (and why)
- **No building until more feedback arrives.** This was one person's first pass, so the schema
  shouldn't change on one input.
- **Leading proposals (not yet agreed with the team):**
  - Road closures: static map image + structured closure list (road, from/to, times), not an
    interactive map. A map library or tiles would break the widget no-outside-dependencies rule.
  - Social shares: static styled quote + link to the original, not Bluesky/X embed scripts (outside
    dependency, slow, track readers).
  - Threading: add an optional `parentId` to the schema early, but only render it behind a
    `data-threading="on"` flag. This would replace the earlier `followUpOn` follow-up-post idea;
    use one field, not both.
- **Content source matters more than any single feature.** Every request assumes reporters post
  fast; today a post means editing `js.js`. The likely fix is a WordPress "Update" post type read
  through the REST API. That's theme work, so it probably goes through a Web Publisher PRO ticket.

## In progress / next steps
- [ ] Collect the rest of the team's feedback; merge it into the list above before building.
- [ ] Decide the content source (WP post type + REST vs other) and whether it needs a vendor ticket.
- [ ] Proposed build order once feedback is in: content source → real image + real audio →
      source label / "Now part of" link / `pinned` → video + closure format. Add `parentId` early
      (nearly free).
- [ ] Threading open questions: does a thread move to the top on a new reply; collapsed or open;
      shareable link to a single reply; how homepage/mobile show threads.
- [ ] Replace hardcoded `time` strings and the static "Updated just now" with ISO timestamps + relative formatting.
- [ ] Sanitize post content. `renderPost()` injects `body` as raw HTML, which is unsafe once a CMS feeds it.
- [ ] Each new post type needs a homepage-variant card, or a rule that it can't be `homepageFeatured`.
- [ ] Wire real audio (no `<audio>` element exists yet).
- [ ] "See all updates" links point to `#` and need a real destination (threading/archive page too).
- [ ] Mobile variant "The story" tab is inert. Decide (with team feedback) whether mobile keeps tabs at all.
- [ ] Replace placeholder `POSTS` with real editorial content.
- [ ] Run `/ship-widget live-updates-rail` before any CMS paste.

## Gotchas / things that will bite you
- PR #8 (closed, branch kept) made the mobile tab a "Stories" switcher with a placeholder article list. Closed because it conflicted with this handoff, used `#` links for content the widget doesn't own, and lacked `tabpanel`/`aria-controls`/arrow keys. Reopen as a starting point only if mobile keeps tabs.
- Homepage variant drops share/copy-link/audio chrome. Never flag an audio post `homepageFeatured: true`.
- The original design mock had real reporter bylines and invented candidate quotes. Don't restore
  real names without real, sourced copy.
- `followUpOn` (from 2026-10-01) is superseded by the `parentId` threading proposal. Don't build both.
- No `id` attributes anywhere: the block may appear more than once on a page.

## Key files
- `js.js` — `POSTS` array + schema comment, all rendering and behavior
- `css.css` / `html.html` — styles and sidebar-rail markup (ignored by homepage/mobile variants)
- `preview.html` — Desktop/Mobile showcase
- `README.md` — post types, variants, placeholder-content note

## Session log
- 2026-10-02: Closed PR #8 (reasons in Gotchas). Mapped the first team feedback (new content types + threading) against the widget; no code changes; parked pending more feedback.
- 2026-10-01: Wide-screen preview layout (PR #12); explored follow-up posts (`followUpOn`), not built.
- 2026-09-30: Widget filed + homepage and mobile variants + preview showcase (PRs #3–#7); PR #8 opened.
