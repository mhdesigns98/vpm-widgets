# Handoff — elections-2026-primary-cta

Going up **Tue, Aug. 4, 2026**, staying up through the results days after.

- [ ] **Swap the placeholder photo.** `html.html` points at `placehold.co` — an external
      dependency that must not ship. Replace the `src` on the `.vpm-img` inside
      `.vpm-elec26cta__media` with a VPM-owned image (16:9 or wider, ~1200px), or delete the
      whole `<figure>` block for a text-only panel. `alt` stays empty; the image is decorative.
- [ ] **Run `/ship-widget elections-2026-primary-cta`** for the guided pass. It has had a
      clean manual harness run since migrating onto the base layer — see README "Pre-ship".
- [ ] **Paste into the CMS** — this widget now needs the **base layer**. Into the *first*
      Code Block on the page: `base/reset.css` → `base/tokens.css` → `base/atoms.css` →
      then this widget's `css.css`. `html.html` → ACF HTML field. No JS field needed.
      If the page already has another base-layer widget above this one, paste only `css.css`.
- [ ] **Push** — commit `d13e89c` is local only.
- [ ] **Pull it down** once the primary is no longer news.

Keep the copy day-agnostic when editing: it names Aug. 4 as a date rather than saying
"today" or "tomorrow," which is what lets it run unchanged across multiple days.
