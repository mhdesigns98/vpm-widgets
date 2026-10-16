# Pre-Ship Checklist

**This is the one canonical checklist** — `/ship` enforces it (`/ship-widget` and `/ship-page` are
aliases for the same command). Don't restate it elsewhere; link here instead.

`/ship <slug>` looks the slug up (`widgets/` or `pages/`), runs **Core** for everything, then
**Widget** or **Page** depending on what it is. The two extra lists are separate on purpose: the
Widget items exist because a block can be dropped into a hostile page more than once and re-injected;
the Page items exist because a page owns its URL. Don't move items between them to make something pass.

## Core (widgets and pages)

- [ ] Every selector namespaced; no bare element selectors in a page-level `<style>`. Unaffected by
      ordinary hostile host CSS (non-`!important` rules on `a`, `h1`–`h6`, `ul`/`li`, `p`, `div`,
      `span`, `img`: hosts such as `.article-body img` add borders and padding to logos). Host `!important` element rules can't be beaten by a class selector, so the exception is
      a **link**: a CTA must hold its color and underline against a host `a { … !important }` rule
      (use `!important` on the link's color and text-decoration only)
- [ ] Decorative separators and inline `em`/`span` set their own `font-size`, and inner wrapper `div`s reset `margin`/`padding`, so ordinary host rules on those elements don't move them
- [ ] No focus loss or overlap with the sticky Stream Player; nothing important in the bottom ~90px. Fails are a focus trap or content hidden behind the player; the player grabbing focus is the simulation, not a defect
- [ ] Degrades gracefully at 320px: no horizontal scroll, no clipped text, tap targets ≥44px
- [ ] Keyboard accessible (DOM order matches visual order, including absolutely positioned controls such
      as a close button; no traps), visible focus, WCAG 2.1 AA contrast in every state including hover
      and focus (focus outlines need 3:1 against the colors next to them), `prefers-reduced-motion` respected
- [ ] Semantics: images have real `alt` (or `alt=""` if decorative), iframes have `title`, headings
      don't skip levels. Don't require an `<h1>`: a block pasted into a CMS page sits under that
      page's own title
- [ ] No hard-coded hex (values inlined from the root `tokens.css`, never a second token file);
      `px` not `rem` for font-size and spacing
- [ ] No console errors (ignore the dev server's `favicon.ico` 404, the Quirks Mode notice a
      doctype-less fragment always gets, and warnings from third-party embeds such as the PBS player)
- [ ] Dated content is current: no past event dates, "TBD" live URLs, or expired deadlines

## Widget only (run in the CMS harness: `/harness/harness.html?widget=[name]`, see `/harness/README.md`)

- [ ] Survives delayed hydration + one detach/re-inject cycle (no double-init, listeners intact)
- [ ] CTAs clickable after the click-interceptor overlay clears
- [ ] No `id` attributes, or none that duplicate when the block is placed twice on one page
- [ ] Widget scopes itself to its own container (e.g. `document.currentScript.previousElementSibling`), not a page-wide selector — two copies on one page must initialize independently, not just avoid literal duplicate ids
- [ ] Any third-party script (vendor embed, resizer, player SDK) loads **once per page** — guarded with a `querySelector` check, not a bare `<script src>` that re-appends on every re-render
- [ ] A single-file widget's CSS uses absolute URLs (not relative `url(...)`) for any local asset — a relative path resolves against whichever document the browser thinks it's in, which breaks for an iframe-embedded widget the moment its markup gets tested by injection (as this harness does) rather than by a real iframe

## Page only (the harness is deliberately not used)

- [ ] Every jump link resolves to an anchor that exists, including anchors supplied by a widget
      pasted below the page markup; click each one and confirm it lands
- [ ] Paste order documented (`README.md`, or `PASTE-ORDER.md` for `sections`) and matches what was
      rendered; verified against the live page when there is one
- [ ] Each consumed widget's copy matches the current `widgets/` source (report drift, don't sync it)

Not on the Page list, because they're block-in-CMS artifacts: duplicate-`id` collisions from placing
a block twice, detach/re-inject double-init, and click-interceptor overlay timing. If a page build
ever faces one, add it to the Page list with a note explaining why. `scroll-margin-top` is also not
required: vpm.org's header isn't sticky and the theme's `pjax.js` ignores `#` links (see
`~/Projects/research/vpm-theme-anchor-links.md`). Older page READMEs still prescribe it; it's harmless.

