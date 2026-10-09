---
description: Pre-deploy check for a page build under pages/. Usage: /ship-page [slug] — verifies scoping against hostile host CSS, jump-link anchors, paste order, consumed-widget freshness, and accessibility, then outputs copy-paste-ready CMS blocks.
effort: high
---

Pre-deploy check for a full page build in this repo. **This is the only pre-CMS gate for pages.** A generic accessibility review does not substitute for it.

**Arguments:** $ARGUMENTS

---

## Scope — and why this isn't `/ship-widget`

`$ARGUMENTS` is a page slug under `pages/` in the repo root. If empty, infer from the current working directory; if ambiguous, list the pages and ask.

If the slug is actually a widget, it lives in the `vpm-widgets` repo, which has its own `/ship-widget` command. Use that instead.

The widget harness in `vpm-widgets` (`harness/harness.html`) is **deliberately not used here**. It simulates a *block dropped into a hostile host page* — double placement, detach/re-inject, click-interceptor overlays. A page build faces none of those: it exists once, on one URL, and isn't re-injected. Don't reach for it, and don't add a pages mode to it.

The canonical page checklist is in `CLAUDE.md` in the repo root. Read it — the list below implements it, and that file wins if they ever diverge.

## Step 1 — Read the page

Read every file in `pages/SLUG/`, plus its `README.md` and `BRIEF.md` if present. If a `BRIEF.md` exists, check the build against it and flag scope drift before checking anything else — a page that passes every item below but doesn't do what the brief agreed is not shippable.

Note the shape (`single` / `acf-split` / `sections`) — it determines what Step 5 outputs.

## Step 2 — Render and inspect

Serve the repo and load the page in a real browser with whatever browser-automation MCP this session has
(Playwright, `chrome-devtools`, or similar). If none is available, say so and mark every
browser-dependent item below as unverified. If this repo has a `.claude/launch.json` entry, `preview_start` serves it directly — otherwise
start a static server yourself:

```bash
python3 -m http.server 8472 &    # from the repo root
```

Load `http://localhost:8472/pages/SLUG/` (or `/preview.html` for split-file shapes). Then:

- Screenshot at desktop width and at **320px**. Both go in the report.
- Read the console. Any error fails the check.
- Tab through the whole page: every interactive element reachable, focus always visible, order matches visual order.

Do not report a pass on any item you didn't actually observe in the browser. An unverified item is reported as unverified.

## Step 3 — The checklist

- [ ] **Scoping** — every selector namespaced. No bare element selectors (`img`, `h2`, `a`) in a page-level `<style>`; they leak into site chrome. Test by injecting hostile host CSS (`a { color: red !important }`, `h2 { font-size: 48px }`) and confirming the page is unmoved.
- [ ] **Jump-link anchors resolve** — for every in-page link, the target `id` exists. Check anchors the page is expected to *supply for a widget pasted below it* too; those live in the page, not the block, and are the most common breakage. Click each one and confirm it lands.
- [ ] **`scroll-margin-top`** on jump targets, so the sticky site header doesn't cover the heading.
- [ ] **Paste order documented** — `README.md` (or `PASTE-ORDER.md` for `sections`) states the order, and it matches what you just rendered.
- [ ] **Consumed widgets current** — for each `Uses widget:` line in the README, diff the page's copy against `widgets/[slug]/`. Report any drift; don't silently sync it.
- [ ] **Sticky Stream Player** — no focus loss, no overlap, nothing important under the bottom ~90px.
- [ ] **320px** — no horizontal scroll, no clipped text, tap targets ≥44px.
- [ ] **Accessibility** — WCAG 2.1 AA contrast, images have real `alt` (or `alt=""` if decorative), iframes have `title`, one `<h1>`, heading levels don't skip, `prefers-reduced-motion` respected.
- [ ] **No console errors.**
- [ ] **Tokens** — no hard-coded hex; values inlined from the root `tokens.css`. No second `tokens.css` created.
- [ ] **`px` not `rem`** for font-size and spacing, since `rem` resolves against a host root WordPress and Brightspot set differently.

## Step 4 — Report

List each item as pass / fail / unverified, with the failures first and a concrete fix for each. Attach both screenshots. If anything fails, stop here — don't emit paste blocks for a page that isn't ready.

## Step 5 — Emit CMS blocks

Only after a clean pass. Output depends on shape:

- **single** — one fenced block: the whole `index.html`, ready for one Code Block / HtmlModule.
- **acf-split** — one fenced block per ACF field, labeled `HTML` / `CSS` / `JS`.
- **sections** — one fenced block per section, **in `PASTE-ORDER.md` order**, each labeled with where it goes.

Follow with any anchor-wrapper markup the page needs the editor to add by hand, and the live URL from the README.

## Adding a new check

If a page breaks in a way this list didn't catch, add the item to the **Pre-Ship Checklist** in `CLAUDE.md` and mirror it here. If the failure was actually a block-in-CMS problem rather than a page problem, it belongs in the widget checklist instead — note why in the commit.
