# VPM Widgets

The VPM web team's design system and CMS embed library. This repo is the **canonical source** for
VPM design tokens, the brand guide, and every reusable HTML/CSS/JS block we paste into
WordPress, Brightspot, or GTM.

## Start here

Pick the row that matches what you came for.

| I want to… | Go to |
|---|---|
| See VPM colors, type, and spacing | **[Brand guide (rendered)](https://mhdesigns98.github.io/vpm-widgets/brand-guide.html)** — swatches, type scale, copyable CSS blocks. No git required. |
| Look up an exact token value | [`tokens.css`](tokens.css) — the source of truth. [`BRAND_GUIDE.md`](BRAND_GUIDE.md) has the same values as tables plus a paste-ready `:root` block. |
| Find or reuse an existing widget | [`INDEX.md`](INDEX.md) — every widget, what it does, its namespace. Live previews at [mhdesigns98.github.io/vpm-widgets](https://mhdesigns98.github.io/vpm-widgets/). |
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

There isn't any. `.claude/skills/vpm-design/` is committed to this repo, so opening a Claude Code
session here loads VPM brand tokens, voice, and conventions automatically. Every path in that
skill is repo-relative, so it works on any machine that has the clone.

If you're building a **page** rather than a reusable block, that work lives in
[`vpm-pages`](https://github.com/mhdesigns98/vpm-pages) and follows that repo's `CLAUDE.md`.

## Structure

```
tokens.css        ← canonical design tokens (105 custom properties)
BRAND_GUIDE.md    ← brand reference: tables, conventions, paste-ready :root block
brand-guide.html  ← the same material rendered for visual review
INDEX.md          ← every widget, its purpose and namespace prefix
CLAUDE.md         ← conventions + canonical pre-ship checklist
CONTRIBUTING.md   ← how to build, and how to propose a token change
harness/          ← CMS test harness (simulates the hostile parts of Brightspot/WordPress)
tools/            ← paste-to-codepen helper
widgets/          ← the library
.claude/skills/   ← shared vpm-design skill for Claude Code
```

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

## Widgets

See **[`INDEX.md`](INDEX.md)** for the full list with descriptions and namespace prefixes. It's the
single list — check it before picking a new slug so prefixes don't collide.

## Adding a new widget

1. Read [`CONTRIBUTING.md`](CONTRIBUTING.md) and check `INDEX.md` for slug/prefix collisions
2. Create `widgets/[short-name]/` with `index.html` (or the ACF split files) and a `README.md`
3. Namespace all classes and ids (e.g. `vpm-pledge26-`)
4. Test in the harness and work the pre-ship checklist in [`CLAUDE.md`](CLAUDE.md) — required
   before it goes near a CMS
5. Add a row to `INDEX.md`
6. Open a PR. Pages preview: `https://mhdesigns98.github.io/vpm-widgets/widgets/[name]/`
