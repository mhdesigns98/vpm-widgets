# Most Popular Stories Widget — Brief
*Written: 2026-09-08*

## Problem / Why
Post pages on vpm.org have no way to surface trending content to a reader once they're
already on an article — no path to "what else is popular right now."

## User moment
A reader lands on any post page. The sidebar (visible on scroll, not just at article end)
shows a "Most Popular Today" list — 3–5 site-wide trending stories — giving them somewhere
to go next.

## What done looks like
- Renders in the post template sidebar on every post, automatically — no per-post editor action
- Pulls Chartbeat's "most read" data for the trailing 24h
- Shows top 5 stories as title + link (no thumbnails)
- Refreshes on a cache interval (not a live call per pageview)

## Out of scope (v1)
- No personalization or topic-matching — same list for every visitor
- No manual editorial pinning/override — pure data-driven ranking
- No thumbnails/images — text list only
- No mobile-specific layout variant — responsive, same content

## Deploy target & constraints
**WordPress Custom HTML widget**, pasted via wp-admin → Widgets → sidebar widget area —
same mechanism Mark already uses for the newsletter and ads widgets. This is a self-contained
HTML/CSS/JS block (no theme repo, no PHP registration needed), so it **does** go through the
standard `/new-widget` → `vpm-widgets` → `/ship-widget` pipeline like any other Widget Lab
component; brand tokens (`tokens.css`) load automatically.

Since the widget fetches Chartbeat data client-side (no server-side PHP to cache a call),
the widget's own JS needs to handle the Chartbeat API call and any caching (e.g. sessionStorage
or a short-lived fetch interval) itself, and the Chartbeat API key will be exposed in the
pasted HTML/JS unless the call is proxied through something server-side — see open questions.

## Content source & maintenance
Chartbeat API, "most read" / most popular endpoint, trailing 24h window. Reuse the Chartbeat
API credentials from `chartbeat-weekly` if accessible; otherwise new API access needs to be
requested. No manual content maintenance after launch — fully automated.

## Open questions
- **Can the Chartbeat API key be safely exposed client-side**, or does it need a proxy
  (e.g. a small Cloudflare Worker, similar to how `chartbeat-weekly` already calls the
  Chartbeat API server-side) so the key isn't sitting in plaintext in a pasted wp-admin
  widget? Leaning toward reusing/extending `chartbeat-weekly`'s existing server-side call
  rather than exposing credentials in the widget itself.
- Can this reuse `chartbeat-weekly`'s existing Chartbeat API credentials/integration, or
  does it need separate API access?
- Cache interval for the Chartbeat data pull (e.g. 15 min? hourly?) — not yet decided.
