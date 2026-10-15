# Shared Modules + Drift Check — Brief
*Written: 2026-10-15*

## Problem / Why
Once a widget is pasted into vpm.org nothing watches it, so live copies drift from the repo
unnoticed. vpm.org's Shared Modules (ACF) update every page that uses them from one edit, so
putting each multi-page widget in exactly one module shrinks drift to one module-vs-repo check per
widget, plus finding copies pasted straight onto pages. Background and critique:
`~/Projects/research/vpm-widget-drift-checker.md`.

## User moment
Mark ships a fix to `newsletter-signup-cta`. He edits one Shared Module, and a weekly check later
confirms the module matches the repo build and that no page still carries an old pasted copy.

## What done looks like
- **Modules:** every widget used on more than one page has exactly one Shared Module. `/ship`
  outputs the module block for widgets; pasting onto a page directly is for page builds only.
- **Stamp:** `/ship` puts `data-vpm-build="<sha>"` and `data-vpm-hash="<markup hash>"` on each
  build's root (on the wrapper for iframe embeds), plus `data-vpm-source="module|page"`. Matching
  stamp with a mismatched hash means a hand edit.
- **Drift check:** (a) module code vs repo build for each widget, via REST once WPP opens it;
  (b) a sitemap crawl that lists every stamp and namespace prefix per URL and flags widget code
  with `data-vpm-source="page"` or no stamp at all (stray copies). Output feeds INDEX.md "Used on".
- **WPP ask sent:** turn on "Show in REST API" for the Shared Modules post type and its Code Block
  field group, readable by administrators only. Mention the crawler first, since script requests
  without a browser User-Agent get 403.

## Out of scope (v1)
- Central serving from Cloudflare (superseded; `hosting.md` unchanged).
- Auto-syncing modules or pages from the repo. The check reports, it doesn't write.
- Widgets with per-page content (`feed-rail`, `live-updates-rail`): modules can't be overridden
  per page, so these stay pasted and the crawl watches them.
- Visual regression and Chartbeat-per-widget (parked, depend on the inventory).

## Deploy target & constraints
Repo tooling under `tools/drift-check/` plus a `/ship` change. Read-only against vpm.org; crawl
with a browser User-Agent and a dedicated low-role account, not the admin Application Password.

## Answered (2026-10-15)
- **Does page HTML show module code?** No. The homepage's module (sidebar newsletter iframe)
  renders as `section.page-section.page-code-block`, the same wrapper as code pasted on
  `/shows/mending-walls/`. Hence `data-vpm-source` in the stamp. (Assumes that sidebar block is
  the module; it's the homepage's only Code Block.)
- **Revisions?** No (Mark). One bad edit breaks every page with no undo: test each module edit on
  staging first, and the repo stamp is the only backup.
- **Per-page overrides?** No, all-or-nothing (Mark).

## Open questions
- Will WPP enable REST for Shared Modules? Until then, check (a) works only by reading rendered
  HTML on one page per module.
- Do iframe embeds and the GTM Shadow DOM popup need their own stamp check (inner code isn't in
  the host HTML)?
- Are the Brightspot-era embeds (`ap-election-results`, `basics-virginia`, `ecp-partners-team`)
  still live anywhere?
- Which low-role account runs the crawl, and does Kinsta need to allow it?
