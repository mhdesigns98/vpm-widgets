# CMS Test Harness

Simulates the hostile parts of VPM's real CMS environments (Brightspot, WordPress) so widgets get broken here instead of in production. Born from the Morning Monitor popup's post-deploy bugs: hydration timing, the persistent Stream Player stealing focus, and click interception.

## Usage

```bash
cd ~/Projects/vpm-widgets
python3 -m http.server 8471
# open http://localhost:8471/harness/harness.html?widget=SLUG
```

Query params:
- `widget=SLUG` — folder name under `/widgets/`
- `mode=single|acf|auto` (default `auto`) — `acf` loads `html.html`/`css.css`/`js.js` as separate injected blocks the way WordPress ACF does; `single` parses `index.html`; `auto` tries ACF first, falls back to single.

## What it throws at your widget

1. **Delayed hydration** — injected 2.5s after page load, then detached and re-injected 3s later (watch for double-init and dead listeners)
2. **Sticky Stream Player** — fixed bottom bar at z-index 2147483000 that steals focus every 20s
3. **Hostile host CSS** — `!important` link colors, oversized headings, global letter-spacing (tests style scoping)
4. **Click interception** — invisible full-viewport overlay for the first 3s (CTAs must recover)
5. **Narrow container** — second copy rendered in a 320px sidebar
6. **JS error surfacing** — widget errors appear in the on-screen log

Toolbar buttons let you re-run any scenario manually. Run `/ship-widget SLUG` in Claude Code for the full guided pre-deploy check.
