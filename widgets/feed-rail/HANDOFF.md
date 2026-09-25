# Feed Rail — Handoff
*Status: active — shipped to Widget Lab, not yet pasted into a live vpm.org CMS block*
*Last updated: 2026-09-21 · scaffolded, shipped, design-reviewed, Codex-reviewed, and fixed in one session · Last verified: 2026-09-21 — loaded in a real browser via local server, checked with Playwright screenshots + DOM evaluation (row heights, kicker colors, link vs. div rendering, zero IDs inside widget, host `box-sizing` unaffected), re-ran the CMS test harness after the last fix (hydration, sticky player, click-interception, narrow column, harness explicitly confirmed "No id attributes in the widget — safe to place more than once")*
*Live vs repo: in sync — `git status` clean, nothing unpushed, GitHub Pages preview reflects the latest commit*

## Current state
A self-contained widget at `widgets/feed-rail/index.html` renders a vertical rail of short
updates. Four content types are supported: `video` (YouTube thumbnail + play overlay, no API
key), `article`/`link` (optional thumbnail, no thumb tile if no image), `audio` (optional
thumbnail, headphone-icon fallback), and `text` (no thumbnail, optional URL — can be a plain
non-clickable note). Content lives entirely in a `FEED_ITEMS` array near the top of the
`<script>` block — editing that list is the whole "no-code" content workflow. Passed
`/ship-widget`'s CMS harness, a full design critique (2 bugs found and fixed), and a Codex
second-opinion review (3 more bugs found and fixed, more severe than anything caught earlier —
see below). Live preview: https://mhdesigns98.github.io/vpm-widgets/widgets/feed-rail/

## Decisions made (and why)
- **Inline config array, not a fetched JSON file or WordPress CPT.** ACF widgets in this repo
  must be single-file/self-contained (no external fetch calls), and a real WordPress CPT needs
  a Web Publisher PRO vendor ticket + a committed publishing cadence the org hasn't decided on
  yet (see the "Feeds on vpm.org" design deck and the "Quick Post - Blog System" Capacities
  project). A hand-edited array is the cheapest thing that's still genuinely code-free to update.
- **Video thumbnail normalized to the same 64×64px square as other types**, not its native 9:16
  crop. Originally sized at 96px/9:16, which made that row 2.3x taller than every other row in
  the list — found during design review, confirmed via DOM measurement (187px vs ~80px row
  height), fixed by cropping to square via `object-fit: cover`.
- **Kicker colors repointed to `--vpm-red-700` and `--vpm-blue-500`** (both already-existing
  VPM palette tokens), replacing the original `--vpm-red` and `--vpm-light-blue`. The originals
  measured 4.22:1 and 2.43:1 contrast against white — both fail WCAG AA's 4.5:1 minimum for
  10px/700-weight text (too small to qualify for the 3:1 large-text exemption). Verified the
  fix with the same contrast formula against the live computed `color` values, not just the
  source CSS.
- **Google Fonts `<link>` removed** during `/ship-widget` — the harness flagged it as a real
  "must be self-contained" convention violation. vpm.org already loads Public Sans/GT America
  sitewide, so the widget doesn't need its own font load; it just declares the family and
  inherits or falls back to system sans.
- **CSS tokens and the universal box-sizing reset were scoped to `.vpm-feedrail` instead of
  `:root`/`*`.** The original code set both globally — harmless in local preview (nothing else
  on the page to affect), but a real bug once the widget's `<style>` block is one of several
  pasted into a WordPress ACF Code Block: it would have silently applied to the entire host
  page, not just the widget. Caught by a Codex review at end-of-session, not by manual testing
  or the design critique, because local preview never surfaces this class of leak — there's
  nothing else on the page for it to leak onto. Verified the fix by checking
  `getComputedStyle(document.body).boxSizing` after load — confirmed `content-box` (unaffected)
  instead of the widget's forced `border-box`.
- **Removed hardcoded `id="vpm-feedrail-title"`/`id="vpm-feedrail-list"`.** Two copies of the
  widget on one page (a real scenario — the harness explicitly tests a main + sidebar copy)
  would have produced invalid duplicate IDs. The query logic already had class-based fallbacks
  (`||`), so this was pure unnecessary risk, not a functional dependency. Also caught by Codex,
  not by the CMS harness itself — the harness's duplicate-ID audit only flags IDs it can
  actually observe colliding, and this session's local runs happened to not trigger it in a way
  that was visible before the review.
