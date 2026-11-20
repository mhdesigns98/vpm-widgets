# General Assembly header

Hero for VPM's General Assembly coverage, styled to match the vpm.org/elections header
(`pages/voter-guide-2026`, results header). Carries the page's only `<h1>`; the category
archive template has none.

**Live URL:** https://www.vpm.org/category/general-assembly/

**Paste order:** one Code Block, the whole `index.html` (style, markup, script), placed first
on the category page.

**Editorial upkeep:** the eyebrow ("2027 Session") and status line ("Session convenes Jan. 13,
2027") are dated. Update them each session, and once it's underway.

**Anchors supplied at runtime:** the header's script gives the category page's existing
sections these ids, by heading text. Nothing to add by hand in the CMS.

| Anchor | Section it lands on (matched heading) |
|---|---|
| `#ga-latest` | Latest Stories |
| `#ga-newsletter` | Start Your Day with Virginia's Top Stories (Morning Monitor signup) |
| `#ga-resources` | Helpful Resources |

**On this page bar:** links are matched to the page's existing sections by heading text
(Latest Stories, Start Your Day…, Helpful Resources). If a heading is renamed, update its
`data-vpm-gahdr-heading`; a link with no match hides, and the bar hides under two links.

Uses widget: <!-- none -->
