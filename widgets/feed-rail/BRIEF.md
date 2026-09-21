# Feed Rail — Brief
*Written: 2026-09-21*

## Problem / Why
VPM wants a lightweight, skimmable stream of short updates (video, links, quick items) next to
a main story or on a landing page — like the "Shorts" rail in the Voter Guide design, but
general-purpose and reusable across pages, and addable to without touching code.

## User moment
A voter checking the elections page the week before a deadline scrolls past the main story and
sees a rail of recent short updates — a 60-second video explainer, a quick link to "how to
register" — skimmable without committing to a full article.

## What done looks like
- Widget lives in `~/Projects/vpm/vpm-widgets/widgets/feed-rail/`
- Renders a vertical rail of items from a hand-edited `feed-items.json` (or inline JSON block)
- Supports at least two item types: video (thumbnail + play overlay, links out to YouTube) and
  link/article (headline + source label)
- First real item: the YouTube Short at youtube.com/shorts/RAu42-tykzk, thumbnail pulled from
  YouTube's static thumbnail endpoint (no API key)
- Passes `/ship-widget` checklist (CMS harness, scoping, a11y, no id collisions)
- Live on the Widget Lab GitHub Pages preview
- Not yet pasted into a live vpm.org CMS block — that's a follow-up step

## Out of scope (v1)
- No real WordPress custom post type / wp-admin editing UI — items come from hand-edited JSON
  only. A CPT is the deck's later-phase recommendation and requires a Web Publisher PRO vendor
  ticket; out of scope here.
- No auto-refresh, polling, or live-blog behavior — static render on page load only.
- Not yet embedded on a live vpm.org page (see "done" above).

## Deploy target & constraints
WordPress ACF Code Block, same as the rest of the Widget Lab — self-contained, no external
dependencies beyond fonts already in use, namespaced classes (`vpm-feedrail-`), tokens copied
in from `tokens.css` rather than linked.

## Content source & maintenance
Static `feed-items.json` shipped alongside the widget, hand-edited by Mark (or whoever has repo
access) to add/remove/reorder items — no backend, no build step required to update content.

## Open questions
- Exact item schema (fields per type) — will finalize during build.
- Whether JSON is fetched at runtime (separate file) or inlined in the HTML for a true
  single-file ACF paste — likely inlined, to match Widget Lab's self-contained convention.
