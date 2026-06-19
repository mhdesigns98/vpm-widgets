# VPM Widgets

Promo banners and embeddable widgets for VPM News. Each widget lives in its own folder.

## How to use a widget

Each folder contains four files:

| File | Purpose |
|---|---|
| `preview.html` | Open in a browser to preview the widget and use the **Open in CodePen** button |
| `html.html` | Paste into the ACF **HTML** field in WordPress |
| `css.css` | Paste into the ACF **CSS** field in WordPress |
| `js.js` | Paste into the ACF **JS** field in WordPress |

All class names and IDs are namespaced (e.g. `vpm-elec26-`) so they won't conflict with WordPress or theme styles.

## Widgets

| Folder | Description |
|---|---|
| `elections-2026-primary/` | 2026 Virginia Primary Election promo banner — dates, video carousel, article links |

## Adding a new widget

1. Create a new folder with a short descriptive name (e.g. `pledge-drive-fall-2026/`)
2. Add `preview.html`, `html.html`, `css.css`, and `js.js`
3. Use a unique namespace prefix on all classes and IDs (e.g. `vpm-pledge26-`)
4. Add a row to the Widgets table above
