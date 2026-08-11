# Handoff — elections-2026-primary-cta

*Status: shipped — live in the CMS since Tue, Aug. 4, 2026, and still up. Time-sensitive: needs a takedown date (see Still open).*
*Last updated: 2026-08-10 · Last verified: 2026-08-06 — Mark confirmed it live in the CMS by eye. Not re-checked since.*
*Live vs repo: **diverged.** The live block uses a real VPM photo swapped in at paste time; the repo still holds a placehold.co URL. The repo is not a faithful record of what shipped — see Still open.*

## Done

- [x] Ran up on schedule for the Aug. 4 primary.
- [x] Pasted into the CMS — `html.html` → ACF HTML field, `css.css` → ACF CSS field.
      No JS field needed.
- [x] Pushed — `d13e89c` is on `origin/main`.

## Still open

- [ ] **Reconcile the repo copy with what actually shipped.** `html.html:14` and
      `preview.html:291,338` still point at
      `https://placehold.co/1200x800/003865/FFFFFF?text=Swap+in+VPM+photo`. The live block
      does not (the photo was swapped at paste time), so **this repo is not a faithful record
      of the live widget**. Replace the `src` on `.vpm-elec26cta__img` with the real
      VPM-owned image URL. `alt` stays empty — the image is decorative.
      `README.md:25` describes the placeholder too and needs the same edit.
- [ ] **Pull it down** once the primary is no longer news. Copy is day-agnostic (it names
      Aug. 4 as a date rather than "today"), which is what let it run unchanged across the
      results days — so there is no hard expiry, but it should not sit on the homepage
      indefinitely. **Decide and record a date here.**

## Notes

Keep the copy day-agnostic when editing: naming the date rather than saying "today" or
"tomorrow" is what makes the block safe to leave up across multiple days.

## Session log

- 2026-08-03: Built and hardened against hostile host CSS (`7d3e380`).
- 2026-08-04: Went live in the CMS with a real photo swapped in at paste time.
- 2026-08-06: Confirmed live; commit pushed. Repo/live photo divergence logged above.
