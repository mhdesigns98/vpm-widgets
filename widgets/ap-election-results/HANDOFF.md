# AP Election Results Embed — Handoff
*Status: shipped — on main; live in the vpm.org homepage right rail for the Nov. 3, 2026 Virginia general*
*Last updated: 2026-10-22 · retargeted to the general, added coverage CTA, compact narrow layout, AP custom CSS · Last verified: 2026-10-22 — `/ship` harness, hostile CSS, WebKit 320/414/1280 on PR #45's code; Mark's screenshots of the live rail*
*Live vs repo: diverged — the CMS copy may predate PR #45 (static dot, narrow "unofficial" line) until Mark re-pastes; AP custom CSS is in `ap-layout-custom.css` here, but what is actually pasted in AP's tool may be the older first version*

## Current state
`index.html` frames AP layout `57278/35752` (general election) in VPM chrome, with a "More election coverage →" button to vpm.org/elections. Below a 600px container it hides the dek and separator dot, tightens padding, and shows "Numbers are unofficial until certified." in the panel header. The status dot is static. All on main via PRs #43–#45. A companion AP custom-CSS block (compact rows and spacing, ballot measures side by side above 560px) is in `ap-layout-custom.css` and gets pasted into AP's layout tool; Mark's screenshots showed the first version live, not the revised one.

## Decisions made (and why)
- **Static status dot, not pulsing** — a pulse reads as "live" with zero votes, and "Polls close 7 p.m. Nov. 3" stays true after close, so no election-night edit is needed.
- **Dek hidden below 600px** — the sidebar spent ~560px on chrome; "unofficial" moved into the panel header so it stays above the results.
- **AP CSS uses `!important`** — AP sets inline `grid-area` and fixed row heights. Selectors use AP's `custom-css` hook classes, so a rename falls back to AP's default.
- **AP row containers use `min-height`, not `height`** — fixed 26px clipped two-line names (verified).
- **Kept the AP disclosure note** — it's the statement that AP, not VPM, calls races.
- **Rejected opening the CTA in a new tab** — same-site link.
- **Recommended, not decided:** run a promo (now `widgets/elections-2026-cta` / `elections-2026-strip`) in the homepage rail before Nov. 3 and swap the results in on election day; an all-zeros module looks broken. Mark's call.

## In progress / next steps
- [ ] Paste the current `index.html` into Brightspot (replaces the pre-#45 copy).
- [ ] Paste the revised AP CSS into AP's custom CSS field and republish the layout; confirm rows look ~26px and measures sit 3-across on wide pages. Source: `ap-layout-custom.css`.
- [ ] Decide the homepage-rail plan for Oct. 22–Nov. 3 (promo vs results).

## Gotchas / things that will bite you
- AP edits layouts in place: the same URL changed content mid-cycle (ticker strip and ballot measures added). Re-check after AP changes.
- Below ~560px AP drops its U.S. House card grid; House races are only in the ticker carousel. Change that in AP's layout builder, not CSS.
- `curl` to AP gets a CloudFront 403; use a browser.
- The built-in Chromium pane sometimes stops AP's resizer entirely (even AP's raw snippet stays 150px). Verify resizing in WebKit via the Playwright CLI before calling it a widget bug.
- A bare `index.html` has no viewport meta, so mobile emulation renders it at 980px; test inside a fixed-width iframe instead.
- Code review at wrap-up was **single-model, effectively none**: Codex replied "no bugs" but the engine rejected the reply as too short; agy failed twice; Ollama wasn't running. The changes were covered by `/ship` runs instead.

## Key files
- `widgets/ap-election-results/index.html` — the Brightspot paste block
- `widgets/ap-election-results/README.md` — layout, narrow behaviour, ship stamp
- `harness/harness.html?widget=ap-election-results` — CMS harness
- `widgets/ap-election-results/ap-layout-custom.css` — paste into AP's layout custom CSS field (layout 57278/35752)

## Session log
- 2026-10-22: Retargeted to the general (eyebrow, status, layout `35752`); added the coverage CTA; compact narrow layout; separator dot hidden; static dot; narrow "unofficial" line; AP custom CSS; `/critique` (Codex, two rounds). PRs #43, #44, #45 merged. Promo CTA and strip widgets were built in a separate session (PRs #46, #47).
