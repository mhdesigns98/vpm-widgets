---
description: Scaffold a new full page build in pages/. Usage: /new-page <name> — creates the folder, picks the single-file / ACF-split / sections shape, namespaced CSS prefix, inlined brand tokens, README stub, and `INDEX.md` entry.
effort: low
---

Scaffold a new page build in this repo following its conventions (read `CLAUDE.md` in the repo root first).

`tokens.css` in the repo root is canonical. Read it; don't substitute remembered token values.

**This command is the single owner of page naming, folder creation, and index registration.** It is the page-side sibling of `/new-widget` — keep the two symmetrical, but don't merge them.

**Arguments:** $ARGUMENTS

---

## Step 0 — Confirm this is a page, not a widget

> **A widget is used on more than one page. A page build is used on exactly one.**

If the thing will appear on more than one URL, stop — it belongs in the `vpm-widgets` repo, which has its own `/new-widget` command. The test is **reuse, not size**: a small block that only ever lives on one page is still a page build.

If it's ambiguous, ask. Getting this wrong means a migration later.

## Step 1 — Gather setup info (one message)

Derive the page name from `$ARGUMENTS` (ask if empty). Then:

1. **Brief** — if a `BRIEF.md` exists for this idea, read it. Otherwise suggest running `/brief` first (don't block if declined).
2. **One-line purpose** — take it from the brief's Problem/Why if there is one; only ask if there isn't.
3. **Live URL** — the vpm.org path this page will live at, if known. Goes in the README.

Ask only what's still genuinely open after reading the brief.

## Step 2 — Pick the shape

Unlike `/new-widget`, this **does** need asking when the brief doesn't settle it, because the shape follows from how the page gets pasted into the CMS — and that's an editorial-workflow fact, not something derivable from the design:

| How the page is pasted | Shape |
|---|---|
| One Code Block / HtmlModule, whole page | `single` — self-contained `index.html` |
| CSS and JS in separate ACF fields | `acf-split` — `preview.html` + `html.html` + `css.css` + `js.js` |
| Several blocks placed separately in the editor | `sections` — `sections/*.html` + `PASTE-ORDER.md` |

If the brief names the deploy target, infer from it and say what you assumed. If genuinely unknown, use `single` and say so.

## Step 3 — Slug and namespace

- Slug: lowercase, hyphenated (e.g. `elections-2026-general`).
- CSS namespace prefix: short, derived from the name (e.g. `vpm-elec26g-`). Check it doesn't collide with any widget or page:
  ```bash
  grep -rl "PREFIX" pages/ widgets/
  ```
  and check `INDEX.md`.

## Step 4 — Scaffold

Create `pages/SLUG/` with:

- **single**: `index.html` — complete standalone document with:
  - `<style>` block starting with a `:root` (or scoped) block of the brand custom properties copied from `tokens.css` (only the tokens likely needed — colors, type, spacing). **There is exactly one `tokens.css` (the repo root). Never create another.**
  - placeholder section shells using `.PREFIX` namespaced BEM classes
  - IIFE-wrapped `<script>` stub
  - `prefers-reduced-motion` media query stub
- **acf-split**: the four files following `pages/elections-2026-primary/` conventions; `preview.html` composes the other three for browser preview.
- **sections**: one `sections/NN-name.html` per block, plus `PASTE-ORDER.md`. Follow `pages/voter-guide-2026/` as the reference implementation. `PASTE-ORDER.md` is **not optional** for this shape — the order isn't recoverable from filenames.
- `README.md` — purpose line, live URL, paste order, and a `Uses widget:` section (leave it with a comment if empty).
- If a brief exists, copy/move it to `pages/SLUG/BRIEF.md`.

Conventions checklist (from `CLAUDE.md` in the repo root): namespaced classes, no external dependencies, no `document.write()`, WCAG 2.1 AA, no hard-coded hex — tokens only, and prefer `px` over `rem` for font-size and spacing since `rem` resolves against a host root that WordPress and Brightspot set differently.

## Step 5 — Register

Add a row for the page to the table in `INDEX.md` (repo root), as `pages/SLUG/` with Shape `page, <single-file|split-file|sections>`, Used on `one URL` (the live URL, once known), keeping the existing ordering (widgets first, then pages, alphabetical).

Also add it to the `PAGES` array in `index.html` (repo root) so it shows in the gallery — slug, name, desc, `preview`, and one `files` entry per copyable file.

## Step 6 — Commit and report

```bash
git add pages/SLUG INDEX.md index.html && git commit -m "Scaffold SLUG page"
```

Report:
> Scaffolded `pages/SLUG/` (SHAPE). Namespace: `PREFIX`.
> Build away — then run `/ship-page SLUG` before pasting into the CMS.

Don't push unless the user asks. This repo is public: before committing, check what you're adding against the public-repo rules in `CLAUDE.md`.
