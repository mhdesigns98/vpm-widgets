# Widget Lab

## Purpose
This project is for building standalone HTML/CSS/JS embeds and web components for VPM and personal use. All widgets live in a single consolidated GitHub repo: https://github.com/mhdesigns98/vpm-widgets

## Repo Structure
```
/widgets
  /[widget-name]
    index.html       ← self-contained embed or combined preview
    README.md        ← description, source, usage notes
```

Some widgets (e.g. `elections-2026-primary`) use a split-file format for WordPress ACF:

```
/widgets/[widget-name]
    preview.html     ← full browser preview
    html.html        ← ACF HTML field
    css.css          ← ACF CSS field
    js.js            ← ACF JS field
```

## Design Tokens
`tokens.css` in the repo root is the **canonical VPM design token file** (migrated from the deprecated vpm-component-library). Widgets must stay self-contained, so copy the custom properties you need into the widget's scoped `<style>` — never link the file externally. No hard-coded hex values.

## Style Conventions
- All class names and IDs namespaced with a widget-specific prefix (e.g. `vpm-elec26-`, `vpm-mm-`)
- BEM naming convention within namespace
- Shadow DOM encapsulation for reusable web components
- No external dependencies unless explicitly approved

## Coding Conventions
- IIFE-wrapped JS, no `document.write()`
- WCAG 2.1 AA accessibility
- No external CSS frameworks — inline or scoped styles only
- Self-contained: a single file (or the split-file set) should work dropped into any CMS

## Workflow
1. Write a brief first (`/brief`) — audience, done criteria, out-of-scope, deploy target
2. Scaffold with `/new-widget`, then build in a Claude Code conversation
3. When satisfied, add it under `/widgets/[name]/` following the structure above (`/save-component` does this)
4. Write a one-paragraph `README.md` describing purpose, source, and usage
5. **Pre-ship check** (`/ship-widget`) — required before pasting into any CMS, see checklist below
6. Commit and push to `main`
7. GitHub Pages preview: `https://mhdesigns98.github.io/vpm-widgets/widgets/[name]/`

## Pre-Ship Checklist
Every widget must pass the CMS test harness (`/harness/harness.html?widget=[name]` — see `/harness/README.md`) before deploying:

- [ ] Survives delayed hydration + one detach/re-inject cycle (no double-init, listeners intact)
- [ ] No focus loss or overlap issues with the sticky Stream Player
- [ ] Styles fully scoped — unaffected by hostile host CSS (`!important` links, global heading sizes)
- [ ] CTAs clickable after the click-interceptor overlay clears
- [ ] Degrades gracefully in a 320px column
- [ ] Keyboard accessible, visible focus, WCAG 2.1 AA contrast, `prefers-reduced-motion` respected
- [ ] No console errors in the harness log

## Repo Consolidation
When asked to consolidate, audit existing repos and Gists, identify widget/embed code, and migrate it into the structure above. Archive source repos after migration.

## Widgets Index

| Folder | Description |
|---|---|
| `elections-2026-primary/` | 2026 Virginia Primary promo — dates, video carousel, article links (WordPress ACF split-file format) |
| `elections-banner-2026/` | 2026 elections coverage promo banner (prototype) |
| `vpm-banner/` | General-purpose promotional banner component |
| `vpm-spotlight-homepage/` | Homepage spotlight with admin UI and JSON content queue |
| `vpm-spotlight-leadontop/` | Homepage spotlight variant — full-width lead story over a two-card row (static) |
| `morning-monitor-signup/` | Morning Monitor newsletter signup embed (Full/Inline/Sidebar), POSTs directly to Mailchimp — no backend |
| `weekly-update-signup/` | Weekly Update newsletter signup embed (Full/Inline/Sidebar), POSTs directly to Mailchimp — no backend |
| `virginia-home-grown-signup/` | Virginia Home Grown newsletter signup embed (Full/Inline/Sidebar), POSTs directly to Mailchimp — no backend |
| `listen-stream-bar/` | Quick-access audio stream bar for the Listen page — eyebrow label + four stream/podcast buttons on VPM dark blue (WordPress HTML block) |
| `watch-page-header/` | Channel selector header for the Watch live page |
| `youtube-shorts-embed/` | VPM News Shorts carousel embed |
| `ecp-partners-team/` | Early Childhood Education partners & team (Brightspot embed) |
| `annual-report-2025/` | 2025 Annual Report interactive embed |
| `how-federal-funding-works/` | Federal funding explainer section for impact page |
| `impact-testimonial/` | Testimonial component for impact/giving pages |
