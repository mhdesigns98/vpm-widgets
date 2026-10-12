# Newsletter Signup Embed

Mailchimp signup for VPM's single-audience newsletters: **Morning Monitor**, **Weekly Update** and
**Virginia Home Grown**, each in three layouts (Full-width, Inline, Sidebar). Merged on 2026-10-09
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
  layouts/<brand>.html ← that brand's three layouts; {{form:row|stack}}, {{privacy[:dark]}}, {{asset:file}}
build.mjs              ← node build.mjs
```

Generated (committed, never hand-edited):

| File | Purpose |
|---|---|
| `index.html` | Lab preview: every brand, every layout, live JS |
| `<brand>/preview.html` | One brand's preview; also the input to `hosted/signup-forms` |
| `<brand>/html.html` | ACF HTML field: three variants, delete the two you don't need |
| `<brand>/css.css` | ACF CSS field: core + that brand's theme, all scoped to `.vpm-nls` |
| `<brand>/js.js` | ACF JS field: identical for every brand |

After editing `src/`: `node build.mjs`, then `cd ../../hosted/signup-forms && npm run build` if the
iframe versions need redeploying.

**Adding a newsletter:** add an entry to `brands.json`, plus `themes/<slug>.css` and
`layouts/<slug>.html` (copy the closest brand). The form, status, privacy line and JS come for free.

## Scoping

Every layout is wrapped in `<div class="vpm-nls vpm-nls--mm">` (or `--wu`, `--vhg`), added by the
build, so any single variant can be pasted alone. Brand variables live on the brand class, not `:root`, so
two brands on one page can't overwrite each other. The reset is scoped to `.vpm-nls *`; never widen
it to a global selector, because the ACF CSS field loads site-wide.

## Narrow screens

The wrapper is a CSS size container, so layouts respond to the width of the column they're pasted
into, not the viewport. Below 600px the Full-width and Inline layouts stack (logo/panel above the
form); below 440px the email field and button stack. Desktop rendering is unchanged. Browsers
without container queries (pre-2023) get the old desktop layout.

## Changes from the three old widgets

- Rendering checked with a pixel diff of old vs new paste files: 8 of 9 layouts are identical.
- **Weekly Update sidebar:** the privacy line was near-black on navy (unreadable). It now uses the
  light privacy style the other dark layouts use.
- The CMS paste files now ship the in-page confirmation JS. Before, only the old `index.html`
  previews had it; pasted blocks always opened Mailchimp in a new tab.
- Full-width and Inline layouts no longer break on phones (the old ones squeezed the email field to
  a sliver and scrolled sideways at 375px).
- All email inputs have `aria-label="Email address"` (only Morning Monitor did before).

## Assets and legacy URLs

`assets/` here is the canonical copy. The old folders keep their `assets/` because live CMS blocks
and the Morning Monitor popup (`LOGO_URL`) load them by URL. See `INDEX.md`.

Known: `weekly-update-lockup.svg` (sidebar) is 1.7 MB. The full layout uses the 300 KB PNG of the
same lockup. Worth swapping or optimizing in a follow-up.
