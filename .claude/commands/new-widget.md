---
description: Create a widget in the Widget Lab — scaffold a new one, or file one already built in this conversation. Usage: /new-widget <name> | /new-widget --from <file.html> — creates the folder, single-file or ACF split-file structure, namespaced CSS prefix, inlined brand tokens, README stub, and Widgets Index entry.
effort: low
---

Create a widget in this repo following its conventions (read `CLAUDE.md` in the repo root first).

**First, confirm it's actually a widget.** A widget is used on more than one page; a page build is used on exactly one. If this will only ever appear on one URL, it belongs in the `vpm-pages` repo instead — that repo has its own `/new-page` command. The test is reuse, not size.

**This command is the single owner of widget naming, folder creation, and index registration.** Nothing else should re-derive that logic — `/save-component` is an alias that lands here.

The Widget Lab (this repo) is the only home for VPM components. The old `vpm-component-library` is deprecated and archived — never save there.

**Arguments:** $ARGUMENTS

---

## Step 0 — Pick the mode

**Import mode** if any of these hold:
- `$ARGUMENTS` contains `--from <path>`, or is a path to an existing file
- a component was built earlier in this conversation and isn't in the Lab yet
- the cwd holds an `index.html`, or a `preview.html` + `html.html`/`css.css`/`js.js` split set, that isn't already under `widgets/`

Otherwise **scaffold mode** — generate a stub from scratch.

The two modes differ in exactly one place: Step 4 either writes a stub or files the real files. Everything else is shared.

In import mode, read the source first. If `--from` named a file that doesn't exist, stop:
> No component file found. Usage: `/new-widget --from path/to/component.html`

---

## Step 1 — Gather setup info (one message)

Derive the widget name from `$ARGUMENTS` (in import mode, fall back to the source filename or a name from the markup; ask only if nothing usable). Then:

1. **Brief** — if a `BRIEF.md` exists for this idea, read it. Otherwise suggest running `/brief` first (don't block if declined).
2. **One-line purpose** — take it from the brief's Problem/Why if there is one; in import mode infer it from the markup; only ask if neither yields it.

Ask only what's still genuinely open.

## Step 2 — Derive the format (don't ask)

| Situation | Format |
|---|---|
| Brief says WordPress ACF | `acf-split` — `preview.html` + `html.html` + `css.css` + `js.js` |
| Brief says Brightspot / standalone page | `single` — self-contained `index.html` |
| **Import mode, no brief** | infer from the source shape: split file set → `acf-split`; single document → `single` |
| unknown / no brief | `single` |

State the assumption in one line rather than asking a full question. `/brief` already asked when a brief exists, so don't ask twice.

## Step 3 — Slug and namespace

- Slug: lowercase, hyphenated (e.g. `vpm-spring-drive-banner`).
- CSS namespace prefix: short, derived from the name (e.g. `vpm-sdb-`). Check it doesn't collide with an existing widget here, or with a page build in a sibling `vpm-pages` checkout if one exists on this machine — both repos share one namespace convention:
  ```bash
  grep -rl "PREFIX" widgets/ ../vpm-pages/pages/ 2>/dev/null
  ```
  and check `INDEX.md` in both repos if both are present locally. If `vpm-pages` isn't cloned alongside this repo, just check this repo's `INDEX.md` and note the cross-repo check wasn't possible.

In import mode, if the source's classes aren't namespaced, namespace them now — don't file un-namespaced markup and leave it for `/ship-widget` to catch.

## Step 4 — Create `widgets/SLUG/`

**Scaffold mode** — generate:

- **single**: `index.html` — complete standalone document with:
  - `<style>` block starting with a `:root` (or scoped) block of the brand custom properties copied from `tokens.css` in the repo root (only the tokens likely needed — colors, type, spacing)
  - a placeholder component shell using `.PREFIX` namespaced BEM classes
  - IIFE-wrapped `<script>` stub
  - `prefers-reduced-motion` media query stub
- **acf-split**: the four files following `widgets/vpm-banner/` conventions; `preview.html` composes the other three for browser preview.

**Import mode** — file the real source instead of a stub, with two cleanups:

- **Strip preview scaffolding** for `single` — grey page background, `.preview-wrap` container, and anything else that only existed to frame the component in a demo. The saved file must be a clean standalone document.
- **Split it** for `acf-split` if the source is one document — extract `<style>` → `css.css`, `<script>` → `js.js`, markup → `html.html`, and compose `preview.html` from the three.

Both modes also write:

- `README.md` — purpose line, deploy target, usage notes.
- `BRIEF.md` — copy/move it in if one exists.

Conventions checklist (from `CLAUDE.md` in the repo root), verified before committing: namespaced classes, IIFE-wrapped JS, no external dependencies, no `document.write()`, WCAG 2.1 AA, tokens inlined from `tokens.css`, no hard-coded hex.

## Step 5 — Register

Add a row for the widget to the table in `INDEX.md` (repo root), keeping the existing ordering.

Also add it to the `WIDGETS` array in `index.html` (repo root) so it shows in the gallery — slug, name, desc, `preview`, and one `files` entry per copyable file.

## Step 6 — Commit

```bash
git add widgets/SLUG INDEX.md index.html && git commit -m "Add SLUG widget"
```

Use "Scaffold SLUG widget" as the message in scaffold mode. Do not push unless asked, and don't push straight to `main` — open a PR (see `CONTRIBUTING.md`).

## Step 7 — Handoff (import mode, only if something is still open)

If open follow-ups remain, write them to `widgets/SLUG/HANDOFF.md` as a short checklist; otherwise skip. Merge rather than clobber if it already exists.

The usual tail: unpushed commit, `/ship-widget SLUG` not yet run, placeholder content still to swap, not yet pasted into the deploy target.

## Step 8 — Report

Scaffold mode:
> Scaffolded `widgets/SLUG/` (FORMAT). Namespace: `PREFIX`.
> Build away — then run `/ship-widget SLUG` before deploying to the CMS.

Import mode:
> Saved **NAME** → `widgets/SLUG/` (FORMAT) and registered it in `INDEX.md` and the gallery.
> Preview after push: `https://mhdesigns98.github.io/vpm-widgets/widgets/SLUG/`
> Run `/ship-widget SLUG` before deploying it into the CMS.

If a handoff was written, add:
> Open follow-ups saved to `widgets/SLUG/HANDOFF.md`.
