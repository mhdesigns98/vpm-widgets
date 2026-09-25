---
description: Pre-deploy check for a Widget Lab widget. Usage: /ship-widget [slug] — runs it inside the CMS test harness (delayed hydration, sticky player, z-index conflicts), does an accessibility pass, and outputs copy-paste-ready CMS blocks.
effort: high
---

Verify a widget is ready to paste into a real CMS. This exists because widgets that work in local preview have repeatedly broken inside Brightspot/WordPress (hydration timing, the persistent Stream Player stealing focus, click interception, z-index wars).

**Arguments:** $ARGUMENTS

---

## Step 1 — Locate the widget

`$ARGUMENTS` is a widget slug under `widgets/` in the repo root. If empty, infer from the current working directory; if ambiguous, list the widgets and ask.

If the slug is a full page build in the `vpm-pages` repo, that repo has its own `/ship-page` command — this harness simulates a block dropped into a hostile host page, which is not what a page build faces, so the two checklists are separate on purpose.

## Step 2 — Run it in the CMS harness

The harness is `harness/harness.html` in the repo root. It simulates the hostile parts of VPM's CMS environments. Load the widget into it:

```bash
python3 -m http.server 8471       # from the repo root
# open http://localhost:8471/harness/harness.html?widget=SLUG
```

If a browser-automation MCP is connected in this session (Playwright, `chrome-devtools`, or similar), drive it yourself — navigate to that URL, screenshot it, and evaluate JS in the page to inspect state. Do not describe checks for someone else to run by hand; run them and show what came back. Only fall back to asking the user to open the URL themselves if no browser MCP is available.

Check every harness scenario:

1. **Delayed hydration** — the harness injects the widget after a simulated 2.5s framework hydration delay and re-renders the container once. Does the widget survive being detached/re-attached? Does it double-initialize?
2. **Sticky Stream Player** — a fake persistent audio player is fixed at the bottom with high z-index and periodically grabs focus. Does the widget lose focus state, and does anything hide behind or overlap the player?
3. **Z-index conflicts** — the harness includes a sticky header (z-index 9000) and modal overlay layer. Do popups/dropdowns from the widget stack correctly?
4. **Click interception** — an invisible full-width analytics-style overlay div appears briefly on load. Are the widget's CTAs still clickable afterward?
5. **Narrow container** — the harness renders a second copy in a 320px sidebar column. Does it degrade gracefully?
6. **ACF injection mode** (acf-split only) — harness loads `html.html`/`css.css`/`js.js` as separate injected blocks the way WordPress ACF does, rather than one document.

Fix any failures before proceeding. Kill the server when done.

Every scenario above must be reported as pass/fail with the evidence that decided it (a screenshot, an evaluated expression and its value). A scenario you couldn't actually exercise is "not checked", not a pass.

## Step 3 — Accessibility pass

- Keyboard: every interactive element reachable and operable; visible focus states; no traps.
- Semantics: headings hierarchical, buttons are `<button>`, links are `<a href>`, images have alt text.
- Contrast: text meets WCAG 2.1 AA against its actual background (watch `--vpm-yellow` on white and `--vpm-grey` text).
- Motion: `prefers-reduced-motion` respected.
- Screen reader basics: aria labels on icon-only controls; live regions for dynamic content.

## Step 4 — Convention audit

- All classes/IDs carry the widget's namespace prefix
- IIFE-wrapped JS, no globals leaked, no `document.write()`
- No external dependencies; tokens inlined, no hard-coded hex
- Self-contained: works dropped into an arbitrary page

## Step 5 — Produce deploy blocks

Output the final copy-paste-ready code for the deploy target:
- **WordPress ACF**: three fenced blocks labeled HTML / CSS / JS matching the split files
- **Brightspot**: single embed block, with a note on whether it goes in a raw HTML module or Custom Head Elements

## Step 6 — Grow the harness

The harness only ever covers failures already met before. If a CMS failure mode came up this session that the harness doesn't simulate — something that broke in Brightspot or WordPress but passed locally — add a scenario for it:

1. Add the simulation to `harness/harness.html` in the repo root.
2. Add a matching line to the **Pre-Ship Checklist** in `CLAUDE.md`.
3. Note it in `harness/README.md`.

Skip this step if nothing new turned up — but say so, so it's clear it was considered rather than forgotten.

## Step 7 — Report

Summarize as a checklist (harness scenarios, a11y, conventions — pass/fail each), list anything fixed along the way, and end with the deploy blocks. If everything passes:

> ✅ `SLUG` is ship-ready. Commit any fixes, open a PR (see `CONTRIBUTING.md`) — the GitHub Pages preview updates once it's merged — then paste the blocks above into the CMS.
