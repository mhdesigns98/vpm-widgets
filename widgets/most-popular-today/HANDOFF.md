# most-popular-today — Handoff

- [x] Resolved Chartbeat data source: new `GET /api/most-popular` route on the
      `chartbeat-weekly` Worker (`src/index.js` / `src/chartbeat.js`), calling
      Chartbeat's synchronous `toppages` API server-side, CORS-locked to
      `https://www.vpm.org`, 5-min in-isolate cache. **Deployed** to
      `https://chartbeat-weekly.vpm-e01.workers.dev`
- [x] Pointed `ENDPOINT` in `index.html`'s script at
      `https://chartbeat-weekly.vpm-e01.workers.dev/api/most-popular`
- [x] Client cache interval set to 5 min to match the Worker's own cache
- [x] Verified against the real Chartbeat `toppages` API via `wrangler dev` +
      curl — field names (`title`, `path`) confirmed correct. Found and fixed
      two real bugs surfaced by the live response: (1) Chartbeat's `path` is
      actually host+path with no scheme, which was producing doubled-host
      URLs (`https://vpm.org/vpm.org/...`) until stripped correctly; (2)
      landing pages (homepage, `/stream-vpm/`, `/listen/`, `/shows/*`,
      `/vpm-tv-schedule/`) kept surfacing in the raw top pages — switched from
      a blocklist to an allowlist requiring a dated article path shape
- [x] Visual review in the CMS test harness. Found and fixed a real scoping
      bug: the harness's hostile `.article-body a { color: #EE2737 !important }`
      rule was winning over the widget's link color because its selector had
      higher specificity — `!important` alone wasn't enough. Fixed with a
      `.vpm-mpt.vpm-mpt` doubled-class selector.
- [x] Ran `/ship-widget most-popular-today` — full harness pass (hydration,
      re-render, click-interception recovery, keyboard focus, contrast, no id
      collisions), a11y pass, convention audit all confirmed clean at 5 items.
- [x] **Content policy change**: excluded NPR wire content (`/npr-news/`,
      `/npr-story/`) from competing equally with VPM's own reporting — local
      journalism (`/news/`, `/announcements/`) now ranks first, with NPR
      content only backfilling remaining slots if VPM-original volume can't
      fill the list. Required raising Chartbeat's overfetch depth
      substantially (`fetchLimit`), since VPM-original stories alone often
      don't fill 5-8 slots even 40-80 pages deep into the site's overall
      "most popular" ranking — NPR wire content frequently outranks local
      stories in raw popularity.
- [x] **Expanded from 5 to 8 stories** — tested live: needed `fetchLimit`
      floor raised to 100 (from 40) to reliably fill 8 slots given the
      VPM-first/NPR-backfill tiering above.
- [x] Tried `max-height: 340px; overflow-y: auto` as a safety net against
      the sticky-player collision (see below), then **reverted it on Mark's
      call**: a nested scroll container inside an already-scrolling page
      traps mobile swipe gestures at the widget's edges — worse UX than the
      collision risk it was guarding against. The list is full-height again.
- [x] **Design review (2026-09-21)**: reverted from 8 items back to top 5,
      per design critique — 8 full headlines with no visual break points
      read as too dense for a sidebar "what to read next" module, and the
      NPR-backfill inventory problem that motivated 8 was a data-fill
      concern, not a reading-experience one. Also gave rank #1 extra visual
      weight so the list reads as an actual ranking rather than a plain
      numbered list. First attempt (larger, blue rank numeral) was too
      subtle against wrapped multi-line headlines — Mark flagged it as
      reading like a bug. Replaced with a yellow bottom divider under #1
      plus a bolder title weight (`vpm-mpt__item--top`), which separates it
      as its own visual block instead of just tweaking one glyph. Verified
      in the harness with mock data both times.
- [x] **Sticky-player collision risk (resolved by the above)**: the 8-item
      list's bottom edge could land behind the harness's fixed Stream Player
      bar (confirmed unclickable via `elementFromPoint`). At 5 items the
      list is short enough it no longer reaches the player in harness
      testing. Still worth a quick visual confirmation on the real vpm.org
      post page once deployed, but no longer a known blocker.
- [ ] Not yet pasted into wp-admin → Widgets sidebar area
