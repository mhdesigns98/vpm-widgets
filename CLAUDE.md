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

Read the file rather than recalling values — the display face and body face have both been
changed since the tokens were written. Proposing a *change* to a token is a reviewed process:
see `CONTRIBUTING.md`.

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
6. Add a row to `INDEX.md`, then open a PR — this repo is shared, don't push to `main`
7. GitHub Pages preview: `https://mhdesigns98.github.io/vpm-widgets/widgets/[name]/`

**If a `BRIEF.md` exists in the widget folder, read it before building** and flag requests that contradict or expand its scope.

VPM brand tokens and voice load automatically via the `vpm-design` skill, which is committed to
this repo at `.claude/skills/vpm-design/` — cloning the repo is the whole setup, no need to
invoke anything.

## Pre-Ship Checklist
**This checklist is canonical** — it's the list `/ship-widget` enforces. Don't restate it elsewhere; link here instead.

Every widget must pass the CMS test harness (`/harness/harness.html?widget=[name]` — see `/harness/README.md`) before deploying:

- [ ] Survives delayed hydration + one detach/re-inject cycle (no double-init, listeners intact)
- [ ] No focus loss or overlap issues with the sticky Stream Player
- [ ] Styles fully scoped — unaffected by hostile host CSS (`!important` links, global heading sizes)
- [ ] CTAs clickable after the click-interceptor overlay clears
- [ ] Degrades gracefully in a 320px column
- [ ] Keyboard accessible, visible focus, WCAG 2.1 AA contrast, `prefers-reduced-motion` respected
- [ ] No `id` attributes, or none that duplicate when the block is placed twice on one page
- [ ] Widget scopes itself to its own container (e.g. `document.currentScript.previousElementSibling`), not a page-wide selector — two copies on one page must initialize independently, not just avoid literal duplicate ids
- [ ] Any third-party script (vendor embed, resizer, player SDK) loads **once per page** — guarded with a `querySelector` check, not a bare `<script src>` that re-appends on every re-render
- [ ] No console errors in the harness log
- [ ] A single-file widget's CSS uses absolute URLs (not relative `url(...)`) for any local asset — a relative path resolves against whichever document the browser thinks it's in, which breaks for an iframe-embedded widget the moment its markup gets tested by injection (as this harness does) rather than by a real iframe

## Repo Consolidation
When asked to consolidate, audit existing repos and Gists, identify widget/embed code, and migrate it into the structure above. Archive source repos after migration.

## Widgets Index

See `INDEX.md` in the repo root — it lists every widget and its purpose. Read it when picking a
new slug or checking a namespace prefix for collisions. It lives outside this file so it isn't
loaded into context on every session.
