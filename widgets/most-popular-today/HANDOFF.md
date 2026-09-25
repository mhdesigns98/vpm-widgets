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
- [ ] **Known open risk, not fully resolved**: testing the 8-item list in the
      CMS harness found the list's bottom edge can land behind the harness's
      fixed Stream Player bar (confirmed with `elementFromPoint` returning
      `null` there — genuinely unclickable). Whether the widget's real page
      position ever falls behind a fixed bottom bar depends on the actual
      WordPress sidebar template's layout (article length, viewport height),
      which isn't knowable from this synthetic harness, and a height cap was
      ruled out as the fix (mobile scroll-trap tradeoff above). **Verify
      directly on a real vpm.org post page once deployed**, scrolling to
      where the sidebar widget sits, and confirm all 8 links (especially the
      last 2-3) are clickable and not obscured by VPM's real sticky player
      if one exists on the live site. If this turns out to be a real
      problem, the fix should target the actual colliding element (e.g. the
      player reserving its own space instead of overlaying), not capping the
      widget's height again.
- [ ] Not yet pasted into wp-admin → Widgets sidebar area
