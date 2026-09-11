# VPM Load More

Collapsible content section with a "Continue reading" expand button. Built for long-form
articles (e.g. a full interview transcript) where most of the content should be hidden
behind a click rather than pushing the whole piece below the fold.

**Deploy target:** paste into a Custom HTML block in the WordPress post/page editor,
directly before the content to hide.

**Usage:**
1. Paste the widget's full HTML into a Custom HTML block.
2. Keep the first item or two of the section above/outside `.vpm-lm__inner` so readers see
   real content before the fade line.
3. Replace the placeholder paragraph inside `.vpm-lm__inner` with the rest of the content
   (e.g. remaining interview Q&As).
4. Content stays in the DOM at page load (not `display:none`) so it's still indexable by
   search engines and screen readers — only the max-height + fade hides it visually.
5. For more than one collapsible section on the same page (e.g. one per interviewee),
   paste the full block again for each section — the script initializes every `.vpm-lm`
   block on the page, so each one collapses/expands independently even from duplicate
   `<style>`/`<script>` tags.

See `example-toll-attendants.html` for a two-interviewee reference layout with each
person's intro Q&A visible and the rest of their answers collapsed separately.

No external dependencies. No plugin required.
