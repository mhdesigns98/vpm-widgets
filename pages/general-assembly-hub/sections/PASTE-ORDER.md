# General Assembly hub — paste order

The new page at vpm.org/general-assembly, top to bottom as it's built in the WordPress editor.
Rows marked "not this build" are other blocks, listed so you know where each section goes.

Each file is a whole Code Block: open it, select all, copy, and paste over the block's content.
Each file carries its own styles, so blocks can be moved or removed without breaking the others.

| # | Block | File |
|---|---|---|
| 1 | Code Block, **Full width on**: hero, the page's only H1, session status line, "On this page" bar | `01-header.html` |
| 2 | Code Block: Key dates, then the "Latest coverage" heading | `02-key-dates.html` |
| 3 | **Article List (live CMS block)**: category General Assembly, **title field empty** ("Latest coverage" in block 2 is its heading) | (editor-inserted) |
| 4 | Code Block: "All General Assembly coverage" link, then Who's in charge | `04-leadership.html` |
| 5 | Code Block: Bills we're watching | `05-bills.html` |
| 6 | **From the Capitol**: Shaban Athuman's photo updates. **Unconfirmed**: it isn't on the live category page, so it's unknown whether it's a live block or static markup. Skip until confirmed. | (unconfirmed) |
| 7 | Code Block: Explainers | `07-explainers.html` |
| 8 | Code Block: Glossary | `08-glossary.html` |
| 9 | Code Block: Helpful resources | `09-resources.html` |
| 10 | Morning Monitor signup | widget `newsletter-signup-embed` (not this build) |
| 11 | Contact the VPM News team | widget `news-tips-cta` (not this build) |

Ads are separate builder rows, as on the category page (a Code Block can't hold the ad shortcode).
The leaderboard goes between blocks 1 and 2.

Blocks 2 and 5 end with a `SPLIT` comment: stop pasting there, add the live block in the CMS,
and continue with the next file in a **new** Code Block.

## Jump bar

Block 1's "On this page" bar links to ids the other blocks set themselves: `#ga-dates` and
`#ga-latest` (block 2), `#ga-leaders` (4), `#ga-bills` (5), `#ga-explainers` (7),
`#ga-glossary` (8), `#ga-resources` (9). A link whose block isn't on the page hides itself.

## The WordPress page

- Page title "General Assembly", slug `general-assembly`. Block 1 holds the H1, so the page
  template shouldn't print the title as a second H1. Check after the first save.
- A Quick Posts live rail is planned for later, directly under block 1. There's a comment marking
  the spot at the end of `01-header.html`.
