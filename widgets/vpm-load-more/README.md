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
5. Duplicate the whole block (copy/paste) for a second collapsible section on the same
   page — the script scopes itself to its own `.vpm-lm` wrapper, so multiple copies
   initialize independently.

No external dependencies. No plugin required.
