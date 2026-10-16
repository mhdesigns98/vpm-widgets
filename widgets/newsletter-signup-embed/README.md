# Newsletter Signup Embed

Mailchimp signup for VPM's single-audience newsletters: **Morning Monitor**, **Weekly Update** and
**Virginia Home Grown**, one responsive block per brand that fits any column, from a full-width
section to a sidebar. Merged on 2026-10-09
from `morning-monitor-signup`, `weekly-update-signup` and `virginia-home-grown-signup`, which were
the same form copied three times (nine files that had drifted apart).

Styled from the "VPM Newsletter Design & Strategy" Figma file (June 2026). Each brand keeps its
own look; only the plumbing is shared.

## How it works

Each form POSTs directly to Mailchimp's native embedded-form endpoint for its audience: no custom
API, no backend, no API key. `js.js` progressively enhances that with the endpoint's JSONP variant
(`/subscribe/post-json?…&c=callback`), so the result ("You're all set!…" or Mailchimp's own error)
shows in-page. With the JS field empty, or if Mailchimp returns something unusable, the native POST
still works and opens Mailchimp's response in a new tab.

The JS is one delegated `submit` listener per page, guarded by a window flag. It handles blocks the
CMS hydrates late or re-injects, several brands on one page, and the JS field pasted more than once.

This is not the combined multi-newsletter selector (`~/Projects/vpm/newsletter-signup`), which needs
its own Cloudflare API because one submission can fan out to several audiences.

## Editing: source vs generated

```
src/
  brands.json          ← per brand: Mailchimp u/id, name, Google Fonts family, legacy hosted slug
  core.css             ← reset, input, button, row/stack, privacy, status (all brands)
  core.js              ← JSONP submit (all brands)
  themes/<brand>.css   ← brand variables + that brand's layout styling
  layouts/<brand>.html ← that brand's one block; {{form}}, {{privacy[:dark]}}, {{asset:file}}
build.mjs              ← node build.mjs
```

Generated (committed, never hand-edited):

| File | Purpose |
|---|---|
| `index.html` | Lab preview: every brand, shown in 1000/680/480/320px columns, live JS |
| `<brand>/preview.html` | One brand's preview at the same widths |
| `<brand>/html.html` | ACF HTML field: the one block, paste as-is |
| `<brand>/css.css` | ACF CSS field: core + that brand's theme, all scoped to `.vpm-nls` |
| `<brand>/js.js` | ACF JS field: identical for every brand |

After editing `src/`: `node build.mjs`, then `cd ../../hosted/signup-forms && npm run build` if the
iframe versions need redeploying.

**Adding a newsletter:** add an entry to `brands.json`, plus `themes/<slug>.css` and
`layouts/<slug>.html` (copy the closest brand). The form, status, privacy line and JS come for free.

## Scoping

Each block is wrapped in `<div class="vpm-nls vpm-nls--mm">` (or `--wu`, `--vhg`), added by the
build. Brand variables live on the brand class, not `:root`, so
two brands on one page can't overwrite each other. The reset is scoped to `.vpm-nls *`; never widen
it to a global selector, because the ACF CSS field loads site-wide.

## One block, any width

There are no layout variants to pick. The wrapper is a CSS size container, so the block responds
to the width of the column it's pasted into, not the viewport:

| Column width | What it looks like |
|---|---|
| 800px+ | Wide card: brand panel beside the headline and form (the old Full-width) |
| 600–799px | Same card, compact padding and type (the old Inline size) |
| under 600px | Stacked: brand panel above the form (the sidebar and phone look) |

The email field and button share a line until the field would drop under 180px, then the button
wraps onto its own full-width line. That's flexbox wrapping, not a breakpoint, so it works in any
tier. Browsers without container queries (pre-2023) get the wide card.

**2026-10-15: Full-width, Inline and Sidebar merged into this one block.** Blocks already pasted on
vpm.org with the old variant markup (`vpm-nls__full`, `__inline`, `__sidebar`) keep working only
until their CSS field is re-pasted from this version, so re-paste the HTML and CSS fields together.
Content trimmed in the merge: Weekly Update's Inline eyebrow and Sidebar's SVG lockup (the PNG is
used everywhere now), and Morning Monitor's Sidebar no longer omits the headline.

## Changes from the three old widgets

- Rendering checked with a pixel diff of old vs new paste files: before the fixes below, 8 of 9
  layouts were identical; everything that differs now is one of the listed fixes.
- **Weekly Update sidebar:** the privacy line was near-black on navy (unreadable). It now uses the
  light privacy style the other dark layouts use.
- The CMS paste files now ship the in-page confirmation JS. Before, only the old `index.html`
  previews had it; pasted blocks always opened Mailchimp in a new tab.
- Full-width and Inline layouts no longer break on phones (the old ones squeezed the email field to
  a sliver and scrolled sideways at 375px).
- **Contrast:** the VHG headline emphasis was dark green on the green panel (2.7:1); it's now
  `--vpm-yellow-200` (3.7:1, large text). The grey privacy line (`#777`) failed AA on Morning
  Monitor's light blue (3.6:1) and on VHG's white (4.48:1); it's now `--vpm-gray-600` (4.8:1, 6.0:1).
- **Morning Monitor Inline:** the privacy line had picked up the dek's 14px bold dark-blue style;
  it's now the same small grey line as every other layout.
- All email inputs have `aria-label="Email address"` (only Morning Monitor did before).
- **/ship fixes (2026-10-16):** host `img` rules (border, padding) and host `em` font-size no
  longer reach the block; the input border is `--vpm-gray-500` (3.7:1, was 1.5:1); inputs and
  buttons get a 2px brand focus ring (`--nls-ring`); Weekly Update's button hover is
  `--vpm-blue-100` (10:1, was 3.9:1); VHG green nudged `#2E8B57` → `#2B8552` and its description
  is full white (4.5:1, was 3.9:1); transitions off under `prefers-reduced-motion`.

## Assets and legacy URLs

`assets/` here is the canonical copy. The old folders keep their `assets/` because live CMS blocks
and the Morning Monitor popup (`LOGO_URL`) load them by URL. See `INDEX.md`.

`weekly-update-lockup.svg` (1.7 MB) is no longer used by this widget; the block uses the 300 KB PNG.
It stays in `assets/` in case an older pasted Sidebar block still loads it.
