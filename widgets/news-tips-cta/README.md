# News Tips CTA

A "Contact the VPM News team" band: a newsroom photo, the newsroom description, a tips@vpm.org
email button, and a "Meet the VPM News team" link to vpm.org/newsroom. Photo on the left and
text on the right when wide; stacked in narrow spaces.

- **Namespace:** `vpm-ntips-`
- **Format:** single file. Paste the whole `index.html` into one Code Block. No JS, no ids, so it
  can sit on any page, more than once if needed.
- **Optional parts:** the photo (`<div class="vpm-ntips__media">`) and the team link
  (`<a class="vpm-ntips__more">`). Delete either one and the layout adjusts on its own. Without
  the photo, the description and the email panel sit side by side on a wide page.
- **Used on:** https://www.vpm.org/category/general-assembly/, in its own Code Block (Full width
  off) at the bottom of the page. It **replaces** the theme's "Meet the VPM Award Winning News
  Team" split section, which said much the same thing (decided 2026-11-20). Delete that section
  when you paste this. The same copy also lives on vpm.org/news as a plain Rich Text block, a
  candidate for swapping to this widget.
- **Photo:** the one the old split section used (VPM's S3 bucket, 899×600). Its alt text
  describes the scene without naming anyone. Ask the newsroom whether to name the reporter.
- **Copy:** supplied by the newsroom (2026-11-20). If the description or email changes, edit it
  here and re-paste every placement. Grep this repo for `news-tips-cta` to find pages that carry
  a copy.
- **Heading:** an `h2` ("Contact the VPM News team"). The General Assembly header's On this page
  bar can link to it by adding `data-vpm-gahdr-heading="Contact the VPM News"` (see
  `pages/general-assembly/README.md`).

Run `/ship news-tips-cta` before pasting into the CMS.
