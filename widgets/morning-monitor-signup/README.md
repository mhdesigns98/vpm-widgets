# morning-monitor-signup (merged)

Merged into [`newsletter-signup-embed`](../newsletter-signup-embed/) on 2026-10-09. Build and paste from there.

Only `assets/` remains, because already-pasted CMS blocks (and, for Morning Monitor, the GTM
popup's `LOGO_URL`) load these files by their GitHub Pages URL. Delete this folder once nothing
live references `widgets/morning-monitor-signup/assets/`.

## Live references (checked 2026-10-16)

- vpm.org article and episode sidebar: WP widget `custom_html-6` (Appearance → Widgets), on every article and episode page
- vpm.org pages: `/news/` (page 486602) and `/vpm-morning-monitor-signup/` (page 411330), both in an ACF code block
- GTM: the Morning Monitor popup tag, until it is re-pasted from `vpm-morning-monitor-popup/index.html` (repointed in the repo)
