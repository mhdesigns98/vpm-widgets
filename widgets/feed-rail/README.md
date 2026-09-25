# Feed Rail

A reusable vertical rail of short updates (video, articles, audio, quick text notes) for
placement alongside a main story or on a landing page — the same idea as the Voter Guide
design's "Shorts" rail, made general-purpose.

**Namespace:** `vpm-feedrail-`

**Deploy target:** WordPress ACF Code Block (single self-contained file).

**Content types:**
- `video` — thumbnail + play overlay, pulled automatically from YouTube's static thumbnail
  endpoint (`img.youtube.com/vi/<id>/hqdefault.jpg`) using just the video/Short ID, no API key
- `article` (alias `link`) — optional thumbnail, falls back to a plain text row if none given
- `audio` — optional thumbnail, falls back to a headphone-icon tile if none given
- `text` — no thumbnail, headline + short body; `url` is optional, so a text item can be a
  plain in-feed note with nothing to click through to

**Content editing:** all feed content lives in the `FEED_ITEMS` array near the top of the
`<script>` block in `index.html` — add, remove, or reorder items there. No CSS/markup edits
needed to update content. The comment block directly above the array documents every field per
type.

**Out of scope (v1):** no WordPress custom post type or wp-admin editing UI (see `BRIEF.md`),
no auto-refresh — static render on page load.

Run `/ship-widget feed-rail` before deploying to the CMS.
