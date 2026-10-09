# VPM News Voter Guide 2026 — Brief
*Written: 2026-07-13*

## Problem / Why
Virginia voters need a single, nonpartisan hub for 2026 election info (key races, important dates, voting FAQ, news coverage) ahead of early voting. A static HTML mockup already exists and needs to become a real, CMS-integrated page.

## Audience
VPM.org visitors researching the 2026 Virginia general election — registration deadlines, key races, and voting logistics.

## What done looks like
- Full voter guide page live on **WordPress** before early voting opens, with all mockup sections intact: hero, important dates panel, video coverage, latest-coverage article feed, key races, regional races, FAQ accordion, newsletter signup, mock election results block.
- WordPress article feed section pulls real posts (replacing the current dashed-border WP placeholder grid).
- Brightspot version is **built** (converted/templated) but not required to deploy in v1 — kept as a ready fallback.
- Race cards, regional races, and important dates are correct and reviewed by editorial before launch.

## Out of scope (v1)
- Live AP Elections API integration — results block stays mock/manual data, not a real-time feed.
- Brightspot deployment — build it, but launching it is a separate/later effort.
- CMS-editable fields for race/date content — this content stays dev-maintained (hardcoded), not exposed to editors via ACF or Brightspot content types.

## Deploy target & constraints
- **Primary: WordPress**, built as an **ACF flexible-content page** — each mockup section (hero, dates panel, video coverage, article feed, key races, regional races, FAQ, newsletter, results) becomes its own flexible-content layout/block.
- **Backup: Brightspot.** New template (not extending an existing one) — may need to be split into multiple modules depending on how VPM's Brightspot Studio setup organizes reusable page sections; to be assessed during that build phase.
- Self-contained styling (scoped `.vpm-vg` prefix as in the mockup), no external JS dependencies beyond Google Fonts.

## Content source & maintenance
- Race cards, regional races, important dates: dev-maintained, hardcoded in the template — updated by editing code directly, no editor-facing CMS fields in v1.
- Election results: mock/placeholder data (structured to match the AP Elections API v3 response shape for an easy future swap). **Results section is always visible in v1** (no election-week auto-show, no admin Force On/Off toggle — that control is removed).
- Article feed: pulls from WordPress's native post/category system, filtered to the **"Elections" category**.

## Deadline / trigger
Live on WordPress before early in-person voting and no-excuse absentee requests open — **~September 19, 2026**.

## Open questions
- Brightspot: exact module breakdown (single template vs. multiple) — decide once that build phase starts.
- Real candidate/race data — still placeholder for now; swap in once available (no immediate action needed).
