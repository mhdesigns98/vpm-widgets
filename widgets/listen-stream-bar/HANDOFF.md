# Listen Stream Bar — Handoff
*Status: parked — code is done and pushed; blocked on Mark supplying the four real stream/podcast URLs.*
*Last updated: 2026-08-06 · Last verified: unverified — never run through `/ship-widget`, so no CMS-harness or accessibility pass has happened.*
*Live vs repo: repo only — the widget is on `origin/main` (`6274b4d`) but has never been pasted into the CMS. Nothing about it is live.*

## Why it's parked

Built 2026-07-16, then sat untouched for three weeks. Nothing is wrong with it — it is
waiting on one input only: **the four real stream/podcast URLs**, which only Mark can
supply. Parking it explicitly rather than leaving it in an open "next steps" list, because
that limbo is what let it go stale unnoticed.

**To unpark:** fill in the four `href`s, run `/ship-widget listen-stream-bar`, paste into
WordPress. Nothing else is outstanding.

## Current state
`widgets/listen-stream-bar/index.html` is complete and on `origin/main` (commit `6274b4d`,
pushed 2026-08-06). It's a self-contained WordPress HTML-block embed: a horizontal bar for the VPM Listen page with a yellow "Listen now" eyebrow on the left and four buttons (News Stream, Music Stream, Podcasts, Music Archive) on the right, on VPM dark blue with the 3-stripe accent bar on top. Not yet run through `/ship-widget` and not yet deployed to WordPress.

## Decisions made (and why)
- **Replaced the old `.listen-page-header` block.** It duplicated the hero's "Listen to VPM" H1 (redundant) and used generic Material blues (`#1a237e`/`#0d47a1`) instead of VPM brand.
- **Dropped the redundant H1, used a small yellow eyebrow label ("Listen now")** — gives the button row context without competing with the hero title.
- **Rebuilt on VPM tokens** (`--vpm-dark-blue` #003865, `--vpm-yellow` #E0E721), sharp 4px corners, UPPERCASE bold CTA buttons, `:focus-visible` (not `:focus`) for keyboard-only outline.
- **Single-file format** (not acf-split) — Mark pastes it as one HTML block into WordPress.

## In progress / next steps
- [ ] **BLOCKER — swap placeholder `href="#..."` anchors** for real stream/podcast URLs.
      Mark supplies these; everything below is blocked on it.
- [ ] Run `/ship-widget listen-stream-bar` (CMS harness + a11y) before deploying.
- [ ] Paste into WordPress below the Listen page hero.
- [x] `git push` — done 2026-08-06.

## Gotchas / things that will bite you
- Eyebrow label text is undecided — "Listen now" is current; alternatives floated were "Jump to" or no label at all.
- Widget Lab rule: components live ONLY in `~/Projects/vpm/vpm-widgets/` (under the `vpm/` category folder — not flat in `~/Projects`). The old `vpm-component-library` is deprecated/archived — never save there.

## Key files
- `widgets/listen-stream-bar/index.html` — the widget (scoped `.vpm-streambar__*`, tokens inlined)
- `widgets/listen-stream-bar/README.md` — purpose/origin/deploy notes
- `widgets/watch-page-header/` — sibling pattern (the Watch-page equivalent of this bar)

## Session log
- 2026-07-16: Built listen-stream-bar from Mark's old `.listen-page-header` CSS, applied VPM brand, saved via `/save-component`, committed (`6274b4d`).
- 2026-08-06: Pushed. Parked pending real stream URLs from Mark.
