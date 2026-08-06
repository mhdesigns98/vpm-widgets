# Widgets Index

Lookup table for existing widgets — check here before picking a new slug or namespace prefix
so they don't collide. Kept out of `CLAUDE.md` so it isn't loaded into context on every session.

Full page builds live in the sibling repo and are indexed at
`~/Projects/vpm/vpm-pages/INDEX.md`. **Check both** — the two repos share one namespace convention,
so a prefix collision across them is still a collision.

`/new-widget` adds a row here when scaffolding.

| Folder | Description |
|---|---|
| `elections-2026-primary-cta/` | 2026 Virginia Primary homepage CTA — photo + dark-blue panel linking to vpm.org/elections (WordPress ACF split-file format) |
| `impact-testimonial/` | Testimonial component for impact/giving pages |
| `links-with-map/` | Reusable map-beside-directory block — Google My Maps embed + multi-column outbound link list; first instance is Virginia wineries A–Z (WordPress ACF split-file format, no JS). Consumed by the `unwined-episode` page |
| `listen-stream-bar/` | Quick-access audio stream bar for the Listen page — eyebrow label + four stream/podcast buttons on VPM dark blue (WordPress HTML block) |
| `morning-monitor-signup/` | Morning Monitor newsletter signup embed (Full/Inline/Sidebar), POSTs directly to Mailchimp via JSONP with in-page confirmation — no backend |
| `video-promo-section/` | Two-column section — click-to-load Vimeo player left, title and CTA links right; supports a LIVE bug overlay |
| `virginia-home-grown-signup/` | Virginia Home Grown newsletter signup embed (Full/Inline/Sidebar), POSTs directly to Mailchimp via JSONP with in-page confirmation — no backend |
| `vpm-banner/` | General-purpose promotional banner — dismissible, hides for 3 days via localStorage |
| `vpm-morning-monitor-popup/` | Newsletter signup banner — GTM Custom HTML Tag, Shadow DOM, 35s delay, 7/30-day cooldown |
| `vpm-spotlight-homepage/` | Homepage spotlight with admin UI and JSON content queue |
| `vpm-spotlight-leadontop/` | Homepage spotlight variant — full-width lead story over a two-card row (static) |
| `watch-page-header/` | Channel selector header for the Watch live page |
| `weekly-update-signup/` | Weekly Update newsletter signup embed (Full/Inline/Sidebar), POSTs directly to Mailchimp via JSONP with in-page confirmation — no backend |
| `youtube-shorts-embed/` | VPM News Shorts carousel embed |

## Moved to vpm-pages

These were here and are now full page builds in `~/Projects/vpm/vpm-pages/pages/`:
`annual-report-2025`, `basics-virginia`, `ecp-partners-team`, `elections-2026-primary`,
`how-federal-funding-works`, `impact-report-2025`, `unwined-episode`.
