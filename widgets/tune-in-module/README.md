# Tune-in Module

Merged Watch + Listen call to action: one VPM dark-blue band with a "Watch and listen" eyebrow, a Watch group (VPM PBS, PBS Kids, YouTube, All PBS streams), a Listen group (News stream, Music stream, Podcasts, Music archive) and a single schedules link.

**Origin:** Combines `watch-page-header` (image tiles + schedules bar) and `listen-stream-bar` into one compact module. Image tiles became text buttons so the module stays short above a show list. Rebuilt on current `tokens.css` (Public Sans / IBM Plex Sans Condensed, current accent bar, sharp corners, 2px hover lift).

**First placement:** vpm.org/shows, between the page title and Recent Stories. Candidate to replace the Watch and Listen page headers later.

**Deploy target:** WordPress HTML block. Paste the `<section class="vpm-tunein">` block from `index.html`.

**Usage notes:**
- Self-contained, namespace `vpm-tunein-`, no JS, no external dependencies.
- Watch links open in a new tab (screen-reader text says so); Listen links open in the same tab, matching the originals.
- Responsive: three columns, then two (900px), then one (600px). `:focus-visible` yellow outline; `prefers-reduced-motion` respected.

## Analytics (GA4 via GTM)

The widget has no JS. Every link carries three attributes for a GTM click trigger:

| Attribute | Values |
|---|---|
| `data-vpm-cta` | `tune-in` (identifies this module) |
| `data-vpm-cta-group` | `watch`, `listen`, `schedules` |
| `data-vpm-cta-label` | `vpm-pbs`, `pbs-kids`, `youtube`, `all-pbs-streams`, `news-stream`, `music-stream`, `podcasts`, `music-archive`, `schedules` |

**GTM setup** (one-time, done in GTM, not in this repo):

1. **Variables** — two Auto-Event Variables, type *Element Attribute*: `data-vpm-cta-group` → `AEV Tune-in Group`, `data-vpm-cta-label` → `AEV Tune-in Label`. Enable the built-in *Click Text* and *Click URL* variables if they aren't already.
2. **Trigger** — *Click – Just Links*, fires on *Some Link Clicks* where *Click Element* matches CSS selector `a[data-vpm-cta="tune-in"]`. Use *Just Links*, not *All Elements*: the live dot is a `<span>` inside the link, and only the link trigger resolves a click on it to the `<a>`.
3. **Tag** — GA4 Event, name `tune_in_cta_click` (follows the property's `travel_club_cta_click` pattern), parameters:
   - `content_type` = `{{AEV Tune-in Group}}`
   - `click_text` = `{{AEV Tune-in Label}}`
   - `click_url` = `{{Click URL}}`
   - `page_type` = the page path or existing page-type variable, so Shows-page and sidebar placements can be told apart

`content_type`, `click_text`, `click_url` and `page_type` are already registered event-scoped custom dimensions on the VPM.org GA4 property, so the parameters show up in reports with no GA4 admin change. Reuse them rather than registering new ones.

Note: GA4's enhanced-measurement `outbound_link_click` will also fire on the off-site links (bit.ly, YouTube, PBS). That's expected; `tune_in_cta_click` is the one that says the click came from this module.
