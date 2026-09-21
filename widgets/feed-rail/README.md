# Feed Rail

A reusable vertical rail of short updates (video shorts, links) for placement alongside a main
story or on a landing page — the same idea as the Voter Guide design's "Shorts" rail, made
general-purpose.

**Namespace:** `vpm-feedrail-`

**Deploy target:** WordPress ACF Code Block (single self-contained file).

**Content editing:** all feed content lives in the `FEED_ITEMS` array near the top of the
`<script>` block in `index.html` — add, remove, or reorder items there. No CSS/markup edits
needed to update content. Video items pull their thumbnail automatically from YouTube's static
thumbnail endpoint (`img.youtube.com/vi/<id>/hqdefault.jpg`) using just the video/short ID — no
API key required.

**Out of scope (v1):** no WordPress custom post type or wp-admin editing UI (see `BRIEF.md`),
no auto-refresh — static render on page load.

Run `/ship-widget feed-rail` before deploying to the CMS.
