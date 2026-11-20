# General Assembly header

Permanent hero for VPM's General Assembly category page, styled to match the vpm.org/elections
header (`pages/voter-guide-2026`, results header). Carries the page's only `<h1>`; the category
archive template has none.

**Live URL:** https://www.vpm.org/category/general-assembly/

**Paste order:** one Code Block, the whole `index.html` (style, markup, script), placed first
on the category page. **Turn on the Code Block's Full width setting** (the theme adds
`is-full-width`, which removes `.container`'s 1240px cap), as on vpm.org/elections. Without it the
navy band sits in a boxed 1240px column instead of running edge to edge.

## Session status line

The header stays up year-round. Only the status line under the title is tied to a session, and
it runs off three attributes on `.vpm-gahdr__status` (all dates `YYYY-MM-DD`, Virginia time):

| Attribute | Current value | What happens |
|---|---|---|
| (the line's text) | Session convenes Jan. 13, 2027 | Shown before the start date |
| `data-vpm-gahdr-start` | `2027-01-13` | From this date on, the text switches to `-after` |
| `data-vpm-gahdr-after` | 2027 session underway | Shown from the start date until the end date |
| `data-vpm-gahdr-end` | empty | The day after this date, the whole line hides |

Jan. 13, 2027 is confirmed on the General Assembly's official prefiling calendar
(https://dls.virginia.gov/pubs/calendar/cal2027_1.pdf, session day 1).
**`data-vpm-gahdr-end` is deliberately empty:** the adjournment date isn't published yet (the
session adopts its schedule when it convenes). Until it's filled in, the line keeps saying
"session underway". Once the schedule is out, set it to the scheduled adjournment date.

**Next session:** in the fall, update the line's text and all three attributes, and clear the end
date again. With no session coming, leaving the hidden line in place is fine.

## On this page bar

Links point at sections already on the category page, matched by heading text. The header's
script gives each matched section its id at runtime, so there's nothing to add by hand in the CMS.

| Anchor | Section it lands on (matched heading) |
|---|---|
| `#ga-latest` | Latest Stories |
| `#ga-resources` | Helpful Resources |

A link with no matching heading hides, and the whole bar hides when fewer than two links remain.
If a heading is renamed, update the link's `data-vpm-gahdr-heading`.

**Adding a section:** give it a Heading in the CMS, then add a link to the list:

```html
<li><a href="#ga-<short-name>" data-vpm-gahdr-heading="<start of the heading text>">Link label</a></li>
```

The match is case-insensitive and on the start of the heading, so `"Bill Tracker"` matches
"Bill Tracker: what's moving". It only looks at `h2` headings inside the page's sections. Add a
row to the anchor table above. `/ship` reads that table.

Uses widget: <!-- none -->
