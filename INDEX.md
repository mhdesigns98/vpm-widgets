# Widgets Index

Lookup table for existing widgets — check here before picking a new slug or namespace prefix
so they don't collide. Kept out of `CLAUDE.md` so it isn't loaded into context on every session.

Full page builds live in the sibling repo and are indexed at
`vpm-pages`' `INDEX.md`. **Check both** — the two repos share one namespace convention,
so a prefix collision across them is still a collision.

`/new-widget` adds a row here when scaffolding.

| Folder | Description |
|---|---|
| `ap-election-results/` | AP live election results embed — full-bleed dark hero over a white results panel, AP iframe + auto-resizer, race-call disclosure note (Brightspot HTML embed, namespace `vpm-apres-`) |
| `elections-2026-primary-cta/` | 2026 Virginia Primary homepage CTA — photo + dark-blue panel linking to vpm.org/elections (WordPress ACF split-file format) |
| `feed-rail/` | Reusable vertical rail of short updates (video, articles, audio, text notes) for a sidebar or beside a main story; content is a hand-edited `FEED_ITEMS` array in-file, no backend — video thumbnails pulled from YouTube's static thumbnail endpoint (namespace `vpm-feedrail-`, WordPress ACF single-file) |
| `impact-testimonial/` | Testimonial component for impact/giving pages |
| `links-with-map/` | Reusable map-beside-directory block — Google My Maps embed + multi-column outbound link list; first instance is Virginia wineries A–Z (WordPress ACF split-file format, no JS). Consumed by the `unwined-episode` page |
| `listen-stream-bar/` | Quick-access audio stream bar for the Listen page — eyebrow label + four stream/podcast buttons on VPM dark blue (WordPress HTML block) |
| `morning-monitor-signup/` | Morning Monitor newsletter signup embed (Full/Inline/Sidebar), POSTs directly to Mailchimp via JSONP with in-page confirmation — no backend |
| `most-popular-today/` | Post-page sidebar widget showing top 5 trending stories (trailing 24h) from Chartbeat; stub pending a real data endpoint (namespace `vpm-mpt-`, WordPress Custom HTML widget) |
| `newsletter-signup-cta/` | Compact inline CTA banner linking out to the combined newsletter signup page (vpm.org/stay-connected-to-what-matters); for reuse across many pages that shouldn't embed the full form (WordPress ACF split-file format, namespace `vpm-nlcta-`, no JS) |
| `pbs-show-playlist/` | API-driven PBS show episode playlist — main PBS partner player + 5-episode thumbnail strip, autoplay to next; fetches from CF Worker proxy of PBS Media Manager API (namespace `vpm-psp-`, WordPress iframe embed) — generic template other PBS shows duplicate from |
| `video-promo-section/` | Two-column video promo — poster with optional LIVE bug, click-to-load Vimeo player, title + CTA links (namespace `vpm-ls`) |
| `virginia-home-grown-playlist/` | Same as `pbs-show-playlist` but restyled to VHG's green sub-brand (leaf-pattern background, `--vhg-green`); replaces `pbs-show-playlist` on the live VHG show page (namespace `vpm-vhgp-`, WordPress iframe embed) |
| `virginia-home-grown-signup/` | Virginia Home Grown newsletter signup embed (Full/Inline/Sidebar), POSTs directly to Mailchimp via JSONP with in-page confirmation — no backend |
| `vpm-banner/` | General-purpose promotional banner component |
| `vpm-load-more/` | Collapsible content section with "Continue reading" expand button, for hiding most of a long-form section (e.g. an interview transcript) behind a click; content stays in the DOM for SEO/a11y (namespace `vpm-lm-`, WordPress Custom HTML block) |
| `vpm-morning-monitor-popup/` | Morning Monitor signup popup — Shadow DOM modal with time / scroll / exit-intent triggers and localStorage cooldowns, POSTs to Mailchimp via JSONP (GTM-deployed, not a CMS block) |
| `vpm-spotlight-homepage/` | Homepage spotlight with admin UI and JSON content queue |
| `vpm-spotlight-leadontop/` | Homepage spotlight variant — full-width lead story over a two-card row (static) |
| `watch-page-header/` | Channel selector header for the Watch live page |
| `weekly-update-signup/` | Weekly Update newsletter signup embed (Full/Inline/Sidebar), POSTs directly to Mailchimp via JSONP with in-page confirmation — no backend |
| `youtube-shorts-embed/` | VPM News Shorts carousel embed |

## Moved to vpm-pages

These were here and are now full page builds in `vpm-pages` (under `pages/`):
`annual-report-2025`, `basics-virginia`, `ecp-partners-team`, `elections-2026-primary`,
`how-federal-funding-works`, `impact-report-2025`, `unwined-episode`.
