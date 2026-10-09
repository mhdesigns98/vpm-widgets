# Self-updating video list (outline)

Status: **outline only, nothing built.** Today the row shows a hand-edited `SHORTS` array, so new Shorts don't appear until someone edits the widget and re-pastes it into the CMS.

## Goal
The row always shows the playlist's latest videos with no edit or re-paste.

## Why not fetch from the widget
YouTube's playlist feed (`https://www.youtube.com/feeds/videos.xml?playlist_id=PLDpD9qYyo0hJUThx2RuUgE_TH9LN05ua3`) sends no CORS headers, so the browser can't read it from vpm.org. It needs a server in between. The feed needs no API key, but it returns only the latest ~15 videos.

## Proposed shape
1. **Cloudflare Worker** (same pattern as the `pbs-show-playlist` proxy): fetches the feed, parses it, returns JSON `[{ id, title }]`, with CORS locked to `https://www.vpm.org`, like `chartbeat-weekly`.
2. **Caching:** cache the response at the edge for about 10 minutes. This keeps YouTube traffic low and the widget fast.
3. **Widget:** on load, fetch the Worker URL. On success, replace the `SHORTS` array with the response. On failure or timeout, keep the hard-coded `SHORTS` array as a fallback, so the row never renders empty.
4. **Dead videos:** the existing thumbnail check already drops deleted or private videos.

## What's needed
- Who owns the Cloudflare account and where Workers get deployed (the `pbs-show-playlist` Worker is the template).
- A Worker route/domain and an agreed CORS origin list. The preview site and staging also need allowing.
- Confirm the playlist stays public, since private playlists have no feed.
- Decide whether editors need to hide a video (an exclusion list in the Worker, or unlist it on YouTube).
- Localhost CORS gap: the harness can't hit the live Worker (see `harness/README.md`, "Known gap"), so the success path needs a manual or mock test.

## Risks
- The feed is a public but unofficial-ish endpoint and could change. The hard-coded fallback covers that.
- The feed lists the playlist newest first, not in the playlist's own order.
- One more thing to monitor: if the Worker is down, the row silently shows the stale fallback list.

## Effort
About half a day: Worker (parse, cache, CORS), widget fetch with fallback, a manual test of success and failure paths, and docs.
