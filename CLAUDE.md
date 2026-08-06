# Widget Lab

## Purpose
This project is for building standalone HTML/CSS/JS embeds and web components for VPM and personal use — **reusable blocks**. All widgets live in a single consolidated GitHub repo: https://github.com/mhdesigns98/vpm-widgets

## Which repo does this belong in?

> **A widget is used on more than one page. A page build is used on exactly one.**
> If it only ever appears on one URL, it belongs in `vpm-pages` — even if it is block-shaped.

Full page builds live in the sibling repo, `~/Projects/vpm/vpm-pages`
(https://github.com/mhdesigns98/vpm-pages). The test is **reuse, not size**: `elections-2026-primary`
was a small ACF split-file block and still moved to pages, because it only ever appeared on the
primary page. Its sibling `elections-2026-primary-cta` stayed here, because it's a homepage CTA
reused across placements.

If you're about to build the second copy of something that lives in `vpm-pages`, that's the signal to
promote it to a widget here and have both pages consume a copy.

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
`tokens.css` in the repo root is the **canonical VPM design token file for both this repo and
`vpm-pages`** (migrated from the deprecated vpm-component-library). There is deliberately no copy in
`vpm-pages` — two token files would drift, and the drift would stay invisible until two pages
disagreed about VPM blue. Widgets must stay self-contained, so copy the custom properties you need into the widget's scoped `<style>` — never link the file externally. No hard-coded hex values.

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
1. Write a brief first (`/brief`) — done criteria, out-of-scope, deploy target
2. Scaffold with `/new-widget`, then build in a Claude Code conversation
3. When satisfied, add it under `/widgets/[name]/` following the structure above (`/save-component` does this)
4. Write a one-paragraph `README.md` describing purpose, source, and usage
5. **Pre-ship check** (`/ship-widget`) — required before pasting into any CMS, see checklist below
6. Commit and push to `main`
7. GitHub Pages preview: `https://mhdesigns98.github.io/vpm-widgets/widgets/[name]/`

**If a `BRIEF.md` exists in the widget folder, read it before building** and flag requests that contradict or expand its scope.

VPM brand tokens and voice load automatically via the `vpm-design` skill — no need to invoke anything.

## Pre-Ship Checklist
**This checklist is canonical for widgets** — it's the list `/ship-widget` enforces. Don't restate it elsewhere; link here instead.

Page builds use `/ship-page` and a **different** checklist, in `~/Projects/vpm/vpm-pages/CLAUDE.md`.
The two are separate on purpose: several items below exist only because a widget can be dropped into
a hostile page more than once, which is not the situation a page build faces. Don't merge them.

Every widget must pass the CMS test harness (`/harness/harness.html?widget=[name]` — see `/harness/README.md`) before deploying:

- [ ] Survives delayed hydration + one detach/re-inject cycle (no double-init, listeners intact)
- [ ] No focus loss or overlap issues with the sticky Stream Player
- [ ] Styles fully scoped — unaffected by hostile host CSS (`!important` links, global heading sizes)
- [ ] CTAs clickable after the click-interceptor overlay clears
- [ ] Degrades gracefully in a 320px column
- [ ] Keyboard accessible, visible focus, WCAG 2.1 AA contrast, `prefers-reduced-motion` respected
- [ ] No `id` attributes, or none that duplicate when the block is placed twice on one page
- [ ] No console errors in the harness log

## Repo Consolidation
When asked to consolidate, audit existing repos and Gists, identify widget/embed code, and migrate it into the structure above. Archive source repos after migration.

## Widgets Index

See `INDEX.md` in the repo root — it lists every widget and its purpose. Read it when picking a
new slug or checking a namespace prefix for collisions. It lives outside this file so it isn't
loaded into context on every session.

Page builds are indexed separately in `~/Projects/vpm/vpm-pages/INDEX.md`. Check both when picking a
slug or namespace prefix — the two repos share one namespace convention, so a prefix collision across
them is still a collision.
