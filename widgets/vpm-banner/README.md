# VPM Banner

Dismissible sitewide alert banner. Dark-blue strip with a message and a yellow CTA button. Closing it hides the banner for 3 days via `localStorage`.

## Files

| File | Purpose |
|---|---|
| `index.html` | Full browser preview |
| `html.html` | Paste into ACF HTML field |
| `css.css` | Paste into ACF CSS field |
| `js.js` | Paste into ACF JS field |

## Customizing

- **Message:** Edit the `<p>` text inside `.vpm-banner-content`
- **CTA label:** Change "Donate now" in the `<a>` tag
- **CTA URL:** Update the `href` on the `.vpm-button` link
- **Dismiss duration:** Change `hideDurationDays` in `js.js` (default: 3 days)
- **Reset dismiss:** Clear `vpmBannerDismissed` from `localStorage` in DevTools to show the banner again during testing
