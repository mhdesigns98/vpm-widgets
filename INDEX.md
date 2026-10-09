# Index

Lookup table for every widget and page build — check here before picking a new slug or namespace prefix so they don't collide. Kept out of `CLAUDE.md` so it isn't loaded into context on every session.

`/new-widget` and `/new-page` add a row here when scaffolding. **Path** is the folder under the repo root; **Used on** is `multiple` for a widget, or the one URL for a page build (fill it in when known).

| Path | Shape | Used on | Description |
|---|---|---|---|
| `widgets/ap-election-results/` | widget | multiple | AP live election results embed — full-bleed dark hero over a white results panel, AP iframe + auto-resizer, race-call disclosure note (Brightspot HTML embed, namespace `vpm-apres-`) |
| `widgets/elections-2026-primary-cta/` | widget | multiple | 2026 Virginia Primary homepage CTA — photo + dark-blue panel linking to vpm.org/elections (WordPress ACF split-file format) |
| `widgets/feed-rail/` | widget | multiple | Reusable vertical rail of short updates (video, articles, audio, text notes) for a sidebar or beside a main story; content is a hand-edited `FEED_ITEMS` array in-file, no backend — video thumbnails pulled from YouTube's static thumbnail endpoint (namespace `vpm-feedrail-`, WordPress ACF single-file) |
| `widgets/impact-testimonial/` | widget | multiple | Testimonial component for impact/giving pages |
| `widgets/live-updates-rail/` | widget | multiple | Vertical rail of short reporter dispatches (text/image/audio/embed posts) with per-post share + copy-link, expandable long bodies, and a "Load more" reveal for older items; for a sidebar, topic page, or mobile "Updates" tab (namespace `vpm-lur-`, WordPress ACF split-file) |
| `widgets/links-with-map/` | widget | multiple | Reusable map-beside-directory block — Google My Maps embed + multi-column outbound link list; first instance is Virginia wineries A–Z (WordPress ACF split-file format, no JS). Consumed by the `unwined-episode` page |
| `widgets/listen-stream-bar/` | widget | multiple | Quick-access audio stream bar for the Listen page — eyebrow label + four stream/podcast buttons on VPM dark blue (WordPress HTML block) |
| `widgets/morning-monitor-signup/` | widget | multiple | Morning Monitor newsletter signup embed (Full/Inline/Sidebar), POSTs directly to Mailchimp via JSONP with in-page confirmation — no backend |
| `widgets/most-popular-today/` | widget | multiple | Post-page sidebar widget showing top 5 trending stories (trailing 24h) from Chartbeat; stub pending a real data endpoint (namespace `vpm-mpt-`, WordPress Custom HTML widget) |
| `widgets/newsletter-signup-cta/` | widget | multiple | Compact inline CTA banner linking out to the combined newsletter signup page (vpm.org/stay-connected-to-what-matters); for reuse across many pages that shouldn't embed the full form (WordPress ACF split-file format, namespace `vpm-nlcta-`, no JS) |
| `widgets/pbs-show-playlist/` | widget | multiple | API-driven PBS show episode playlist — main PBS partner player + 5-episode thumbnail strip, autoplay to next; fetches from CF Worker proxy of PBS Media Manager API (namespace `vpm-psp-`, WordPress iframe embed) — generic template other PBS shows duplicate from |
| `widgets/video-promo-section/` | widget | multiple | Two-column video promo — poster with optional LIVE bug, click-to-load Vimeo player, title + CTA links (namespace `vpm-ls`) |
| `widgets/virginia-home-grown-playlist/` | widget | multiple | Same as `pbs-show-playlist` but restyled to VHG's green sub-brand (leaf-pattern background, `--vhg-green`); replaces `pbs-show-playlist` on the live VHG show page (namespace `vpm-vhgp-`, WordPress iframe embed) |
| `widgets/virginia-home-grown-signup/` | widget | multiple | Virginia Home Grown newsletter signup embed (Full/Inline/Sidebar), POSTs directly to Mailchimp via JSONP with in-page confirmation — no backend |
| `widgets/related-stories/` | widget | multiple | Article-aside list of 4 recent stories sharing a tag with the current article (category top-up), sticky for the top half of the article then hands off to the sidebar ad; fetches from the vpm.org WP REST API, post ID from the `postid-` body class (namespace `vpm-rel-`, WordPress Code Block in the article template) |
| `widgets/vpm-banner/` | widget | multiple | General-purpose promotional banner component |
| `widgets/vpm-load-more/` | widget | multiple | Collapsible content section with "Continue reading" expand button, for hiding most of a long-form section (e.g. an interview transcript) behind a click; content stays in the DOM for SEO/a11y (namespace `vpm-lm-`, WordPress Custom HTML block) |
| `widgets/vpm-morning-monitor-popup/` | widget | multiple | Morning Monitor signup popup — Shadow DOM modal with time / scroll / exit-intent triggers and localStorage cooldowns, POSTs to Mailchimp via JSONP (GTM-deployed, not a CMS block) |
| `widgets/vpm-spotlight-homepage/` | widget | multiple | Homepage spotlight with admin UI and JSON content queue |
| `widgets/vpm-spotlight-leadontop/` | widget | multiple | Homepage spotlight variant — full-width lead story over a two-card row (static) |
| `widgets/watch-page-header/` | widget | multiple | Channel selector header for the Watch live page |
| `widgets/weekly-update-signup/` | widget | multiple | Weekly Update newsletter signup embed (Full/Inline/Sidebar), POSTs directly to Mailchimp via JSONP with in-page confirmation — no backend |
| `widgets/youtube-shorts-embed/` | widget | multiple | VPM News Shorts carousel embed |
| `widgets/youtube-shorts-row/` | widget | multiple | Horizontal row of 9:16 VPM News Shorts cards (click to play in place, one at a time) with a button to the YouTube Shorts playlist; hand-edited `SHORTS` array (namespace `vpm-shortsrow-`, single-file embed) |
| `pages/annual-report-2025/` | page, single-file | one URL | 2025 Annual Report interactive page |
| `pages/basics-virginia/` | page, single-file | one URL | The Basics Virginia™ — five-section page composite (hero, 5 principles, in action, the movement, nature trail CTA) as one Brightspot HtmlModule drop-in; uses web components and px-not-rem sizing |
| `pages/ecp-partners-team/` | page, single-file | one URL | Early Childhood Education partners & team (Brightspot embed) |
| `pages/elections-2026-primary/` | page, split-file | one URL | 2026 Virginia Primary page — dates, video carousel, article links (WordPress ACF) |
| `pages/how-federal-funding-works/` | page, single-file | one URL | Federal funding explainer section for the impact page |
| `pages/impact-report-2025/` | page, split-file | one URL | 2025 Impact Report page as deployed — hero, sticky jump links, awards counters; consolidated page stylesheet + deferred behavior script (namespaces `vpm-impact25-`, `vpm-awards2025`). Two HTML fields, see its README for paste order |
| `pages/mending-walls/` | page, split-file | one URL | Mending Walls documentary companion page (Mending Walls RVA public art project) — consolidated from 12 stacked WordPress sections into one Code Block (namespace `vpm-mw-`). Kinsta dev copy was missing a 5-image carousel present on the live `vpm.org` page; added from a live screenshot + supplied image URLs. Podcast kept as a simplified castbox iframe rather than the live page's native playlist widget; see README |
| `pages/neighborhood-history/` | page, split-file | one URL | Neighborhood History — the story of the site of VPM's 15 E. Broad St. headquarters as a captioned photo timeline (1886–2026), full-bleed navy map band, and closing lockup + Weekly Update signup, in one Code Block under the native hero (namespace `vpm-nh-`). **Read the README's "Do not paste until" gate first.** Carries `BRIEF.md` and `DEV-REQUEST.md` |
| `pages/raised-razed/` | page, split-file | one URL | Raised/Razed documentary page (Vinegar Hill, Charlottesville) — consolidated from 32 stacked WordPress sections into one Code Block (namespace `vpm-rr-`). Built against the live `vpm.org` page after discovering the Kinsta staging port was missing content (a headshot, a 6th press card, all article links); see README |
| `pages/rva-events-september-2026/` | page, single-file | one URL | Upcoming Events list block for a VPM subsite page — RVA First Fridays and Broad New Day (namespace `vpm-evts-`), no JS |
| `pages/unwined-episode/` | page, split-file | one URL | Un-Wine'd page upper section — "Stream more" lockup, jump links, PBS viral player, episode write-up, sponsor row. **Uses widget:** `links-with-map` pasted directly below it |
| `pages/voter-guide-2026/` | page, sections | one URL | 2026 Voter Guide — seven sections pasted separately into the WordPress editor; **read `sections/PASTE-ORDER.md` before pasting**. Reference implementation of the `sections/` shape. Carries `BRIEF.md`, `AUDIT.md`, and `DEV-REQUEST.md` |

## Moved from widgets to pages

`annual-report-2025`, `basics-virginia`, `ecp-partners-team`, `elections-2026-primary`, `how-federal-funding-works`, `impact-report-2025`, `unwined-episode`.