- **Image-less `article`/`link` items now render no thumbnail tile at all**, matching what the
  README already claimed. The original code created an empty 64×64 gray box for any non-video,
  non-audio-with-icon item lacking an `image` field — contradicting its own documented fallback.
  Caught by Codex; verified by isolating the exact `showThumb` boolean logic and confirming it
  evaluates `false` for an image-less article.

## In progress / next steps
- [ ] Decide which page(s) this actually goes on (elections/voter-guide page was the working
  assumption, never confirmed) and paste the widget into a real CMS block there.
- [ ] Revisit two lower-severity design critique items once there's real content variety to
  design against rather than placeholder examples: (1) audio/article/text "no image" fallback
  patterns are inconsistent with each other, (2) kicker colors are one-per-type with no
  underlying editorial logic (not urgency-coded).
- [ ] Worth a specific test once this is actually pasted into a real ACF block: place two
  copies on one page (the CMS harness simulates this, but a live WordPress page is the real
  proof) and confirm the CSS scoping fix holds against real theme CSS, not just the harness's
  simulated hostile styles.

## Gotchas / things that will bite you
- **Local browser preview cannot catch global CSS leakage** — a widget's `:root`/`*` rules only
  visibly misbehave once something else shares the page. This session's local Playwright
  checks and the design critique both missed the CSS-scoping bug for exactly this reason; only
  an external code review reading the raw source caught it. Worth remembering for future
  widgets: a clean local screenshot is not proof a widget is actually self-contained.
- **Codex's installed `review` subcommand does not accept `--skip-git-repo-check`** — that flag
  exists on some other Codex subcommands/older docs but this version's `codex review --help`
  doesn't list it, and passing it hard-errors before doing anything. Since `vpm-widgets` is
  already a real git repo, the flag isn't needed here anyway — just omit it: `codex review
  --base <sha>`. It took ~4 minutes to return a real result in this session; don't assume a
  fast/empty-looking response means it's done — check the output file's actual size/content,
  not just that the background task fired a completion notification (that notification fires
  when the shell backgrounds the process, not when it finishes).
- **Gemini CLI genuinely stalled this session** — ~4+ minutes with zero CPU progress on two
  separate attempts against this same file, had to be killed. Consistent with the second-opinion
  skill's documented risk; don't burn more than one retry on it before moving on without it.
- **The harness's two `html.html`/`css.css` 404 console errors are expected and harmless** for
  this widget — it's single-file format, not split-file, and the harness probes for both shapes
  regardless of which one a widget actually uses.
- **`youtube-shorts-embed` (existing widget) is not the same thing as this one** — it's a single
  embedded playlist phone-mockup player, not a multi-item feed. Don't confuse the two when
  looking for "the video widget."

## Key files
- `widgets/feed-rail/index.html` — the whole widget; `FEED_ITEMS` array (~line 243) is where
  content gets edited
- `widgets/feed-rail/BRIEF.md` — original scope brief (user moment, done criteria, exclusions)
- `widgets/feed-rail/README.md` — content-type reference and editing instructions
- `INDEX.md` and `index.html` (repo root) — Widget Lab registration/gallery entries for this
  widget
- Capacities project **"Quick Post - Blog System"** — the planning doc this build is answering
  questions from; updated this session with a progress note

## Session log
- 2026-09-21: Scaffolded via `/brief` + `/new-widget`, shipped via `/ship-widget` (fixed an
  external-font convention violation), enlarged the video thumbnail on request, added
  article/audio/text content types with one example each, ran a full design critique (found
  row-height and WCAG contrast issues, fixed both), logged progress to the Capacities "Quick
  Post - Blog System" project, ran a Codex second-opinion review as part of `/save-progress`
  (Gemini stalled and was killed) — found 3 more severe bugs (global CSS leakage, duplicate
  IDs, broken image-less-article fallback), fixed and re-verified all three against the CMS
  harness, wrote this handoff.
