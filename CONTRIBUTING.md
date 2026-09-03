# Contributing

This repo is the canonical source for VPM's design tokens, brand guide, and reusable CMS embeds.
Internal to the VPM web team.

## The one rule that surprises everyone

**Widgets do not link `tokens.css`. They copy the custom properties they need into their own
scoped `<style>` block.**

Every widget here gets pasted into a CMS field (WordPress ACF, Brightspot HTML embed, or a GTM
tag). There is no build step and no guarantee an external stylesheet will load or survive. So a
widget must work as a single self-contained drop-in.

That means `tokens.css` is a **source you read from**, not a dependency you ship. Copy the
`:root` variables the component actually uses to the top of its style block. Do not paste all
105 tokens, and do not hard-code hex values — use the variables so a token change is a
find-and-replace, not an archaeology project.

`BRAND_GUIDE.md` has a paste-ready `:root` starter block under "CSS Token Template".

## Working on a widget

1. Read `CLAUDE.md` in the repo root — conventions and the pre-ship checklist are canonical there.
2. Check `INDEX.md` before picking a folder slug or namespace prefix, so they don't collide.
3. Namespace every class and id with a widget-specific prefix (`vpm-elec26-`, `vpm-mm-`). The
   host CMS page is hostile: global heading styles, `!important` link rules, a sticky stream
   player, delayed hydration, and click-interceptor overlays are all real things that have
   broken widgets in production.
4. Build under `widgets/[slug]/` in either layout — single-file `index.html`, or the ACF
   split-file set (`preview.html`, `html.html`, `css.css`, `js.js`). See `README.md`.
5. Write a `README.md` for the widget: purpose, source, usage, and any config values to change
   per deployment.
6. **Test it in the harness before it goes anywhere near a CMS:**
   ```bash
   python3 -m http.server 8471       # from the repo root
   # open http://localhost:8471/harness/harness.html?widget=SLUG
   ```
   The harness simulates the parts of Brightspot and WordPress that break widgets. Work the
   full pre-ship checklist in `CLAUDE.md`.
7. Add a row to `INDEX.md` and to the table in `README.md`.
8. Open a PR. Pages preview: `https://mhdesigns98.github.io/vpm-widgets/widgets/[slug]/`

## Changing a token or the brand guide

Tokens are shared by every widget, every page in `vpm-pages`, and the AI context in
`.claude/skills/vpm-design/`. A change here propagates everywhere, so:

- **Open a PR, never push to `main`.** Say what's changing, why, and who asked for it.
- **Tag the change in the file.** `tokens.css` records provenance inline — see the type-stack
  comment noting the Oswald → IBM Plex Sans Condensed move, and the Inter → Public Sans body
  change with the person and date. Keep that habit; it's how we know whether a value is current
  or leftover.
- **Update all three surfaces together** or the drift starts immediately:
  - `tokens.css` — the values
  - `BRAND_GUIDE.md` — the tables and the paste-ready `:root` block
  - `brand-guide.html` — the rendered swatches
- **Don't add a token to solve one widget's problem.** If only one component needs it, scope it
  to that component. Tokens are for things used in more than one place.
- **Semantic over raw.** Prefer `--fg-muted` to `--vpm-gray-600` in component code. Add a
  semantic token if the right one doesn't exist.
- **Existing widgets are not auto-migrated.** They carry inlined copies of the old value. A
  token change is not done until you've decided whether to sweep `widgets/` too, and said so
  in the PR.

## Typefaces — read this before you touch type

VPM's primary brand typeface is **GT America** (Grilli Type, paid). It is **not** in this repo
and must not be committed here.

What ships instead:

| Role | Substitute | Real face |
|---|---|---|
| Body / UI | Public Sans (Google) | GT America |
| Display / condensed | IBM Plex Sans Condensed (Google) | GT America Condensed |

`tokens.css` lists the real faces first in each stack, so a machine or CMS theme with GT America
installed picks it up automatically and everyone else falls back cleanly. Keep that ordering.

One gotcha: **IBM Plex Sans Condensed has no 800 weight.** Cap display type at 700. A `font-weight:
800` on a display element silently synthesizes a fake bold.

## Accessibility is not optional

WCAG 2.1 AA, keyboard operable, visible focus, `prefers-reduced-motion` respected. It's in the
pre-ship checklist and the harness surfaces most of it. Public media has a broader audience than
most sites — assume assistive tech is in use.

## Voice

Plain, direct, warm. No hype words, no emoji in UI chrome, headlines in sentence case, CTA
buttons in UPPERCASE bold. Exclamation marks only in Arts & Culture celebratory copy. See
`BRAND_GUIDE.md`.

## Using Claude Code on this repo

`.claude/skills/vpm-design/` is committed, so cloning this repo is all the setup there is — the
brand system loads automatically in a Claude Code session opened here. It points at
`tokens.css`, `BRAND_GUIDE.md`, `CLAUDE.md` and `INDEX.md` by repo-relative path, so it stays
correct on anyone's machine.

If you edit that skill, you're editing shared AI context for the whole team. Same PR rules as
tokens.
