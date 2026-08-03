# Handoff — elections-2026-primary-cta

Going up **Tue, Aug. 4, 2026**, staying up through the results days after.

- [ ] **Swap the placeholder photo.** `html.html` points at `placehold.co` — an external
      dependency that must not ship. Replace the `src` on `.vpm-elec26cta__img` with a
      VPM-owned image (16:9 or wider, ~1200px), or delete the whole `<figure>` block for a
      text-only panel. `alt` stays empty; the image is decorative.
- [ ] **Run `/ship-widget elections-2026-primary-cta`** — not yet through the CMS harness.
- [ ] **Paste into the CMS** — `html.html` → ACF HTML field, `css.css` → ACF CSS field.
      No JS field needed.
- [ ] **Push** — commit `d13e89c` is local only.
- [ ] **Pull it down** once the primary is no longer news.

Keep the copy day-agnostic when editing: it names Aug. 4 as a date rather than saying
"today" or "tomorrow," which is what lets it run unchanged across multiple days.
