# The Basics Virginia™

Full campaign page for The Basics Virginia™ — five stacked sections, not a single droppable block:

1. **Hero** — "The Basics Virginia™" heading beside a Vimeo video
2. **The 5 Basics Principles** — five-card grid (Maximize Love, Manage Stress · Talk, Sing, Point ·
   Count, Group, Compare · Explore Through Movement and Play · Read and Discuss Stories)
3. **The Basics in Action** — video plus supporting copy
4. **The Basics Virginia™ Movement** — copy plus video
5. **Explore The Basics Principles in Nature!** — centered title, image, button

Built as Shadow DOM custom elements (`HTMLElement` subclasses), so each section's styles are
isolated from the host page rather than relying on class-prefix scoping alone.

## Format

Single file — `index.html`. No `js.js` / `css.css` split; everything is inline.

## Namespace

`basics-` (`.basics-hero`, `.basics-principles`, `.basics-action`, `.basics-movement`,
`.basics-trail`).

Note this departs from the `vpm-` prefix the rest of the Lab uses. It predates that convention and
is left as-is because the class names are referenced from the live page; don't rename them casually.
Shadow DOM is doing the real isolation work here, so the prefix matters less than it would in a
light-DOM widget.

## Customization points

- **Videos** — Vimeo player IDs `917233041`, `1042940007`, `430395770`; a Spanish-language version
  links out to `vimeo.com/1072295866`
- **Principle icons and the nature-trail image** — hosted on `assets.vpm.org`
- **Outbound link** — `thebasicsvirginia.org`
- **Copy** — headings and principle labels are inline in the markup

## Gotchas

- **Off-repo assets.** Icons, images, and all video come from `assets.vpm.org` and Vimeo. The page
  renders as a broken skeleton with no network, so don't judge layout from an offline load.
- **Shadow DOM hides it from host CSS in both directions.** Useful for resisting hostile CMS
  styles, but it also means brand-token overrides from the host won't reach inside. Tokens must be
  inlined per component.
- **Five sections is a page, not a block.** Placing it inside an existing article template will
  usually double up on headings and hero treatments.

## Pre-ship status

Not yet run through `/ship-widget`. Because this is Shadow DOM plus five sections of embedded
video, the harness checks that matter most are the sticky-player z-index and the 320px column.
