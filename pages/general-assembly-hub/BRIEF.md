# General Assembly Hub — Brief
*Written: 2026-11-23*

## Problem / Why
The General Assembly's main landing page today is a category archive. A standalone hub, built
the way vpm.org/elections replaced the Elections archive, gives readers the session's dates,
leadership, tracked bills and plain-language explainers in one place, alongside the live coverage.

## User moment
In January a reader sees a headline about a bill and wants to know where it stands and what
"crossover" means, without leaving vpm.org. Mid-session, a newsroom editor needs to update one
bill's status in under two minutes without touching HTML they don't understand.

## What done looks like
- Live at vpm.org/general-assembly and linked from the main nav, by Jan. 6, 2027
- The news team has updated at least one bill row using only `EDITING.md`
- `/ship general-assembly-hub` passes, and the page is checked in a browser at 360px, 768px and desktop
- Every value that changes each session is a bracketed placeholder, except the confirmed
  Jan. 13, 2027 convene date

## Out of scope (v1)
- Quick Posts live rail (HTML comment placeholder only)
- Scraping or pulling data from LIS (link out only)
- Search or filtering on the bills list
- Per-bill detail pages (each bill links to LIS and to VPM coverage)
- Redirecting the category archive

## Deploy target & constraints
- **Live URL:** vpm.org/general-assembly, a new WordPress page.
- **Paste shape:** several blocks (`sections/` plus `PASTE-ORDER.md`), with the live Article List
  and Capitol photo-update blocks between the Code Blocks. `voter-guide-2026` is the reference.
- Namespace `vpm-gahub-` for new sections.
- The existing header (`vpm-gahdr-`) and resources (`vpm-gares-`) blocks from
  `pages/general-assembly/` are copied to the hub, and the category page keeps its own
  (decided 2026-11-24: moving the header would leave the archive with no H1).
- `/category/general-assembly/` stays up as the full archive. The hub links to it as
  "All General Assembly coverage".
- Self-contained, tokens copied in from `tokens.css`, no external dependencies, px units.

## Content
Sections and their order are in `pages/general-assembly/HUB-PROMPT.md`: session status, key dates,
latest coverage, who's in charge, bills we're watching, from the Capitol, explainers, glossary,
quick links (plus VPAP). The news team maintains the dates, leadership and bill rows after launch.

## Open questions
- Is the Capitol photo updates block live or static markup? Confirm on the live page.
- Explainer story URLs (budget process, how to take part) don't exist yet.
- Dates for crossover, sine die and the reconvened session aren't published yet.
