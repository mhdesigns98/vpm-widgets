# Widget Lab

## Purpose
This project is for building standalone HTML/CSS/JS embeds and web components for VPM and personal use. It holds two kinds of build in one GitHub repo (https://github.com/mhdesigns98/vpm-widgets): **widgets** (reusable blocks, `widgets/`) and **page builds** (full pages for vpm.org, `pages/`). Page builds used to live in a separate `vpm-pages` repo, merged in here with its history.

## ⚠️ This repo is PUBLIC

Everything committed here is world-readable and indexable. That's a deliberate choice — the page
markup ships to vpm.org anyway, so it isn't secret — but page folders accumulate *internal*
documentation in a way widget folders never did, and that's the thing to watch.

**Before committing, check what you're adding.** Reviewed and accepted as of 2026-08-06:

- `voter-guide-2026/DEV-REQUEST.md` — an unsent draft to the `wpp-base` theme vendor, including
  internal deadlines
- `voter-guide-2026/AUDIT.md` — QA findings, including one unfixed contrast failure
- The staging host `vpmnews.kinsta.cloud` and dev page id `466103`, in several files
- `voter-guide-2026/.vercel/project.json` — `orgId` / `projectId`

Those are known and judged acceptable. **Do not add worse.** Specifically, never commit:

- API keys, tokens, or credentials of any kind — including in a `reference/` example. Use
  `YOUR_KEY`-style placeholders, as `reference/wordpress-php-template/inc/voter-guide-data.php`
  already does for the AP elections API.
- Embargoed editorial content, unpublished results, or anything under a publication date
- Named individuals' contact details, or verbatim internal email threads
- Anything a `/brief` or `/ship` run produced that reads as criticism of a colleague or vendor

If a page genuinely needs sensitive material to be useful, keep that file outside the repo and
reference it by path from the page `README.md` — don't commit it and don't paraphrase it.


## Widget or page?

> **A widget is used on more than one page. A page build is used on exactly one.**
> If it only ever appears on one URL, it's a page build (`pages/`), even if it is block-shaped.

Both live in this repo and share one `INDEX.md` with a **Used on** column. The test is **reuse, not
size**: `elections-2026-primary` was a small ACF split-file block and is a page build, because it only
ever appeared on the primary page. Its sibling `elections-2026-primary-cta` is a widget, because it's
a homepage CTA reused across placements. Which kind it is decides only which checklist runs
(`/ship` picks it from the slug).

If you're about to build the second copy of a page build's block for another page, that's the signal
to promote it to `widgets/` and have both pages consume a copy.

## Repo Structure (widgets)
```
/widgets
  /[widget-name]
    index.html       ← self-contained embed or combined preview
    README.md        ← description, source, usage notes
```

Some widgets (e.g. `vpm-banner`) use a split-file format for WordPress ACF:

```
/widgets/[widget-name]
    preview.html     ← full browser preview
    html.html        ← ACF HTML field
    css.css          ← ACF CSS field
    js.js            ← ACF JS field
```

## Design Tokens
`tokens.css` in the repo root is the **canonical VPM design token file** for widgets and pages (migrated from the deprecated vpm-component-library). There is deliberately only one — two token files would drift, and the drift would stay invisible until two pages disagreed about VPM blue. Widgets and pages must stay self-contained, so copy the custom properties you need into the widget's scoped `<style>` — never link the file externally. No hard-coded hex values.

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
3. When satisfied, add it under `/widgets/[name]/` following the structure above (`/new-widget --from file.html` does this; `/save-component` is an alias)
4. Write a one-paragraph `README.md` describing purpose, source, and usage
5. **Pre-ship check** (`/ship`) — required before pasting into any CMS, see checklist below
6. Add a row to `INDEX.md`, then open a PR — this repo is shared and public, don't push to `main`
7. GitHub Pages preview: `https://mhdesigns98.github.io/vpm-widgets/widgets/[name]/`
   — to send it to someone, use the share link instead (`/share [name]`): `https://mhdesigns98.github.io/vpm-widgets/share/?w=[name]`

**If a `BRIEF.md` exists in the widget folder, read it before building** and flag requests that contradict or expand its scope.

VPM brand tokens and voice load automatically via the `vpm-design` skill, which is committed to
this repo at `.claude/skills/vpm-design/` — cloning the repo is the whole setup, no need to
invoke anything.

## Pre-Ship Checklist

**This is the one canonical checklist** — `/ship` enforces it (`/ship-widget` and `/ship-page` are
aliases for the same command). Don't restate it elsewhere; link here instead.

`/ship <slug>` looks the slug up (`widgets/` or `pages/`), runs **Core** for everything, then
**Widget** or **Page** depending on what it is. The two extra lists are separate on purpose: the
Widget items exist because a block can be dropped into a hostile page more than once and re-injected;
the Page items exist because a page owns its URL. Don't move items between them to make something pass.

### Core (widgets and pages)

- [ ] Every selector namespaced; no bare element selectors in a page-level `<style>`. Unaffected by
      ordinary hostile host CSS (non-`!important` rules on `a`, `h1`–`h6`, `ul`/`li`, `p`, `div`,
      `span`). Host `!important` element rules can't be beaten by a class selector, so the exception is
      a **link**: a CTA must hold its color and underline against a host `a { … !important }` rule
      (use `!important` on the link's color and text-decoration only)
- [ ] No focus loss or overlap with the sticky Stream Player; nothing important in the bottom ~90px
- [ ] Degrades gracefully at 320px: no horizontal scroll, no clipped text, tap targets ≥44px
- [ ] Keyboard accessible (real Tab order matches visual order, no traps), visible focus, WCAG 2.1 AA
      contrast in every state including hover and focus, `prefers-reduced-motion` respected
- [ ] Semantics: images have real `alt` (or `alt=""` if decorative), iframes have `title`, headings
      don't skip levels. Don't require an `<h1>`: a block pasted into a CMS page sits under that
      page's own title
- [ ] No hard-coded hex (values inlined from the root `tokens.css`, never a second token file);
      `px` not `rem` for font-size and spacing
- [ ] No console errors (ignore the dev server's `favicon.ico` 404 and the Quirks Mode notice a
      doctype-less fragment always gets)
- [ ] Dated content is current: no past event dates, "TBD" live URLs, or expired deadlines

### Widget only (run in the CMS harness: `/harness/harness.html?widget=[name]`, see `/harness/README.md`)

- [ ] Survives delayed hydration + one detach/re-inject cycle (no double-init, listeners intact)
- [ ] CTAs clickable after the click-interceptor overlay clears
- [ ] No `id` attributes, or none that duplicate when the block is placed twice on one page
- [ ] Widget scopes itself to its own container (e.g. `document.currentScript.previousElementSibling`), not a page-wide selector — two copies on one page must initialize independently, not just avoid literal duplicate ids
- [ ] Any third-party script (vendor embed, resizer, player SDK) loads **once per page** — guarded with a `querySelector` check, not a bare `<script src>` that re-appends on every re-render
- [ ] A single-file widget's CSS uses absolute URLs (not relative `url(...)`) for any local asset — a relative path resolves against whichever document the browser thinks it's in, which breaks for an iframe-embedded widget the moment its markup gets tested by injection (as this harness does) rather than by a real iframe

### Page only (the harness is deliberately not used)

- [ ] Every jump link resolves to an anchor that exists, including anchors supplied by a widget
      pasted below the page markup; click each one and confirm it lands
- [ ] Paste order documented (`README.md`, or `PASTE-ORDER.md` for `sections`) and matches what was
      rendered; verified against the live page when there is one
- [ ] Each consumed widget's copy matches the current `widgets/` source (report drift, don't sync it)

Not on the Page list, because they're block-in-CMS artifacts: duplicate-`id` collisions from placing
a block twice, detach/re-inject double-init, and click-interceptor overlay timing. If a page build
ever faces one, add it to the Page list with a note explaining why. `scroll-margin-top` is also not
required: vpm.org's header isn't sticky and the theme's `pjax.js` ignores `#` links (see
`~/Projects/research/vpm-theme-anchor-links.md`).

