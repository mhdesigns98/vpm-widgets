# General Assembly page

The custom blocks on VPM's General Assembly category page: a permanent hero in the vpm.org/elections
style (which carries the page's only `<h1>`; the category archive template has none) and the
Helpful resources sidebar module. Formerly `pages/general-assembly-header` (single file); it became
a `sections/` build on 2026-11-20 when the resources module joined it.

**Live URL:** https://www.vpm.org/category/general-assembly/

**Paste order:** see `sections/PASTE-ORDER.md`. Two Code Blocks are this build:

- `sections/header.html`: first on the page. **Turn on the Code Block's Full width setting**
  (the theme adds `is-full-width`, which removes `.container`'s 1240px cap), as on
  vpm.org/elections. Without it the navy band sits in a boxed 1240px column.
- `sections/resources.html`: the right-hand column of the stories grid, replacing the old
  "VPM Helpful Resources Module".

The page also carries two widgets, pasted as their own blocks (copies aren't held here):

Uses widget: news-tips-cta
Uses widget: newsletter-signup-embed

## Header: session status line

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

## Header: On this page bar

| Anchor | Lands on | Supplied by |
|---|---|---|
| `#ga-latest` | Latest Stories | the header's script, at runtime (matches the heading text) |
| `#ga-resources` | Helpful resources | `sections/resources.html` (the id is in the block) |

For a section the header doesn't own, the script finds the page's `h2` that starts with the
link's `data-vpm-gahdr-heading` text and gives that section the link's id. A link with no target
hides, and the whole bar hides when fewer than two links remain. If a heading is renamed, update
the link's `data-vpm-gahdr-heading`.

**Adding a section:** give it a Heading in the CMS, then add a link to the list in `header.html`:

```html
<li><a href="#ga-<short-name>" data-vpm-gahdr-heading="<start of the heading text>">Link label</a></li>
```

The match is case-insensitive and on the start of the heading, so `"Bill Tracker"` matches
"Bill Tracker: what's moving". Add a row to the anchor table above; `/ship` reads it. The
news-tips-cta block can be linked with `data-vpm-gahdr-heading="Contact the VPM News"`.

## Resources module

Six official links, one column in the 350px sidebar and two when the block gets 560px or more
(the grid collapses to full width on tablets). The legislature moved its site from
`virginiageneralassembly.gov` to `vga.virginia.gov` in 2026; links were updated and checked
2026-11-20. "How to track a bill" points at the LIS bill search
(https://lis.virginia.gov/bill-search); the old deep link landed on a general "Learn" page.
Capitol Classroom and the Senate member list are still on their old hosts and still work.
Links open in a new tab, with a screen-reader note saying so and a ↗ icon.
