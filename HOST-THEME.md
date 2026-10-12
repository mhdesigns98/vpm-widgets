# WordPress host theme (`wpp-base`)

Facts about the live theme, measured 2026-08-07 against `wpp-base` 1.3.91 on
`vpmnews.kinsta.cloud`. They change what a page build has to supply, so check them before
inventing a type scale or a defensive stylesheet. Measured on one page build
(`racism-challenging-perceptions`, on an unmerged branch); re-measure if the theme version changed.

- **Root font-size is 16px.** Any `rem` in inherited or pasted markup resolves against that. Older
  VPM markup was authored against a **10px** root, so `1.6rem` renders at 25.6px, not 16px — a
  silent ~60% inflation. **Measure the computed `font-size` on the live page before converting
  anything.** Do not infer intent from the number alone.
- **A Code Block inherits no typography.** `.page-code-block-content` styles the section's
  *description* field, not the HTML you paste. A pasted block must own its own type scale.
  A Rich Text section is the opposite — `.page-rich-text-inner` supplies 17px body / 30px h2 /
  24px h3 / Oswald headings. Match that scale when converting a Rich Text section to a Code Block,
  or the page will visibly change.
- **Widths:** `.container` is `max-width: 1240px; padding: 0 20px`. Rich Text width variants are
  narrow 720 / medium 900 / **wide 1100** / full 100%. A Code Block replacing a `width-wide`
  section should set its own `max-width: 1100px`.
- **The Stream Player is `position: relative`, not fixed.** It scrolls away with the header. There
  is no pinned bottom bar on this theme to collide with. The Stream Player item in
  `SHIP-CHECKLIST.md` predates the wpp-base migration. Re-verify before assuming either way; don't remove the item on one page's
  evidence.
- **The theme declares no `!important` on bare element selectors.** Every `!important` in
  `base/components/overrides/page-builder.css` is scoped to a theme component class
  (`.hero-grid`, `.page-team`, …) and cannot reach inside a namespaced block. This is why no page in
  this repo needs defensive `!important` — and why a synthetic `p { font-size: 32px !important }`
  test is the wrong check for this host.

### CSS specificity trap in scoped blocks

Inside a `.vpm-foo` wrapper, an element-level default like `.vpm-foo h2 { font-size: 30px }` is
**0-2-0** and silently outranks the BEM rule `.vpm-foo-season__title { font-size: 34px }` at
**0-1-0**. The BEM rule never applies and nothing errors.

Keep element-level defaults free of any property a modifier will want to set — give them font-family,
color and margin, but no `font-size` — and write every size rule as `.vpm-foo .vpm-foo-thing__x` so
all of them share one specificity and source order decides. The same trap bites
`.vpm-foo img { max-width: 100% }` against a single-class image rule.

