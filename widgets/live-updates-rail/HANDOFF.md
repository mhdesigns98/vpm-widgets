# Live Updates Rail — Handoff

Open follow-ups before this is fully done:

- [ ] Not yet pushed / no PR opened.
- [ ] `/ship-widget live-updates-rail` not yet run — required before pasting into any CMS block.
- [ ] Real content: `POSTS` in `js.js` is placeholder-only (generic names, generic quotes).
      Replace with real editorial content, written by/with the reporters actually filing updates.
- [ ] Audio is a visual mock (fake timer-driven progress bar, no real `<audio>` element or file).
      Needs real audio wiring before this ships with a real audio post.
- [x] Homepage 3-column dark-blue variant — built as `data-variant="homepage"` on the same
      widget (see `README.md`). Verified in browser alongside the sidebar rail.
- [ ] "See all updates" link (both the rail footer and the homepage variant's inline link)
      points to `#` — needs a real destination URL.
- [ ] Homepage variant intentionally drops share/copy-link/audio-scrub to match the original
      design's simpler card look — confirm that's still wanted once real content is in, since
      audio posts on the homepage would currently render with no way to play them there.
