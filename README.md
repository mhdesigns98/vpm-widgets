# VPM Widgets

Reusable standalone HTML/CSS/JS blocks and web components for VPM News. All widgets live under
`/widgets/`.

**Looking for a full page build?** Those live in the sibling repo,
[vpm-pages](https://github.com/mhdesigns98/vpm-pages).

> **A widget is used on more than one page. A page build is used on exactly one.**

The test is reuse, not size. A small block that only ever appears on one URL belongs in `vpm-pages`.

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

See [`INDEX.md`](INDEX.md) for the full table with descriptions.

## Brand Guide

VPM color, typography, voice, and component conventions live in two places:

- **Visual:** [`brand-guide.html`](brand-guide.html) — rendered swatches, type scale, pattern examples, and copyable CSS variable blocks
- **Reference:** [`BRAND_GUIDE.md`](BRAND_GUIDE.md) — Markdown tables of all tokens, a paste-ready `:root` CSS block, and the full conventions checklist

`tokens.css` here is canonical **for both this repo and `vpm-pages`**. There is deliberately no copy
in `vpm-pages`.

Use `BRAND_GUIDE.md` as context when prompting Claude to build a new widget.

## Adding a new widget

1. Confirm it's actually a widget — if it will only ever appear on one page, use `/new-page` instead
2. `/new-widget [short-name]` — scaffolds `/widgets/[short-name]/` with tokens inlined
3. Add `index.html` (or ACF split files) and `README.md`
4. Namespace all classes and IDs (e.g. `vpm-pledge26-`)
5. Add a row to [`INDEX.md`](INDEX.md)
6. `/ship-widget [name]` before pasting into any CMS
7. Commit and push — GitHub Pages preview at `https://mhdesigns98.github.io/vpm-widgets/widgets/[name]/`
