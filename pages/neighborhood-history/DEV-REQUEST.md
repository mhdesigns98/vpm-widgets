# Theme questions — Neighborhood History

Draft to send to the `wpp-base` theme developers. Questions first, requests second — some of
these may already be intended behavior or have a setting that just needs pointing at.

Gallery and page-hero behavior are deliberately left out: this page replaces those sections with
its own Code Blocks (see `BRIEF.md`), so there's nothing to ask for there.

---

**Subject:** Section Builder — a few layout questions from the Neighborhood History page

Hi —

While reviewing the Neighborhood History page (`?page_id=490005`) I ran into some layout
behavior I'd like to check with you. Some of it may be intended, so questions first.

**Sitewide (footer)**

1. The footer menu columns output `<li>` elements directly inside `div.footer-top`, without a
   parent `<ul>`, so screen readers lose the list semantics. Could those be wrapped in `<ul>`s?
2. The column headings ("Your VPM", "Connect with VPM", "Learn More") are links to `#`, so
   keyboard users tab onto dead links. Could they render as headings or plain text when the
   menu item's URL is `#`?
3. The copyright line appears twice (in the address block and in the footer bottom). Is one of
   them meant to be removed?

**Section Builder**

4. **Nested `bg-gray`:** a `page-rich-text` section with `bg-gray` inside a `page-grid` with
   `bg-gray` renders as two different grays, with a visible box. Is that intended? If not,
   could nested sections default to a transparent background?
5. **Nested containers:** a `page-code-block` placed in a grid column wraps its content in its
   own `.container`, which adds padding. Its right edge ends up about 6px inside the edge of the
   full-width sections below. Could the inner container be dropped when the block sits in a
   grid column?
6. **Section spacing:** the image block section (`bsm-block-section`) has no bottom padding, so
   its content touches the footer, while the other sections have 28–45px. Is there a spacing
   setting per section I've missed? If not, could all sections share one default gap?
7. **Full-width option:** is there a way to make an image block or code block span the full
   viewport width, the way `page-hero` does? If not, could you confirm the theme doesn't set
   `overflow: hidden` on `.container` or its parents? A code block that paints a full-width
   background relies on that.
8. **Grid column heights:** does `page-grid` have an equal-height (stretch) option alongside
   `valign-top`?

None of this is blocking. The footer items affect every page, so those would be my priority.

Thanks —
