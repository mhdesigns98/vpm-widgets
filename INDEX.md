# Widgets Index

Lookup table for existing widgets — check here before picking a new slug or namespace prefix
so they don't collide. Kept out of `CLAUDE.md` so it isn't loaded into context on every session.

`/new-widget` adds a row here when scaffolding.

| Folder | Description |
|---|---|
| `elections-2026-primary/` | 2026 Virginia Primary promo — dates, video carousel, article links (WordPress ACF split-file format) |
| `elections-2026-primary-cta/` | 2026 Virginia Primary homepage CTA — photo + dark-blue panel linking to vpm.org/elections (WordPress ACF split-file format) |
| `elections-banner-2026/` | 2026 elections coverage promo banner (prototype) |
| `vpm-banner/` | General-purpose promotional banner component |
| `vpm-spotlight-homepage/` | Homepage spotlight with admin UI and JSON content queue |
| `vpm-spotlight-leadontop/` | Homepage spotlight variant — full-width lead story over a two-card row (static) |
| `morning-monitor-signup/` | Morning Monitor newsletter signup embed (Full/Inline/Sidebar), POSTs directly to Mailchimp via JSONP with in-page confirmation — no backend |
| `weekly-update-signup/` | Weekly Update newsletter signup embed (Full/Inline/Sidebar), POSTs directly to Mailchimp via JSONP with in-page confirmation — no backend |
| `virginia-home-grown-signup/` | Virginia Home Grown newsletter signup embed (Full/Inline/Sidebar), POSTs directly to Mailchimp via JSONP with in-page confirmation — no backend |
| `listen-stream-bar/` | Quick-access audio stream bar for the Listen page — eyebrow label + four stream/podcast buttons on VPM dark blue (WordPress HTML block) |
| `links-with-map/` | Reusable map-beside-directory block — Google My Maps embed + multi-column outbound link list; first instance is Virginia wineries A–Z (WordPress ACF split-file format, no JS) |
| `watch-page-header/` | Channel selector header for the Watch live page |
| `youtube-shorts-embed/` | VPM News Shorts carousel embed |
| `ecp-partners-team/` | Early Childhood Education partners & team (Brightspot embed) |
| `annual-report-2025/` | 2025 Annual Report interactive embed |
| `how-federal-funding-works/` | Federal funding explainer section for impact page |
| `impact-testimonial/` | Testimonial component for impact/giving pages |
| `impact-report-2025/` | 2025 Impact Report page as deployed — hero, sticky jump links, awards counters; consolidated page stylesheet + deferred behavior script (namespaces `vpm-impact25-`, `vpm-awards2025`, full page rather than a single block) |
