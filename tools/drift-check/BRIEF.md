# Shared Modules + Drift Check — Brief
*Written: 2026-10-15*

## Problem / Why
Once a widget is pasted into vpm.org nothing watches it, so live copies drift from the repo
unnoticed. vpm.org's Shared Modules (ACF) update every page that uses them from one edit, so
putting each multi-page widget in exactly one module shrinks drift to one module-vs-repo check per
widget, plus a handful of known pasted pages. Background and critique:
`~/Projects/research/vpm-widget-drift-checker.md`.

## User moment
Mark ships a fix to `newsletter-signup-cta`. He edits one Shared Module, and the drift check
confirms the module matches the repo build and lists the pages that use it.

## What done looks like
- **Modules:** every widget used on more than one page has exactly one Shared Module. `/ship`
  outputs the module block for widgets; pasting onto a page directly is for page builds only.
- **Stamp:** `/ship` puts `data-vpm-build="<sha>"` and `data-vpm-hash="<markup hash>"` on each
  build's root (on the wrapper for iframe embeds), plus `data-vpm-source="module|page"`. Matching
  stamp with a mismatched hash means a hand edit.
- **Drift check (v1):**
  (a) module code vs repo build for each widget, via REST once WPP opens it, with WPP's
  "which pages use each module" list as the source for INDEX.md "Used on";
  (b) a **one-time migration crawl**, before the move to modules, to find widget code pasted
  straight onto pages so each copy can be replaced with its module;
  (c) direct fetches of the few known pages that stay pasted (`feed-rail`, `live-updates-rail`,
  page builds): a dozen requests or so, not a site scan.
  The migration crawl and direct fetches send a browser User-Agent (script requests without one
  get 403).
- **Snapshot before edit:** before `/ship` changes a Shared Module, it saves the live module's
  current code into the repo (from rendered HTML now, from REST once WPP enables it). Modules keep
  no revisions, so that snapshot is the undo. The repo stamp alone isn't a backup, because the live
  copy may have been hand-edited.
- **WPP asks sent, in order:** (1) turn on revision history for the Shared Modules post type;
  (2) turn on "Show in REST API" for that post type and its Code Block field group, readable by
  administrators only; (3) a "which pages use each module" list (used-on).

## Out of scope (v1)
- Ongoing or scheduled site scanning, including a weekly sitemap crawl. That belongs in a separate,
  broader WPP request (SEO, broken links, bug triage). Rank Math Pro is already installed, so that
  request should cover only what Rank Math doesn't.
- Central serving from Cloudflare (superseded; `hosting.md` unchanged).
- Auto-syncing modules or pages from the repo. The check reports, it doesn't write.
- Widgets with per-page content (`feed-rail`, `live-updates-rail`): modules can't be overridden
  per page, so these stay pasted and are covered by the direct fetches in (c).
- Visual regression and Chartbeat-per-widget (parked).

## Deploy target & constraints
Repo tooling under `tools/drift-check/` plus a `/ship` change. Read-only against vpm.org; REST
reads use a dedicated low-role account, not the admin Application Password.
Staging doesn't track production content, so staging or the `/ship` harness can test that a
module renders and behaves correctly, but not the production content around it.

## Answered (2026-10-15)
- **Does page HTML show module code?** No. The homepage's module (sidebar newsletter iframe)
  renders as `section.page-section.page-code-block`, the same wrapper as code pasted on
  `/shows/mending-walls/`. Hence `data-vpm-source` in the stamp. (Assumes that sidebar block is
  the module; it's the homepage's only Code Block.)
- **Revisions?** No (Mark). One bad edit breaks every page with no undo, hence the
  snapshot-before-edit step and the first WPP ask.
- **Per-page overrides?** No, all-or-nothing (Mark).

## Open questions
- Will WPP turn on revisions and REST for Shared Modules? Until REST is on, check (a) and the
  snapshot work only from rendered HTML on one page per module.
- Will WPP provide the used-on list? If not, the fallback is repeating the migration crawl
  occasionally to keep INDEX.md "Used on" current.
- Do iframe embeds and the GTM Shadow DOM popup need their own stamp check (inner code isn't in
  the host HTML)?
- Are the Brightspot-era embeds (`ap-election-results`, `basics-virginia`, `ecp-partners-team`)
  still live anywhere?
- REST account: Mark can create a low-role user easily, but the role depends on WPP's REST
  decision. If modules become publicly readable over REST, no login is needed; if WPP restricts
  reads to logged-in users, use the lowest role their restriction allows.
