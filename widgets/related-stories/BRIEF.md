# Related Stories — Brief
*Written: 2026-10-06*

## Problem / Why
Readers who finish (or stall halfway through) an article have no in-view path to more coverage of the same topic, so they leave. A tag-matched related stories list in the aside, visible the whole way down, gives them the next click on vpm.org.

## User moment
A reader lands on an elections article from social or search. Halfway down, they want more on the same topic. The widget, sticky in the aside, is still in view and offers four recent stories that share the article's tags, one click away.

## What done looks like
- Live on every standard article page via the article widget template (one install, not per-article)
- Shows 4 recent posts sharing at least one tag with the current article, newest first, never the current article
- Fallback: no tags or no matches → latest posts from the article's category
- Sticky in the aside while scrolling (desktop), offset clear of the site header and Stream Player; stops at the bottom of the article column
- Loads after the page renders; has loading, empty, and error states (error → hides cleanly, no broken box)
- Passes `/ship-widget`

## Out of scope (v1)
- Ranking by number of shared tags (any shared tag, newest first)
- Personalization or "most read" signals
- Sticky behavior on mobile (stacks below the article, static)
- Click tracking beyond existing site analytics
- Post types other than standard posts

## Deploy target & constraints
WordPress Code Block inside the article widget template → **single-file** (one paste: HTML + scoped `<style>` + IIFE `<script>`). Self-contained, no external deps, namespace prefix `vpm-rel-`.
- Data: public WP REST API on vpm.org (`/wp-json/wp/v2/posts`), same-origin. Verified 2026-10-06: responds 200 to browser requests; non-browser clients (curl default UA) get 403 from bot protection.
- Current post ID read from the `postid-NNNN` body class (verified on a live article).
- Target container: `aside.ArtP-aside`.
- Harness/preview runs off vpm.org, so the widget needs a mock data path for testing.

## Open questions
- **Tag noise:** audit during build. Pull tag usage counts from the REST API, flag any too broad to be useful (very high post counts), and decide whether to ship a small ignore-list.
- **Sticky viability:** confirm no ancestor of `ArtP-aside` has `overflow: hidden` and the aside column stretches the full article height — otherwise `position: sticky` silently fails. First thing to test on a live article.
- Exact sticky `top` offset (site header height; Stream Player position).
- Who has access to edit the article widget template, and is it the same template for all article types?
