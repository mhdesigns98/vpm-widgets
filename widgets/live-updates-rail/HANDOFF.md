# Live Updates Rail — Handoff

Open follow-ups before this is fully done:

- [ ] Not yet pushed / no PR opened.
- [ ] `/ship-widget live-updates-rail` not yet run — required before pasting into any CMS block.
- [ ] Real content: `POSTS` in `js.js` is placeholder-only (generic names, generic quotes).
      Replace with real editorial content, written by/with the reporters actually filing updates.
- [ ] Audio is a visual mock (fake timer-driven progress bar, no real `<audio>` element or file).
      Needs real audio wiring before this ships with a real audio post.
- [x] Homepage 3-column dark-blue variant — built as `data-variant="homepage"` on the same
      widget (see `README.md`). Now hand-picks a text/image/embed trio via `homepageFeatured`,
      matching the original design, rather than just taking the first 3 posts.
- [x] Mobile tab bar + 44px touch buttons — built as `data-variant="mobile"`, verified against
      the original design's 1c mockup.
- [ ] "See all updates" link (rail footer + homepage variant's inline link) points to `#` —
      needs a real destination URL.
- [ ] Homepage variant intentionally drops share/copy-link/audio-scrub to match the original
      design's simpler card look. Since it now only ever shows `homepageFeatured` posts, make
      sure editors know **not** to flag an audio post `homepageFeatured: true` — there's still
      no player there.
- [ ] "The story" tab in the mobile variant is inert (no destination) — wire it to the actual
      article URL once this is embedded on a real page.
