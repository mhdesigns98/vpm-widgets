# Neighborhood History — Brief
*Written: 2026-09-29*

## Problem / Why
The page tells a strong story — the building's history from 1886 to VPM's 2026 move — but the
story is hidden in lightbox captions, the lead headline fails contrast, and section backgrounds
and spacing don't line up. Rebuild the content sections so the history is readable on the page.

## User moment
Someone who heard VPM moved downtown — on air or in a newsletter — follows the link from
vpm.org/about to learn where the building is and what it used to be. In under a minute the page
walks them from Cohen Co. (1886) through the 1987 fire and the parking-lot years to VPM (2026), shows them where it sits, and invites them to
the Weekly Update for events in the new space.

## What done looks like
- Live at vpm.org/neighborhood-history with rebuilt sections replacing the current ones
- Linked from vpm.org/about and forward.vpm.org/we-moved
- Timeline shows five entries in date order — the four archival photos plus a closing
  "VPM moves in, 2026" entry with a current photo of the building — with captions and credits
  visible without clicking
- Each timeline image links to its full-size file so archival scans can be read up close
- Map sits in a full-bleed navy band with equal spacing above and below, and has a short text
  alternative describing where VPM sits relative to the neighborhoods and landmarks shown
- Closing band: "Media that moves us forward" lockup as live text passing WCAG 2.1 AA contrast,
  refreshed intro copy, and the newsletter signup
- Intro copy refreshed so it no longer reads as dated ("This summer…", "coming weeks and
  months") and works as the page's closing beat
- Consistent section spacing and aligned edges across the page
- `/ship-page` passes

## Out of scope (v1)
- New archival research — the existing four archival images and captions only; the one new
  image is the current-day building photo for the 2026 entry
- Newsletter signup — the existing iframe stays as-is
- Page hero — stays the native theme hero (image swap is an open question)
- Map artwork — no changes to the image itself (the text alternative sits alongside it)
- Theme lightbox — not used; images link to full-size files instead
- Theme-level layout and footer fixes — tracked separately with the theme vendor

## Deploy target & constraints
vpm.org/neighborhood-history — `acf-split` shape: native theme hero, then **one** Code Block (HTML +
CSS + JS fields) holding the timeline, map band and closing band (lockup + copy + newsletter
iframe). One block rather than three so the spacing between bands is controlled by the page's own
CSS, not by the theme's padding around each Code Block. Self-contained scoped CSS, px sizing, no
external deps.

- Timeline marked up as an `<ol role="list">` with `<time>` elements
- Full-bleed navy band paints its background with `box-shadow` + `clip-path` rather than widening
  the box — `width: 100vw` and `margin-inline: calc(50% - 50vw)` both size to the viewport
  including the scrollbar and cause horizontal scroll. Revisit if the theme vendor confirms a
  native full-width option.
- Lockup chevron is decorative (`aria-hidden`) and must be marketing's own asset

## Open questions
- Live-by date — is there an event or open house this needs to be up for?
- Hero image: keep the map, or swap in an archival photo so the map isn't repeated?
- Current-day building photo for the 2026 entry — which image, and who supplies it?
- Page title promises "Neighborhood History" but the timeline is one site's history — keep, or retitle?
- Who owns the refreshed intro copy?
- Timeline and lockup are built page-local for now; promote to `vpm-widgets` if a second page
  wants them
