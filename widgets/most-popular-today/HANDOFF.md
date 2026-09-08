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
      a blocklist to an allowlist (`ARTICLE_PATH` in `chartbeat.js`) requiring
      a dated `/news/`, `/npr-news/`, `/announcements/` path or `/npr-story/`
      slug, since blocklisting kept missing new cases
- [x] Visual review in the CMS test harness (`harness.html?widget=most-popular-today`,
      real data injected manually since the harness runs on localhost and the
      Worker's CORS lock correctly blocks it there). Found and fixed a real
      scoping bug: the harness's hostile `.article-body a { color: #EE2737
      !important }` rule was winning over the widget's link color because its
      selector had higher specificity — `!important` alone wasn't enough.
      Fixed with a `.vpm-mpt.vpm-mpt` doubled-class selector to raise
      specificity above the host rule. Confirmed link color, hover/focus
      state, spacing, and the eyebrow/rule treatment all read correctly
      against hostile host CSS, sticky player, and delayed hydration/re-render.
- [ ] Run `/ship-widget most-popular-today` for the full guided pre-deploy
      checklist (accessibility pass, copy-paste-ready CMS blocks) — the
      harness checks above were a manual look-and-feel pass, not the full
      gate
- [ ] Not yet pasted into wp-admin → Widgets sidebar area
- [ ] `vpm-widgets` repo changes (CSS specificity fix) not yet committed
