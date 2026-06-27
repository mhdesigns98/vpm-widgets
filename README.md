# VPM Widgets

Standalone HTML/CSS/JS embeds and web components for VPM News. All widgets live under `/widgets/`.

## Structure

```
/widgets/[widget-name]/
    index.html     ← self-contained embed or combined preview
    README.md      ← description, usage, source
```

Some widgets built for WordPress ACF use a split-file format instead:

```
/widgets/[widget-name]/
    preview.html   ← full browser preview
    html.html      ← paste into ACF HTML field
    css.css        ← paste into ACF CSS field
    js.js          ← paste into ACF JS field
```

All class names are namespaced to avoid conflicts with the host page.

## Widgets

| Folder | Description |
|---|---|
| `elections-2026-primary/` | 2026 Virginia Primary promo — dates, video carousel, article links *(ACF split-file)* |
| `elections-banner-2026/` | 2026 elections coverage promo banner |
| `vpm-banner/` | General-purpose promotional banner component |
| `vpm-spotlight-homepage/` | Homepage spotlight with admin UI and JSON content queue |
| `morning-monitor-signup/` | Morning Monitor newsletter signup embed |
| `watch-page-header/` | Channel selector header for the Watch live page |
| `youtube-shorts-embed/` | VPM News Shorts carousel embed |
| `ecp-partners-team/` | Early Childhood Education partners & team (Brightspot) |
| `annual-report-2025/` | 2025 Annual Report interactive embed |
| `how-federal-funding-works/` | Federal funding explainer for the impact page |
| `impact-testimonial/` | Testimonial component for impact/giving pages |
| `vpm-morning-monitor-popup/` | Newsletter signup banner — GTM Custom HTML Tag, Shadow DOM, 35s delay |
| `basics-virginia/` | The Basics Virginia™ — full-page composite, 5-section HtmlModule |

## Brand Guide

VPM color, typography, voice, and component conventions live in two places:

- **Visual:** [`brand-guide.html`](brand-guide.html) — rendered swatches, type scale, pattern examples, and copyable CSS variable blocks
- **Reference:** [`BRAND_GUIDE.md`](BRAND_GUIDE.md) — Markdown tables of all tokens, a paste-ready `:root` CSS block, and the full conventions checklist

Use `BRAND_GUIDE.md` as context when prompting Claude to build a new widget.

## Adding a new widget

1. Create `/widgets/[short-name]/`
2. Add `index.html` (or ACF split files) and `README.md`
3. Namespace all classes and IDs (e.g. `vpm-pledge26-`)
4. Add a row to the table above
5. Commit and push — GitHub Pages preview available at `https://mhdesigns98.github.io/vpm-widgets/widgets/[name]/`
