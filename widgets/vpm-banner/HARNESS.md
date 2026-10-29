# Harness run — vpm-banner

**2026-10-29 · ACF mode (`html.html` / `css.css` / `js.js`) · 2 minor findings, nothing blocking**

Run from a cloud session. The `harness-runner` agent needs chrome-devtools MCP, which wasn't
available, so its procedure was followed with Playwright against
`http://localhost:8471/harness/harness.html?widget=vpm-banner`.

## Findings

1. **Doesn't stack in a narrow container.** Layout switches on viewport media queries, so in the
   320px sidebar slot on a desktop-width page the text, button and close stay in one row and the
   copy squeezes to ~70px wide (8 lines). Nothing clips. At a 320px *viewport* it stacks correctly.
   Only matters if the banner is ever placed in a narrow column; as a full-width site banner it won't be.
2. **Host letter-spacing bleeds in.** The harness's `.article-body * { letter-spacing: 0.01em }`
   reaches the main copy (computed 0.16px; the sidebar copy, outside `.article-body`, reads `normal`).
   Invisible at this value, but the banner doesn't reset `letter-spacing`, so heavier host tracking
   would show.

## Passed

- Delayed hydration and post-hydration re-render: both copies render; close button still works
  after re-render; no double init (`data-vpm-banner-ready` guard)
- No `id`s (safe to place twice); no external scripts
- Hostile `!important` link color does not reach the Donate button (stays dark on yellow)
- Every class is under the `vpm-banner` prefix
- Click-interceptor overlay blocks clicks for 3s, then CTAs recover
- Sticky Stream Player (z-index 2147483000) doesn't overlap the button or close
- Keyboard focus shows a 3px light-blue outline on both the button and close
- Console: no errors, warnings, or failed requests

## Not exercised

- The automatic 20s focus steal — triggered once manually instead. That confirms focus moves;
  returning focus is host behavior, not the widget's.
