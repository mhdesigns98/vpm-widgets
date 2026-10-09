# Related Stories — Brief
*Written: 2026-10-06*

## Problem / Why
Readers who finish (or stall halfway through) an article have no in-view path to more coverage of the same topic, so they leave. A tag-matched related stories list in the aside, visible the whole way down, gives them the next click on vpm.org.

## User moment
A reader lands on an elections article from social or search. Halfway down, they want more on the same topic. The widget, sticky in the aside, is still in view and offers four recent stories that share the article's tags, one click away.

## What done looks like
- Live on every standard article page via the article widget template (one install, not per-article)
- Shows 4 VPM posts sharing at least one tag with the current article, ranked by tag specificity (newest breaks ties), never the current article
- Fallback: no tags or no matches → latest posts from the article's category
- Sticky in the aside while scrolling (desktop), offset clear of the site header and Stream Player; stops at the bottom of the article column
- Loads after the page renders; has loading, empty, and error states (error → hides cleanly, no broken box)
- ~~Passes `/ship-widget`~~ N/A since 2026-10-06: the client-side widget won't go to production (see direction change below), so it isn't run through `/ship`

## Out of scope (v1)
- ~~Ranking by shared tags~~ Pulled into v1 on 2026-10-06 after staging showed broad tags (Elections, Health) crowding out on-topic stories. Ranked by tag specificity.
- Personalization or "most read" signals
- Sticky behavior on mobile (stacks below the article, static)
- Click tracking beyond existing site analytics
- Post types other than standard posts *as results*. (It runs on any article type, including NPR stories; results are always VPM standard posts.)

## Deploy target & constraints
WordPress Code Block inside the article widget template → **single-file** (one paste: HTML + scoped `<style>` + IIFE `<script>`). Self-contained, no external deps, namespace prefix `vpm-rel-`.
- Data: public WP REST API on vpm.org (`/wp-json/wp/v2/posts`), same-origin. Verified 2026-10-06: responds 200 to browser requests; non-browser clients (curl default UA) get 403 from bot protection.
- Current item read from the `<link rel="alternate" type="application/json">` link (any post type); the `postid-NNNN` body class is the fallback.
- Target container: `aside.ArtP-aside`.
- Harness/preview runs off vpm.org, so the widget needs a mock data path for testing.

## Open questions
- ~~Tag noise~~ Resolved 2026-10-06: ignore-list of format/source/scope tags, 5 at first, 15 after the ranking pass (see README).
- ~~Sticky viability~~ Resolved 2026-10-06: aside stretches full height, no overflow. Theme already sticks the 2nd aside widget (the ad); Mark chose a hand-off: Related Stories sticky for the top half, ad for the bottom half.
- ~~Sticky offset~~ 20px, matching the ad; site header is static.
- Who has access to edit the article widget template, and is it the same template for all article types?
- Ad hand-off gives the ad less sticky time than today; confirm with whoever owns ad revenue.
- **2026-10-06 direction change:** load time (~4s on staging, ~1.2s est. on prod) led Mark to hand production to WPP for a server-side theme build (spec: `WPP-SPEC.md`). A Cloudflare Worker cache was considered and dropped. The client-side widget stays as the staging prototype/reference.
