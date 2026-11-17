# Tune-in Module

Merged Watch + Listen call to action: one VPM dark-blue band with a "Watch and listen" eyebrow, a Watch group (VPM PBS, PBS Kids, VPM on YouTube, More PBS channels), a Listen group (VPM News 88.9, VPM Music, Podcasts, Past music shows) and a single schedules link.

**Origin:** Combines `watch-page-header` (image tiles + schedules bar) and `listen-stream-bar` into one compact module. Image tiles became text buttons so the module stays short above a show list. Rebuilt on current `tokens.css` (Public Sans / IBM Plex Sans Condensed, current accent bar, sharp corners, 2px hover lift).

**First placement:** vpm.org/shows, between the page title and Recent Stories. Candidate to replace the Watch and Listen page headers later.

**Deploy target:** WordPress HTML block. Paste the `<section class="vpm-tunein">` block from `index.html`.

**Usage notes:**
- Self-contained, namespace `vpm-tunein-`, no JS, no external dependencies.
- Watch links open in a new tab (screen-reader text says so); Listen links open in the same tab, matching the originals.
- Responsive: three columns, then two (900px), then one (600px). `:focus-visible` yellow outline; `prefers-reduced-motion` respected.

## Analytics

No tracking code or attributes needed. vpm.org's existing GA4 `click` event already records `link_url` and `link_classes` for every link click (it's how the old `vpm-streambar__button` and `vpm-watch-tile` clicks are tracked today).

To report on this module in GA4: event name `click`, filter **Link classes** contains `vpm-tunein`, break down by **Link URL** (one per button) and **Page path** (which placement). Off-site links also fire the usual `outbound_link_click`.

The class names are the tracking key: renaming `vpm-tunein__btn` or `vpm-tunein__schedules` breaks continuity in those reports.
