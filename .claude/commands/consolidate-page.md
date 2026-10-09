---
description: Pull a live vpm.org page apart and rebuild it as one page build. Usage: /consolidate-page <url> — extracts the ACF sections, inventories the content, rebuilds it namespaced and scoped under pages/, and flags the migration-era defects it finds.
effort: high
---

Take a **live** VPM page that was assembled from many CMS sections and rebuild it as one page build
in this repo.

**Arguments:** $ARGUMENTS — a page URL. If empty, ask for one.

---

## When this is the right command

| Situation | Command |
|---|---|
| Live page built from many stacked sections, want one paste | **this one** |
| New page from scratch | `/new-page` |
| Finished build, checking before CMS | `/ship-page` |

This command **ends by handing off to `/ship-page`**. It does not duplicate that checklist — don't
inline the checks here, and don't declare the page shippable yourself.

Read `CLAUDE.md` in the repo root first. Its **host theme** section carries the measured
`wpp-base` facts this command depends on; if it and this file ever disagree, that file wins.

## Step 1 — Extract, don't browse

`curl` the page to a scratchpad file. Do not read it through a browser or a fetch-to-markdown tool —
you need the raw HTML, and markdown conversion destroys exactly the inline styles and class names
this job is about.

```bash
curl -sL -o page.html "$URL"
```

Then, in a Python script rather than by eye:

- Slice `<main>` … `</main>`.
- Split on `(?=<section )`. Do **not** try to regex-match nested `<div>`s — the section wrappers are
  flat and the inner content is not.
- For each section, record the wrapper classes (`page-rich-text`, `width-wide`, `bg-white`, …) and
  the inner HTML.

Print a numbered inventory with a text snippet per section before writing anything. That inventory
becomes the provenance table in the README, and it is how you prove nothing was dropped.

## Step 2 — Measure the live page

**This step is not optional and its results override any assumption in your plan.** Open the live
URL in a real browser with whatever browser-automation MCP this session has (Playwright,
`chrome-devtools`, or similar), evaluate JS in the page, and read *computed* values. If no browser
MCP is available, stop and say so. This step can't be skipped or estimated:

- `getComputedStyle(document.documentElement).fontSize` — the root.
- Computed `font-size` on a representative element for each distinct inline `rem` value in the
  source.
- Whether anything is `position: fixed` or `sticky`, scrolled to the bottom of the page.

Old VPM markup was authored against a 10px root; `wpp-base` uses 16px. `1.6rem` renders at 25.6px,
not 16px. Convert from what you measured, never from what was declared.

## Step 3 — Decide the target shape, and where typography comes from

Pick the shape from `CLAUDE.md` by how the result will actually be pasted. For a consolidation this
is nearly always **acf-split** (a Code Block with HTML and CSS fields).

Then answer one question explicitly: **what supplies the type scale?**

- Source sections were **Rich Text** → the theme supplied 17px body / 30px h2 / 24px h3 / Oswald.
- Target is a **Code Block** → the theme supplies *nothing*. Your CSS must reproduce that scale or
  the page visibly changes.

Getting this backwards is the single most likely way to ship a page that looks wrong.

## Step 4 — Rebuild

- One namespace, `vpm-<slug>-`, BEM within it, everything under a single scope wrapper.
- **Keep `font-size` off element-level defaults.** `.vpm-foo h2` is 0-2-0 and silently outranks
  `.vpm-foo-thing__title` at 0-1-0. Write every size rule as `.vpm-foo .vpm-foo-thing__x`. Same trap
  for `.vpm-foo img { max-width }`.
- Inline the tokens the page needs from `tokens.css` in the repo root. Every hex must
  trace back to that file — put the token name in a comment next to it.
- `px`, not `rem`, for font-size and spacing.
- Lift inline styles into the stylesheet. Repair what you find: stray `</p>`, unclosed tags, unitless
  attribute violations (`width="600px"`), `<br style="clear:both">` float hacks (use `flow-root`).
- Third-party iframes get `loading="lazy"` and a real `title`.
- Generate `preview.html` from the field files with a small committed build script, so the preview
  can never drift from what gets pasted. Simulate the host chrome in it (16px root, `.container`,
  the hero) and label that chrome as not part of the paste.

## Step 5 — Verify scoping against the real theme

Load the **actual** host stylesheets over your block and diff computed styles before and after:

```
base, components, overrides, page-builder, archive, player
  from /wp-content/themes/wpp-base/assets/css/<name>.css
```

Zero deltas inside the namespace is the pass condition. Do **not** substitute a synthetic
`p { font-size: 32px !important }` injection — no page in this repo survives that, and `wpp-base`
declares no `!important` on bare element selectors, so it tests nothing real.

Also audit `document.styleSheets` and assert no selector matches outside the namespace.

## Step 6 — Report the defects you found

A consolidation almost always surfaces problems that are live right now. Sort them:

- **Structural** — un-namespaced globals, malformed markup, missing lazy-loading. Fix silently, note
  in the README.
- **Visible or content-removing** — a broken type scale, a dead link, a section that would disappear.
  **Stop and ask**, with the measured numbers in hand. Reproducing a bug faithfully and fixing it
  silently are both wrong defaults.
- **Unfixable here** — 404ing assets, host-dependent paths. Keep the content, and put them in the
  README under a heading that reads as blocking, not as a footnote.

## Step 7 — Register and hand off

- `README.md` — purpose, live URL, source page id, file table, paste order, a **provenance table**
  mapping every source section to where it landed, what changed and why, and the blocking items.
- Add the row to `INDEX.md`.
- Check what you're committing against the public-repo rules in `CLAUDE.md`.
- Then tell the user to run `/ship-page <slug>`. Don't run it silently as part of this command — it
  is a separate gate and should read as one.