## Repo Consolidation
When asked to consolidate, audit existing repos and Gists, identify widget/embed code, and migrate it into the structure above. Archive source repos after migration.

## Page Builds

Full page builds live under `pages/`, one folder per page. Everything above about tokens, namespacing,
and coding conventions applies. What differs is below.

### Structure

```
/pages
  /[page-slug]
    README.md      ← purpose, live URL, "Uses widget:" lines, paste order
    index.html     ← single-file: self-contained page, pasted whole into a Code Block
```

or, for pages built against WordPress ACF fields:

```
/pages
  /[page-slug]
    README.md
    preview.html   ← full browser preview
    html.html      ← ACF HTML field
    css.css        ← ACF CSS field
    js.js          ← ACF JS field (omit if the page has no JS)
```

or, for pages pasted in as several separate blocks:

```
/pages
  /[page-slug]
    README.md
    PASTE-ORDER.md ← which section goes where, in order
    /sections
      [section].html
```

**Pick the shape that matches how the page is actually pasted into the CMS**, not the one that looks
tidiest. A page that goes in as one Code Block is single-file. A page whose CSS and JS live in
separate ACF fields is split-file. A page assembled from several blocks in the editor uses
`sections/` — and then `PASTE-ORDER.md` is not optional, because the order is not recoverable from
the filenames. `voter-guide-2026` is the reference implementation of that pattern.

Do not convert an existing page from one shape to another as a side errand. If the CMS placement
didn't change, the shape shouldn't either.

### Consuming widgets

Pages hold their **own copy** of any widget markup they include. There is no build step, no package,
and no symlink between a page and a widget — that constraint is what keeps both sides paste-safe for the CMS.

When a page includes a widget, record it in the page's `README.md`:

```
Uses widget: links-with-map
```

That line is the only thing making the dependency findable later, so it isn't optional. When a
widget changes in `vpm-widgets`, grep this repo for its name to find the pages carrying a now-stale
copy.

Live example: `unwined-episode` sits directly above the `links-with-map` widget on the same URL, and
supplies the page-level anchor targets its jump links point at.

On vpm.org, the theme's `pjax.js` ignores `#` links and the header isn't sticky, so jump links
need no scroll offset. See `~/Projects/research/vpm-theme-anchor-links.md`.

### Page conventions

- Class names namespaced with a page-specific prefix (e.g. `vpm-impact25-`, `vpm-vg26-`)
- Prefer `px` over `rem` for font-size and spacing in CMS-pasted markup — `rem` resolves against the
  host document root, which WordPress and Brightspot each set differently (see the note at the top of
  `pages/basics-virginia/index.html`). This applies to widgets pasted into the same CMS too.
- Page workflow: `/brief` → `/new-page` → build → `/ship` → PR. Page folders hold a `README.md`
  covering purpose, live URL, paste order, and any `Uses widget:` lines. `/consolidate-page <url>`
  rebuilds an existing live page as one build.
- GitHub Pages preview: `https://mhdesigns98.github.io/vpm-widgets/pages/[slug]/`

### Page Pre-Ship Checklist

See **Pre-Ship Checklist** above (Core + Page only). `/ship <slug>` runs it.

## Index

See `INDEX.md` in the repo root — it lists every widget and page build, where each is used, and its
purpose. Read it when picking a new slug or checking a namespace prefix for collisions. It lives
outside this file so it isn't loaded into context on every session.
