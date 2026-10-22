# 2026 Elections — Strip

Short, image-free promo strip for VPM News' 2026 election coverage, made to sit directly
under the vpm.org homepage menu bar. One dark-blue row: 3-stripe accent bar, eyebrow, one
line of copy and the same light-blue CTA as `elections-2026-cta`, linking to
`vpm.org/elections`. It's the compact sibling of that widget. Keep the two in step when the
copy changes.

Current copy: general election, Tuesday, Nov. 3, 2026; polls close at 7 p.m.

## Files

| File | Purpose |
|---|---|
| `preview.html` | Browser preview under a stand-in menu bar, plus a 320px column |
| `html.html` | Paste into ACF HTML field |
| `css.css` | Paste into ACF CSS field |

No JS, and no close button: a dismissible version would need JS plus remembering the
dismissal. Add one only if it's asked for.

## Height

Measured in WebKit: **72px** at 640px and wider (one row), **102px** at 414px, **125px**
at 320–375px (text above the button). Under the 150px ceiling at every width.

## Layout

- Container query on the strip's own width. Below 640px the text stacks above the button.
  From 640px it's one row. The yellow "2026 General Election" eyebrow only shows from
  900px; below that the date in the copy carries it.
- The inner row is capped at 1200px and centered. The dark-blue background runs full width.
- `<aside aria-label="VPM News election coverage">` so screen readers can find or skip it.

## Customizing

- **Copy:** eyebrow, lead (bold, white) and sub (muted) are spans in `html.html`. Keep it
  day-agnostic: name the date, not "today."
- **CTA target:** `href` on `.vpm-elec26strip__link`.
- **Max width:** `max-width` on `.vpm-elec26strip__inner`, to line up with the homepage grid.
