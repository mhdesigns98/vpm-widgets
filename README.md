# VPM Widgets

The VPM web team's design system and CMS embed library. This repo is the **canonical source** for
VPM design tokens, the brand guide, and every reusable HTML/CSS/JS block we paste into
WordPress, Brightspot, or GTM.

It also holds **full page builds** for vpm.org, one folder per page under `pages/`. (Page builds used to live in a separate `vpm-pages` repo; it was merged in here with its history.)

> **A widget is used on more than one page. A page build is used on exactly one.**

The test is reuse, not size. A small block that only ever appears on one URL is a page build (`pages/`), but both live here and share one index.

**Prerequisites:** GitHub access to this repo, and Claude Code installed with an active seat if
you'll be building rather than just looking things up. Ask whoever handles your accounts if you
don't have either yet — this repo assumes both are already in place.

## Start here

Pick the row that matches what you came for.

| I want to… | Go to |
|---|---|
| See VPM colors, type, and spacing | **[Brand guide (rendered)](https://mhdesigns98.github.io/vpm-widgets/brand-guide.html)** — swatches, type scale, copyable CSS blocks. No git required. |
| Look up an exact token value | [`tokens.css`](tokens.css) — the source of truth for widgets and pages. [`BRAND_GUIDE.md`](BRAND_GUIDE.md) has the same values as tables plus a paste-ready `:root` block. |
| Find or reuse an existing widget | [`INDEX.md`](INDEX.md) — every widget and page build, what it does, where it's used, its namespace. Live previews at [mhdesigns98.github.io/vpm-widgets](https://mhdesigns98.github.io/vpm-widgets/). |
| Send someone a link to one widget or page | `https://mhdesigns98.github.io/vpm-widgets/share/?w=<widget>` or `?p=<page>`. Opens with a title, a plain-language summary, where it goes, and a wide/desktop/tablet/mobile toggle at true widths, so they don't have to find it in the gallery. Add `&note=…` for what you want from them. `/share` builds the link. |
| Build or change something | [`CONTRIBUTING.md`](CONTRIBUTING.md), then [`CLAUDE.md`](CLAUDE.md) for conventions and the pre-ship checklist. |
| Use Claude Code on VPM work | Just clone this repo and open a session in it. See below. |

**Two things to know before you build anything:**

1. **Widgets copy tokens, they don't link them.** Every widget must be self-contained enough to
   paste into a CMS field and work. Inline the custom properties you need; never `<link>`
   `tokens.css` from an embed. Details in [`CONTRIBUTING.md`](CONTRIBUTING.md).
2. **GT America is our real typeface and it isn't in this repo** (paid, Grilli Type). What ships
   is Public Sans + IBM Plex Sans Condensed as substitutes, with GT America listed first in the
   font stacks so it's used where installed.

## Claude Code setup

Clone, `cd` in, run `claude`. `.claude/skills/vpm-design/` and `.claude/commands/` are both
committed to this repo, so VPM brand tokens and the build/ship slash commands load automatically
— no separate install beyond Claude Code itself. See
[**"Using Claude Code on this repo"** in `CONTRIBUTING.md`](CONTRIBUTING.md#using-claude-code-on-this-repo)
for install steps, what each command does, and a first-widget walkthrough.

Page builds use `/new-page` and `/ship-page`, which have their own checklist in `CLAUDE.md`.

## Structure

```
tokens.css        ← canonical design tokens (105 custom properties)
BRAND_GUIDE.md    ← brand reference: tables, conventions, paste-ready :root block
brand-guide.html  ← the same material rendered for visual review
INDEX.md          ← every widget and page, its purpose, where it's used, namespace prefix
CLAUDE.md         ← conventions + canonical pre-ship checklist
CONTRIBUTING.md   ← how to build, and how to propose a token change
harness/          ← CMS test harness (simulates the hostile parts of Brightspot/WordPress)
tools/            ← paste-to-codepen helper
widgets/          ← reusable blocks (used on more than one page)
pages/            ← full page builds (used on exactly one URL)
.claude/skills/   ← shared vpm-design skill for Claude Code
```

A page folder (`pages/[slug]/`) takes one of three shapes: single-file (`index.html`), ACF
split-file, or `sections/` plus `PASTE-ORDER.md`. See `CLAUDE.md`.

Each widget uses one of two layouts:

```
widgets/[widget-name]/
    index.html     ← self-contained embed or combined preview
    README.md      ← description, usage, source
```

Widgets built for WordPress ACF use a split-file format instead, one file per ACF field:

```
widgets/[widget-name]/
    preview.html   ← full browser preview
    html.html      ← paste into ACF HTML field
    css.css        ← paste into ACF CSS field
    js.js          ← paste into ACF JS field
```

All class names and ids are namespaced with a widget-specific prefix to avoid colliding with the
host page.

## Widgets and pages

See **[`INDEX.md`](INDEX.md)** for the full list with descriptions, where each is used, and namespace prefixes. It's the
single list — check it before picking a new slug so prefixes don't collide.

## Adding a new widget

1. Confirm it's actually a widget — if it will only ever appear on one page, build it under
   `pages/` with `/new-page` instead
2. Read [`CONTRIBUTING.md`](CONTRIBUTING.md) and check `INDEX.md` for slug/prefix collisions
3. `/new-widget [short-name]` — scaffolds `widgets/[short-name]/` with tokens inlined, or create
   `index.html` (or the ACF split files) and a `README.md` by hand
4. Namespace all classes and ids (e.g. `vpm-pledge26-`)
5. `/ship-widget [name]` — runs the harness and the pre-ship checklist in [`CLAUDE.md`](CLAUDE.md);
   required before it goes near a CMS
6. Add a row to [`INDEX.md`](INDEX.md) (`/new-widget` does this for you)
7. Open a PR. Pages preview: `https://mhdesigns98.github.io/vpm-widgets/widgets/[name]/`
