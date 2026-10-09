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
`tokens.css` in the repo root is the **canonical VPM design token file** (migrated from the deprecated vpm-component-library). Never link it externally, and never hard-code hex values.

For ACF split-file widgets, get tokens from the **base layer** rather than re-inlining them (see below). `base/tokens.css` is a paste-sized subset **derived** from `tokens.css` — change the canonical file and re-derive; never hand-edit a value in the subset. Single-file and Shadow DOM widgets still inline what they need.

## Base Layer (atoms → molecules → organisms)
`base/` holds the shared atoms — buttons, eyebrows, badges, media frames, cards, the accent bar, the focus ring, and the global `prefers-reduced-motion` block. It is pasted **once per page**, into the first Code Block's CSS field, in this order:

```
base/reset.css → base/tokens.css → base/atoms.css → that block's own css.css
```

Every later Code Block on the page pastes only its own `css.css`. Widgets opt in by putting `vpm-ui` on their root element alongside their namespace class. Full rules, the molecule snippets, and the list of widgets the layer deliberately can't reach: `base/README.md`.

- **A widget must not define its own** button, eyebrow, badge, focus ring, or reduced-motion block. Need a variant? Add a modifier to the atom in `base/atoms.css` — not a private class in the widget.
- **A widget's CSS may override an atom's colour, never its box model or motion.**
- **Atoms carry appearance only** — no layout, no positioning, no width. Placement stays in the widget's `css.css`.
- Every rule in `base/` starts with `.vpm-ui`. A rule that doesn't is a bug.

## Style Conventions
- All class names and IDs namespaced with a widget-specific prefix (e.g. `vpm-elec26-`, `vpm-mm-`) — except shared atoms from the base layer, which are deliberately global within `.vpm-ui`
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
**This checklist is canonical** — it's the list `/ship-widget` enforces. Don't restate it elsewhere; link here instead.

Every widget must pass the CMS test harness (`/harness/harness.html?widget=[name]` — see `/harness/README.md`) before deploying:

- [ ] Survives delayed hydration + one detach/re-inject cycle (no double-init, listeners intact)
- [ ] No focus loss or overlap issues with the sticky Stream Player
- [ ] Styles fully scoped — unaffected by hostile host CSS (`!important` links, global heading sizes)
- [ ] CTAs clickable after the click-interceptor overlay clears
- [ ] Degrades gracefully in a 320px column
- [ ] Keyboard accessible, visible focus, WCAG 2.1 AA contrast, `prefers-reduced-motion` respected
- [ ] No `id` attributes, or none that duplicate when the block is placed twice on one page
- [ ] No console errors in the harness log

For widgets on the base layer (`vpm-ui` on the root), additionally:

- [ ] Defines no button, eyebrow, badge, focus ring, or reduced-motion rules of its own
- [ ] **Base absent** — renders as readable, coherent content rather than collapsing (editors will forget the paste)
- [ ] **Base pasted twice** — visually identical to once
- [ ] Two instances on one page share a single base paste with no cross-contamination

The harness injects the base layer automatically when it sees `vpm-ui` in the widget's markup, and logs which files it pulled in.

## Repo Consolidation
When asked to consolidate, audit existing repos and Gists, identify widget/embed code, and migrate it into the structure above. Archive source repos after migration.

## Widgets Index

See `INDEX.md` in the repo root — it lists every widget and its purpose. Read it when picking a
new slug or checking a namespace prefix for collisions. It lives outside this file so it isn't
loaded into context on every session.
