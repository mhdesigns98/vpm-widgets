# General Assembly page — paste order

The vpm.org General Assembly category page as it's built in the WordPress editor, top to bottom
(checked against the live page 2026-11-20). Only the files in this folder are this page build;
the other rows are other people's blocks, listed so you can find where each section goes.

| # | Block | Where | File |
|---|---|---|---|
| 1 | Code Block, **Full width on** — hero, the page's H1, session status, On this page bar | top of page | `header.html` |
| 2 | Code Block — leaderboard ad | below the hero | — (not this build) |
| 3 | Grid, 70/30 — left: Latest Stories article grid (CMS) | — | — (editor-inserted) |
| 3a | Right column: Morning Monitor signup | grid, right column, 1st | widget `newsletter-signup-embed` |
| 3b | Right column: sidebar ad | grid, right column, 2nd | — (not this build) |
| 3c | Right column: Code Block — Helpful resources | grid, right column, 3rd | `resources.html` |
| 4 | Code Block — Contact the VPM News team | bottom of page | widget `news-tips-cta` |

Each file is the whole Code Block: open it, select all, copy, and paste over the block's content.

`header.html`'s jump bar links to `#ga-latest` (it gives the Latest Stories section that id at
runtime) and `#ga-resources` (supplied by `resources.html` itself).
