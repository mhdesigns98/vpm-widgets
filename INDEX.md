# Index

Lookup table for every widget and page build — check here before picking a new slug or namespace prefix so they don't collide. Kept out of `CLAUDE.md` so it isn't loaded into context on every session.

`/new-widget` and `/new-page` add a row here when scaffolding. **Path** is the folder under the repo root; **Used on** is `multiple` for a widget, or the one URL for a page build (fill it in when known).

Widgets are grouped by family; page builds are in one table at the end. Stub rows are old folders kept only because something live still loads them by URL.

## Newsletters

Signup forms and promos for VPM's Mailchimp newsletters. The hosted iframe versions are in `hosted/signup-forms/`.

| Path | Shape | Used on | Description |
|---|---|---|---|
| `widgets/newsletter-signup-embed/` | widget | multiple | Mailchimp newsletter signup for Morning Monitor, Weekly Update and Virginia Home Grown, one responsive block per brand that adapts to its column width (replaced the Full/Inline/Sidebar variants 2026-10-15), one shared form engine + per-brand theme; in-page JSONP confirmation with native-POST fallback, no backend. **Generated:** edit `src/`, run `node build.mjs` (namespace `vpm-nls-`, WordPress ACF split-file per brand). Also feeds `hosted/signup-forms` |
| `widgets/newsletter-signup-cta/` | widget | multiple | Compact inline CTA banner linking out to the combined newsletter signup page (vpm.org/stay-connected-to-what-matters); for reuse across many pages that shouldn't embed the full form (WordPress ACF split-file format, namespace `vpm-nlcta-`, no JS) |
| `widgets/vpm-morning-monitor-popup/` | widget | multiple | Morning Monitor signup popup — Shadow DOM modal with time / scroll / exit-intent triggers and localStorage cooldowns, POSTs to Mailchimp via JSONP (GTM-deployed, not a CMS block) |
| `widgets/morning-monitor-signup/` | stub | n/a | **Assets only.** Merged into `newsletter-signup-embed` (2026-10-09); the logo is still loaded by URL from vpm.org's article sidebar widget and two pages (see its README). Delete once those are re-pasted |

## PBS Video Playlist

Any change to the playlist module goes in `pbs-video-playlist/`, one subfolder per production.

| Path | Shape | Used on | Description |
|---|---|---|---|
| `widgets/pbs-video-playlist/` | widget | multiple | PBS show episode playlist module: PBS partner player + 5-episode thumbnail strip, autoplay to next, via the `pbs-api` CF Worker proxy of PBS Media Manager (WordPress iframe embed). One subfolder per production: `template/` (generic, namespace `vpm-psp-`, formerly `pbs-show-playlist`) and `virginia-home-grown/` (VHG green sub-brand, namespace `vpm-vhgp-`, live on the VHG show page) |
| `widgets/virginia-home-grown-playlist/` | stub | n/a | **Redirect only.** Moved to `pbs-video-playlist/virginia-home-grown/` (2026-10-16); kept because the live VHG show page still iframes this URL. Delete once that block is re-pasted |

## Elections

Related page builds: `pages/elections-2026-primary/`, `pages/voter-guide-2026/`.

| Path | Shape | Used on | Description |
|---|---|---|---|
| `widgets/ap-election-results/` | widget | multiple | AP live election results embed — full-bleed dark hero over a white results panel, AP iframe + auto-resizer, race-call disclosure note (Brightspot HTML embed, namespace `vpm-apres-`) |
| `widgets/elections-2026-cta/` | widget | multiple | 2026 Virginia elections CTA, currently for the Nov. 3 general (ran for the Aug. 4 primary as `elections-2026-primary-cta`) — photo + dark-blue panel linking to vpm.org/elections, placed on article pages (WordPress ACF split-file format, namespace `vpm-elec26cta-`) |

## Rails and feeds

