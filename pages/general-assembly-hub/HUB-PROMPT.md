Build a standalone General Assembly hub page for vpm.org. It replaces /category/general-assembly/ as the main GA landing page, the way vpm.org/elections replaced the Elections category archive. Use plan mode: show me the section plan, file structure and reuse decisions before writing any code.

## Start here (read before planning)
- Work in ~/Projects/vpm/vpm-widgets. Read CLAUDE.md (widget and page-build sections), tokens.css, and the vpm-design skill. vpm-design is canonical for brand and copy.
- Scaffold with /new-page general-assembly-hub. Do NOT use anthropic-skills:vpm-page-builder.
- Read pages/general-assembly/ first. It already has:
  - sections/header.html (namespace vpm-gahdr-): hero with the page's only H1, a date-driven session status line (data-vpm-gahdr-start/-after/-end), and a pinned "On this page" bar
  - sections/resources.html (namespace vpm-gares-): the Helpful resources / quick links module
  In the plan, say whether the hub reuses these as-is, moves them into the new build, or extends them. Don't fork a second copy of either one silently.
- For structure, match pages/elections-2026-primary/ and the vpm.org/elections header pattern. One quick look, then stop.
- Namespace for new sections: vpm-gahub- (confirm it doesn't collide in INDEX.md).
- Branch: vpm-widgets-ga-hub, off main.

## Keep everything the current page has
GA story feed, Shaban Athuman's photo updates from the Capitol, quick links (LIS, House members, Senate members, Who's My Legislator, bill search, how a bill becomes law), plus the news-tips-cta and newsletter-signup-embed widgets.

## Sections, in order
1. Session status. Reuse the existing vpm-gahdr status line (already date-driven, already set for Jan. 13, 2027). No new banner.
   Then add an HTML comment where a future Quick Posts live rail would go.
2. Key dates. Session convenes (Jan. 13, 2027, already confirmed in pages/general-assembly/README.md), crossover, sine die, reconvened (veto) session, July 1 effective date. One plain-language line each. [DATE] placeholders for everything except convene. Don't fill in dates from memory.
3. Latest coverage. SPLIT marker for a live Article List block (General Assembly category).
4. Who's in charge. Party split per chamber, Speaker, Senate Majority Leader, governor, chairs of House Appropriations and Senate Finance & Appropriations. Bracketed placeholders for every name and number.
5. Bills we're watching. Columns: bill number (links to LIS), one-line plain summary, topic, status, VPM coverage link. Status labels, fixed set: In committee, Passed House, Passed Senate, Passed both chambers, To governor, Signed, Vetoed, Failed. Status shows as text, with color only as a secondary cue. 3 dummy rows, clearly marked SAMPLE. Each row is one self-contained block a non-developer can copy, paste and edit. Must work as a stacked card layout at 360px, not a sideways-scrolling table.
6. From the Capitol. Shaban's photo updates. If you can't tell from the repo or the live page whether this is a live block or static markup, use a SPLIT marker and flag it in the plan.
7. Explainers. Two link cards: how the state budget works, and how to take part (testify, submit public comment, watch committee and floor sessions live). Placeholder URLs; those stories don't exist yet.
8. Glossary. <details>/<summary>: crossover, sine die, caucus, passed by indefinitely, continued to next session, reconvened session, conference committee, enrolled bill. Plain-language definitions, all listed in your final summary for me to fact-check.
9. Quick links. Reuse vpm-gares resources, add the Virginia Public Access Project (VPAP).

## Out of scope
- No Quick Posts rail yet (comment placeholder only).
- No scraping or pulling LIS data. Link out only.
- No CMS paste, no live changes to the category page.

## Deliverables
- The build under pages/general-assembly-hub/ in the shape /new-page picks, with numbered section files and PASTE-ORDER.md.
- An INDEX.md entry, plus a note in pages/general-assembly/README.md on how the two builds relate.
- EDITING.md for the news team, written for someone who doesn't know HTML: update the key dates, change a bill's status, add or remove a bill, and how the status line switches on its own.
- Final summary: every placeholder to fill, every glossary definition to verify, the Shaban flag, and the reuse decision for header/resources.

## Done when
- /ship general-assembly-hub passes.
- Every editable value is a bracketed placeholder (except the confirmed Jan. 13 convene date).
- Checked in a real browser at 360px, 768px and desktop, with screenshots. Bills and glossary checked by keyboard.
