# Widgets Index

Lookup table for existing widgets — check here before picking a new slug or namespace prefix
so they don't collide. Kept out of `CLAUDE.md` so it isn't loaded into context on every session.

`/new-widget` adds a row here when scaffolding.

| Folder | Description |
|---|---|
| `elections-2026-primary/` | 2026 Virginia Primary promo — dates, video carousel, article links (WordPress ACF split-file format) |
| `ap-election-results/` | AP live election results embed — full-bleed dark hero over a white results panel, AP iframe + auto-resizer, race-call disclosure note (Brightspot HTML embed, namespace `vpm-apres-`) |
| `elections-2026-primary-cta/` | 2026 Virginia Primary homepage CTA — photo + dark-blue panel linking to vpm.org/elections (WordPress ACF split-file format) |
| `vpm-banner/` | General-purpose promotional banner component |
| `vpm-spotlight-homepage/` | Homepage spotlight with admin UI and JSON content queue |
| `vpm-spotlight-leadontop/` | Homepage spotlight variant — full-width lead story over a two-card row (static) |
| `morning-monitor-signup/` | Morning Monitor newsletter signup embed (Full/Inline/Sidebar), POSTs directly to Mailchimp via JSONP with in-page confirmation — no backend |
| `vpm-morning-monitor-popup/` | Morning Monitor signup popup — Shadow DOM modal with time / scroll / exit-intent triggers and localStorage cooldowns, POSTs to Mailchimp via JSONP (GTM-deployed, not a CMS block) |
| `weekly-update-signup/` | Weekly Update newsletter signup embed (Full/Inline/Sidebar), POSTs directly to Mailchimp via JSONP with in-page confirmation — no backend |
| `virginia-home-grown-signup/` | Virginia Home Grown newsletter signup embed (Full/Inline/Sidebar), POSTs directly to Mailchimp via JSONP with in-page confirmation — no backend |
| `listen-stream-bar/` | Quick-access audio stream bar for the Listen page — eyebrow label + four stream/podcast buttons on VPM dark blue (WordPress HTML block) |
| `unwined-episode/` | Un-Wine'd page upper section — "Stream more" lockup, jump links, PBS viral player, episode write-up, sponsor row; pairs with `links-with-map/` below it (WordPress ACF split-file format, no JS) |
| `links-with-map/` | Reusable map-beside-directory block — Google My Maps embed + multi-column outbound link list; first instance is Virginia wineries A–Z (WordPress ACF split-file format, no JS) |
| `watch-page-header/` | Channel selector header for the Watch live page |
| `youtube-shorts-embed/` | VPM News Shorts carousel embed |
| `video-promo-section/` | Two-column video promo — poster with optional LIVE bug, click-to-load Vimeo player, title + CTA links (namespace `vpm-ls`) |
| `ecp-partners-team/` | Early Childhood Education partners & team (Brightspot embed) |
| `basics-virginia/` | The Basics Virginia™ campaign page — five-section composite (hero, 5 principles, in action, movement, nature trail) built as Shadow DOM web components with Vimeo embeds (namespace `basics-`, full page rather than a single block) |
| `annual-report-2025/` | 2025 Annual Report interactive embed |
| `how-federal-funding-works/` | Federal funding explainer section for impact page |
| `impact-testimonial/` | Testimonial component for impact/giving pages |
| `impact-report-2025/` | 2025 Impact Report page as deployed — hero, sticky jump links, awards counters; consolidated page stylesheet + deferred behavior script (namespaces `vpm-impact25-`, `vpm-awards2025`, full page rather than a single block) |