| Path | Shape | Used on | Description |
|---|---|---|---|
| `widgets/feed-rail/` | widget | multiple | Reusable vertical rail of short updates (video, articles, audio, text notes) for a sidebar or beside a main story; content is a hand-edited `FEED_ITEMS` array in-file, no backend — video thumbnails pulled from YouTube's static thumbnail endpoint (namespace `vpm-feedrail-`, WordPress ACF single-file) |
| `widgets/live-updates-rail/` | widget | multiple | Vertical rail of short reporter dispatches (text/image/audio/embed posts) with per-post share + copy-link, expandable long bodies, and a "Load more" reveal for older items; for a sidebar, topic page, or mobile "Updates" tab (namespace `vpm-lur-`, WordPress ACF split-file) |
| `widgets/most-popular-today/` | widget | multiple | Top 5 trending stories (trailing 24h) from Chartbeat via the `chartbeat-weekly` Worker; post-page sidebar and homepage hero Shared Module, follows the hero presets (namespace `vpm-mpt-`, WordPress Custom HTML widget / code block) |
| `widgets/related-stories/` | widget | multiple | **Staging prototype; production build handed to WPP (`WPP-SPEC.md`).** Article-aside list of the 4 VPM stories most related to the current article, ranked by tag specificity (category top-up), sticky for the top half of the article then hands off to the sidebar ad; runs on any article type including NPR stories, results VPM-only; reads the site's own WP REST API (namespace `vpm-rel-`, WordPress Code Block in the article sidebar) |

## Spotlight and promos

| Path | Shape | Used on | Description |
|---|---|---|---|
| `widgets/vpm-spotlight-homepage/` | widget | multiple | Homepage spotlight with admin UI and JSON content queue |
| `widgets/vpm-spotlight-leadontop/` | widget | multiple | Homepage spotlight variant — full-width lead story over a two-card row (static) |
| `widgets/vpm-banner/` | widget | multiple | General-purpose promotional banner component |
| `widgets/video-promo-section/` | widget | multiple | Two-column video promo — poster with optional LIVE bug, click-to-load Vimeo player, title + CTA links (namespace `vpm-ls`) |

## YouTube

| Path | Shape | Used on | Description |
|---|---|---|---|
| `widgets/youtube-shorts-embed/` | widget | multiple | VPM News Shorts carousel embed |
| `widgets/youtube-shorts-row/` | widget | multiple | Horizontal row of 9:16 VPM News Shorts cards (click to play in place, one at a time) with a button to the YouTube Shorts playlist; hand-edited `SHORTS` array (namespace `vpm-shortsrow-`, single-file embed) |

## Listen and Watch

| Path | Shape | Used on | Description |
|---|---|---|---|
| `widgets/listen-stream-bar/` | widget | multiple | Quick-access audio stream bar for the Listen page — eyebrow label + four stream/podcast buttons on VPM dark blue (WordPress HTML block) |
| `widgets/watch-page-header/` | widget | multiple | Channel selector header for the Watch live page |

## Other widgets

| Path | Shape | Used on | Description |
|---|---|---|---|
| `widgets/impact-testimonial/` | widget | multiple | Testimonial component for impact/giving pages |
| `widgets/links-with-map/` | widget | multiple | Reusable map-beside-directory block — Google My Maps embed + multi-column outbound link list; first instance is Virginia wineries A–Z (WordPress ACF split-file format, no JS). Consumed by the `unwined-episode` page |
| `widgets/vpm-load-more/` | widget | multiple | Collapsible content section with "Continue reading" expand button, for hiding most of a long-form section (e.g. an interview transcript) behind a click; content stays in the DOM for SEO/a11y (namespace `vpm-lm-`, WordPress Custom HTML block) |

## Page builds

| Path | Shape | Used on | Description |
|---|---|---|---|
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

## Merged and moved widgets

`morning-monitor-signup`, `weekly-update-signup`, `virginia-home-grown-signup` → `newsletter-signup-embed` (2026-10-09). The Weekly Update and VHG folders were deleted 2026-10-16; `morning-monitor-signup` remains as an assets stub (see its row above). Don't reuse these slugs or the `vpm-mm-`, `vpm-wu-`, `vpm-vhg-` prefixes.

`pbs-show-playlist`, `virginia-home-grown-playlist` → `pbs-video-playlist/template/`, `pbs-video-playlist/virginia-home-grown/` (2026-10-16). Don't reuse these slugs; the `vpm-psp-` and `vpm-vhgp-` prefixes now belong to the two subfolders.
