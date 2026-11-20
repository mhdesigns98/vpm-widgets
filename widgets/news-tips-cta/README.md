# News Tips CTA

A "Contact the VPM News team" band: the newsroom description on the left and a tips@vpm.org
email button on the right (stacked in narrow spaces). For section and category pages that should
point readers to the newsroom.

- **Namespace:** `vpm-ntips-`
- **Format:** single file. Paste the whole `index.html` into one Code Block. No JS, no ids, so it
  can sit on any page, more than once if needed.
- **Used on:** https://www.vpm.org/category/general-assembly/, in its own Code Block (Full width
  off) just above the "Meet the VPM Award Winning News Team" section, which stays (decided
  2026-11-20: that section links to /newsroom, this one to the tips inbox). The same copy also
  lives on vpm.org/news as a plain Rich Text block, a candidate for swapping to this widget.
- **Layout:** responds to its own width (container query), so it works full width or in a column.
  Two columns from 720px of available width.
- **Copy:** supplied by the newsroom (2026-11-20). If the description or email changes, edit it
  here and re-paste every placement. Grep this repo for `news-tips-cta` to find pages that carry
  a copy.
- **Heading:** an `h2` ("Contact the VPM News team"). The General Assembly header's On this page
  bar can link to it by adding `data-vpm-gahdr-heading="Contact the VPM News"` (see that page's
  README).

Run `/ship news-tips-cta` before pasting into the CMS.
