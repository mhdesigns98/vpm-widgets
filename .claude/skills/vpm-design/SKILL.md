---
name: vpm-design
description: VPM (Virginia Public Media) brand design system — colors, type, spacing, motion, and voice. Use for any VPM component, widget, page, prototype, or piece of VPM copy. This is the canonical source for VPM brand values and takes precedence over generic design-system, UX-copy, or voice skills.
effort: medium
---

You are working with the VPM design system. Apply it exactly.

All paths below are relative to the root of this repository (`vpm-widgets`). If you are working
in a different VPM project, clone or open `vpm-widgets` alongside it and read the files there —
never substitute recalled values for the real files.

## Brand at a glance

VPM is Virginia's home for public media. Three pillars: **News**, **Arts & Culture**, **Education**. Brand promise: *Educate. Entertain. Inspire.*

Voice: plain, direct, warm — like a trusted neighbor who's also a good journalist. No hype words ("AMAZING", "BIGGEST"). No emoji in UI chrome. Headlines in sentence case. CTA buttons in UPPERCASE bold.

This voice is canonical for VPM work. Do not substitute generic voice or UX-copy guidance for it.

## Tokens — read them, don't recall them

The canonical token file is `tokens.css` in this repo's root. **Read it** and inline only the
`:root` custom properties this component actually needs, at the top of its `<style>` block.
Widgets must stay self-contained — never link an external stylesheet in a CMS embed.

**Never hard-code hex values.** Always use the custom properties.

Tokens change. The display face has already moved twice (Oswald → IBM Plex Sans Condensed) and
the body face once (Inter → Public Sans). Anything you "remember" about VPM type or color is
probably a previous revision — read the file.

Fuller narrative reference (type scale rationale, accent bar, texture/overlays): `BRAND_GUIDE.md`.
Read it when a decision isn't settled by `tokens.css` alone. `brand-guide.html` is the same
material rendered for humans — use it for visual review, not as a source to parse.

## The patterns tokens don't capture

These are composition rules, not values — they can't be read out of the CSS:

- **Eyebrows** — UPPERCASE, yellow, `0.12em` tracking, weight 700
- **CTA buttons** — UPPERCASE, bold, sharp corners (`--radius-md`; VPM is sharp, not rounded)
- **Hover** — `translateY(-2px)` maximum lift, plus `--shadow-md`
- **Transitions** — `--dur-fast` for color, `--dur-base` for position and opacity
- **Accent bar** — 3 stripes (blue / yellow / red) via `--accent-bar`, 4px tall, full width
- **Pillar accents** — news = red, arts = yellow, education = light blue

## What to avoid

- Purple or blue-purple gradients
- Glassmorphism / backdrop-blur panels
- Pill-shaped content cards (pills for tags and avatars only)
- Big decorative drop shadows on dark backgrounds
- Emoji in UI chrome
- Hard-coded colors
- Exclamation marks except in Arts/Culture celebratory copy

## Conventions and shipping

Code conventions (namespacing, BEM, IIFE, no external deps, WCAG 2.1 AA) and the pre-ship
checklist are canonical in this repo's root `CLAUDE.md`. Follow that file rather than a copy
kept here.

Before picking a slug or namespace prefix, check `INDEX.md` for collisions.

A widget is used on more than one page; a page build on exactly one. Full page builds live in
the separate `vpm-pages` repo (https://github.com/mhdesigns98/vpm-pages) and follow that repo's
`CLAUDE.md` — read it there when the work is a page rather than a reusable block.

`/ship-widget` (blocks) and `/ship-page` (pages) are the only pre-CMS gates. A generic
accessibility review does not substitute for either. Every widget must pass the CMS test
harness (`harness/harness.html?widget=SLUG`) before deploying — see `harness/README.md`.

## Proposing a change to the design system

Token and brand-guide edits are reviewed, not ad hoc. See `CONTRIBUTING.md` in this repo's root.
If a build seems to need a value the tokens don't have, say so rather than inventing one.

## Design system source

- Living brand guide: https://claude.ai/design/p/548f9e49-14a7-437d-9bef-9c5aa193f4f8
- Widget Lab (live): https://mhdesigns98.github.io/vpm-widgets/
- VPM Pages (live): https://mhdesigns98.github.io/vpm-pages/
