# Base Layer (shared atoms) — Handoff
*Status: parked — proposal only, never merged, never deployed*
*Last updated: 2026-10-09 · work rescued from an uncommitted worktree and committed as WIP so the worktree could be removed · Last verified: unverified (nothing re-run on 2026-10-09; the README cites a manual harness run from about 2026-08-06)*
*Live vs repo: n/a — nothing from this branch was pasted into the CMS*

## Current state
Branch `claude/acf-block-taxonomy-30fc00`, cut from `vpm-widgets` main on 2026-08-03, is now **83 commits behind main**. It proposes a shared CSS "base layer" in `base/` (`reset.css`, `tokens.css`, `atoms.css`): buttons, eyebrows, badges, the focus ring and reduced-motion, pasted **once per page** into the first Code Block instead of being repeated in every widget. Widgets opt in with a `vpm-ui` class on their root. The branch also teaches the harness to inject the base layer, adds base-layer items to the CLAUDE.md checklist, adds a `Base` column to INDEX.md, and migrates `elections-2026-primary-cta` onto it as the first consumer.

## Decisions made (and why)
- **Paste-once instead of per-widget CSS.** The audit in `base/README.md` found the same tokens, reset and buttons re-pasted in every widget, and reduced-motion honoured in only 1 of 6.
- **`base/tokens.css` is derived from the root `tokens.css`, never hand-edited.** That keeps one canonical token file.

## In progress / next steps
- [ ] Decide whether the base-layer idea is still wanted. It conflicts with the "fully self-contained block" rule in both repos' CLAUDE.md, and it overlaps the widgets/pages merge analysis (`~/Projects/research/vpm-widgets-pages-merge.md`), because paste-once only works if every page build knows to paste it.
- [ ] If yes: start a fresh branch from current main and port `base/` plus the harness change by hand. Rebasing 83 commits behind will conflict on CLAUDE.md and INDEX.md, both rewritten since.
- [ ] If no: delete the branch.

## Gotchas / things that will bite you
- The INDEX.md and CLAUDE.md diffs on this branch are against the August versions. Don't merge them as-is; they would revert two months of changes.
- `elections-2026-primary-cta` on main has moved on since August. Its changes here are a reference, not a patch to apply.

## Key files
- `base/README.md` — the full proposal, paste order, molecule snippets
- `base/atoms.css`, `base/reset.css`, `base/tokens.css` — the layer itself
- `harness/harness.html` — `fetchBaseLayer()` auto-injects base when it sees `vpm-ui`

## Session log
- 2026-10-09: committed as WIP from an abandoned worktree; worktree removed. No code reviewed or re-run.
- ~2026-08-06: base layer built and `elections-2026-primary-cta` migrated (uncommitted).
