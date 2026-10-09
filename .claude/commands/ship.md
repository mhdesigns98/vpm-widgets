---
description: Pre-deploy check for any widget or page build. Usage: /ship [slug] — finds whether it's under widgets/ or pages/, runs the shared checks, then the CMS harness (widgets) or the anchor/paste-order checks (pages), and outputs copy-paste-ready CMS blocks.
effort: high
---

Verify a build is ready to paste into a real CMS. **This is the only pre-CMS gate** for widgets and pages; a generic accessibility review does not substitute for it. The checklist is canonical in `CLAUDE.md` ("Pre-Ship Checklist": Core, Widget only, Page only). Read it first. This file says how to run it, and `CLAUDE.md` wins if they diverge.

**Arguments:** $ARGUMENTS

`/ship-widget` and `/ship-page` are aliases: they run this command and fail if the slug is the other kind.

---

## Step 1 — Locate it and read it

`$ARGUMENTS` is a slug. Look for `widgets/SLUG/`, then `pages/SLUG/`. Both exist → ask which. Neither → list close matches from `INDEX.md`. Empty → infer from the working directory, else ask.

- `widgets/SLUG/` → **widget mode**. `pages/SLUG/` → **page mode**. Say which, in one line.
- Read every file in the folder, plus `README.md` and `BRIEF.md` if present. If a `BRIEF.md` exists, check the build against it and flag scope drift first: a build that passes everything but doesn't do what the brief agreed isn't shippable.
- Note the shape: widget = `single` / `acf-split`; page = `single` / `acf-split` / `sections`. It decides what Step 6 emits. **`html.html` present = `acf-split`**, even if an `index.html` preview sits beside it (the harness's default mode also prefers the split files).

## Step 2 — Serve it

Pick a free port (don't reuse a fixed one; other sessions run servers) and serve the repo root:

```bash
PORT=$(python3 -c 'import socket; s=socket.socket(); s.bind(("",0)); print(s.getsockname()[1])')
python3 -m http.server $PORT &    # from the repo root
SERVER_PID=$!                     # kill $SERVER_PID when done (the shell may not persist, so also note the port)
```

Drive a real browser with whichever automation MCP is connected (`chrome-devtools`, Playwright). Open your own page and don't touch other tabs; the browser is often shared with other sessions. Run the checks, don't describe them for someone else. If no browser MCP is available, say so and mark every browser-dependent item **unverified**.

Preview URL: widgets `http://localhost:$PORT/harness/harness.html?widget=SLUG` (Step 4); pages `http://localhost:$PORT/pages/SLUG/` (`preview.html` for `acf-split`; for `sections`, the folder's `PASTE-ORDER.md` lists the sections, so load each section file).

## Step 3 — Core checks (both modes)

Run the **Core** list from `CLAUDE.md`. How:

- **Desktop and 320px screenshots.** Chrome's window won't shrink below ~500px, so get 320px by loading the page in a 320px-wide iframe. A widget's harness already has a 320px sidebar copy; check that too. Measure tap targets at 320px.
- **Scoping.** Inject ordinary hostile host CSS (non-`!important`) on every element type the build uses: `a{color:red}`, `h1,h2,h3,h4,h5,h6{font-size:48px}`, `ul{padding-left:60px}`, `li{margin:20px}`, `p{margin:30px;font-size:30px}`, `div{padding:20px;margin:20px}`, `span,em{font-size:30px}`, `button{padding:30px;background:red}`. Compare box sizes and fonts before and after; nothing may move. Separately, inject `a{color:red!important;text-decoration:underline!important}` and confirm each CTA/text link keeps its designed color and decoration.
- **Keyboard.** Compare DOM order against visual order directly (this is what catches an absolutely positioned close button), then Tab through and confirm visible focus. Start Tab from the element just before the build, since the harness has many focusables. If the tool can't send real key presses, use programmatic focus, check `:focus-visible` and the outline, and mark real key handling **unverified**.
- **Console.** Read it. Ignore `favicon.ico` 404, the Quirks Mode notice a doctype-less fragment always gets, and warnings from third-party embeds (PBS/video player, ads); any other error fails.
- **Contrast** in every state (hover, focus), watching `--vpm-yellow` on white and `--vpm-light-blue` text on white. Focus outlines are measured against the colors next to them (3:1). **Dated content**: past dates, "TBD" live URL, expired deadlines.
- **Tokens / px.** Hex only inside scoped custom-property definitions; no `rem` in font-size or spacing.

## Step 4 — Widget mode: CMS harness

Open the harness URL and check every scenario, reporting pass/fail with the evidence that decided it (a screenshot or description, an evaluated expression and its value). The toolbar has "Simulate re-render", "Steal focus" and "Overlay 3s" buttons; close the Log panel before hit-testing the sidebar copy (it can cover the CTA and fake a click-interception failure). For widgets with both split files and `index.html`, default mode loads the split files; also run `?mode=single` once:

1. **Delayed hydration** — the harness injects the widget after a simulated 2.5s hydration delay and re-renders the container once. Does it survive detach/re-attach? Does it double-initialize?
2. **Sticky Stream Player** — a fake persistent player is fixed at the bottom with high z-index and periodically grabs focus. The harness steals focus on purpose, so that alone isn't a failure. Fail it for a focus trap, or content hidden behind the player.
3. **Z-index conflicts** — sticky header (z-index 9000) and modal overlay layer. Do popups/dropdowns stack correctly? (n/a if the widget has none; say so.)
4. **Click interception** — an invisible analytics-style overlay appears briefly on load. Are the CTAs clickable after it clears?
5. **Narrow container** — a second copy renders in a 320px sidebar column.
6. **ACF injection mode** (`acf-split` only) — `html.html`/`css.css`/`js.js` injected as separate blocks.

Then the Widget-only items: no ids (or none that duplicate), each copy initializes independently (close one, the other stays), third-party scripts load once, absolute URLs for local assets. A scenario you couldn't exercise is "not checked", not a pass.

## Step 5 — Page mode: anchors, order, consumed widgets

No harness (a page exists once, on one URL; don't add a pages mode to it).

- **Jump links.** For every in-page link, the target `id` exists, including anchors the page supplies for a widget pasted below it. Click each and confirm it lands.
- **Paste order** is documented and matches what you rendered (and the live page, if there is one).
- **Consumed widgets.** For each `Uses widget:` line in the README, diff the page's copy against `widgets/[slug]/`. Many pages only carry a CSS copy (e.g. `unwined-page.css`); diff what exists and say that markup wasn't diffable. Report drift; don't sync it.
- **Testing anchors.** A page's `preview.html` has no widget below it, so build a composite in the scratchpad: the page block, then any anchor wrappers the README tells the editor to add, then the consumed widget's block, with the page CSS. Run the jump-link and 320px checks on that.

## Step 6 — Report, then emit

List every item (Core, then Widget-only or Page-only) as **pass / fail / unverified**, failures first with a concrete fix. Attach or describe screenshots (the screenshot tools reject paths outside the workspace). "n/a" counts as pass only when the build genuinely has nothing of that kind (no jump links, no consumed widgets). **Any fail → stop; don't emit blocks for a build that isn't ready.**

On a clean pass, emit the deploy blocks:

- **single** — one fenced block, the whole `index.html` (Brightspot: note whether it goes in a raw HTML module or Custom Head Elements).
- **acf-split** — one fenced block per ACF field, labeled `HTML` / `CSS` / `JS`. A page that consumes a widget has a block set per source (the page, the anchor wrappers, then the widget): label each and number them in the README's paste order. If the README states no explicit order, that's a Page-only **fail** (paste order undocumented), not something to infer.
- **sections** (pages) — one block per section **in `PASTE-ORDER.md` order**, each labeled with where it goes; then any anchor-wrapper markup the editor must add by hand, and the live URL from the README.

End with: `SLUG is ship-ready. Commit any fixes, open a PR, then paste the blocks into the CMS.`

## Step 7 — Grow the checks

If a failure turned up that no item caught, add it to the right list in `CLAUDE.md` (Core only if it applies to both kinds; a block-in-CMS failure goes under Widget, with a harness scenario in `harness/harness.html` and a note in `harness/README.md`). If nothing new turned up, say so, so it's clear it was considered.
