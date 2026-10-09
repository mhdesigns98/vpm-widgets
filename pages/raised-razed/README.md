# Raised/Razed

**Live URL:** https://www.vpm.org/raised-razed (canonical source of truth)
**Also seen at:** https://vpmnews.kinsta.cloud/raised-razed/ — a WordPress migration/staging port
of this page that is **missing content** present on the live `vpm.org` original (see "Kinsta vs.
live" below). Built against the live page after that was discovered.
**Shape:** `acf-split` (Code Block — HTML + CSS fields)
**Namespace:** `vpm-rr-`

## Purpose

Documentary page for *Raised/Razed*, a feature film about the destruction of Vinegar Hill, an
African American neighborhood in Charlottesville, VA, under the federal Urban Renewal program.
Consolidates the 32 stacked `page-hero` / `page-rich-text` / `page-split` sections on the live
page into one namespaced Code Block, following the same pattern used for
`racism-challenging-perceptions`.

## Files

| File | Purpose |
|---|---|
| `html.html` | ACF HTML field — paste into the Code Block's HTML field |
| `css.css` | ACF CSS field — paste into the Code Block's CSS field |
| `preview.html` | Generated — full browser preview, simulates wpp-base chrome |
| `.build-preview.py` | Regenerates `preview.html` from `html.html` + `css.css` |

Paste order: `html.html` → HTML field, `css.css` → CSS field. No JS field needed.

## Kinsta vs. live — what the WordPress port lost

The initial pass at this consolidation was built against `vpmnews.kinsta.cloud`, assuming it was
the current/canonical page. It is not — it's a WordPress migration port of the older Brightspot
page, and the port dropped or broke content that the actual live page at `www.vpm.org/raised-razed`
still has:

1. **Randall R. Taylor Jr.'s headshot.** Kinsta's `src` was
   `https://vpmnews.kinsta.cloud/wp-content/uploads/optimized/c13b8a4c-90.90` — a corrupted
   filename (lost its real extension) that 404s. The live page serves a working image at
   `https://k1-prod-vpm.s3.us-east-2.amazonaws.com/brightspot/6e/d6/b9e0b86f47b099b35950e88d08d5/randall.png`.
   **Fixed** — this build now uses the working S3 URL.

2. **A 6th press card, entirely missing from Kinsta.** "Local filmmakers highlight Black life in
   Charlottesville's Vinegar Hill and the neighborhood's ultimate destruction by Urban Renewal"
   (`https://www.vpm.org/2022-04-22/local-filmmakers-highlight-black-life-in-charlottesvilles-vinegar-hill-and-the`)
   exists on the live page but nowhere on Kinsta. **Fixed** — added as the 6th card.

3. **Every press card was missing its link on Kinsta**, and one (the appraisal-reports screenshot)
   was missing its headline too — it looked image-only, which the first pass on this page
   mistakenly treated as intentional. On the live page all 6 cards are real linked articles with
   real headlines. **Fixed** — all 6 cards now carry their real `href` and headline, pulled from
   `www.vpm.org/raised-razed`'s rendered DOM.

4. **All 6 remaining team photos + the show logo pointed at Kinsta**, not just Randall's. Found
   during `/ship-page`: Lorenzo, Jordy, Metta, Craig, Ivan, and the `raised-razed-show-logo.png`
   were all still `vpmnews.kinsta.cloud/wp-content/uploads/...` URLs — the same unreliable staging
   host that lost Randall's photo outright. They happened to still 200 at review time, but nothing
   guarantees that host stays up. **Fixed** — all six now point at the stable `assets.vpm.org`
   URLs the live page actually serves.

Net effect: the original defect list in this README ("known issues — blocking") was diagnosing
symptoms of a bad migration source, not real content gaps on the actual page. There is nothing
outstanding from this list anymore.

## Provenance table

Every source section (from the live `www.vpm.org/raised-razed` page), where it landed, and what
changed.

| # | Source section | Destination | Notes |
|---|---|---|---|
| 1 | `page-hero` (no image) | `.vpm-rr-hero` | Title only, straightforward carry-over |
| 2 | `page-rich-text` — bold centered lede | `.vpm-rr-intro__lede` | |
| 3 | `page-rich-text` — PBS viral player iframe | `.vpm-rr-player` | Added `loading="lazy"` + real `title` (source iframe had neither) |
| 4 | `page-rich-text` — intro paragraph | `.vpm-rr-intro` body copy | |
| 5 | `page-section-header` "Raised/Razed Articles" | `.vpm-rr-articles` heading | Square marker replicated as `.vpm-rr-section-title__marker` |
| 6–11 | 6× linked press-article cards (image + headline + link) | `.vpm-rr-press-card` × 6 | Headlines/links/images pulled from the live page's rendered DOM — see "Kinsta vs. live" above for what the staging port had lost |
| 12 | `page-rich-text` "The Team" `<h2>` | `.vpm-rr-team` heading | Stripped Brightspot `data-state` JSON attribute (CMS internal metadata, not content) |
| 13–30 | `page-rich-text` × 18 — 6× (photo / name+role / bio) triplets + `<hr>` dividers | `.vpm-rr-member` × 6 | Collapsed each 3-section stack (photo, name/role, bio) plus its trailing `<hr>` into one `<article>`; dividers now `border-bottom` on all but the last member. All 6 photos point at `assets.vpm.org`, not Kinsta (see above) |
| 31 | `page-rich-text` — show logo image | `.vpm-rr-about__logo` | `assets.vpm.org`, not Kinsta (see above) |
| 32 | `page-rich-text` "About" `<h2>` + 4 paragraphs | `.vpm-rr-about` body | Stripped Brightspot `data-state` JSON attribute |
| 33 | `page-rich-text` — social follow links | `.vpm-rr-follow` | |

## What changed and why

- **Un-namespaced globals removed.** Source relied on theme-supplied `.page-split-image` /
  `.page-split-text` / `.page-rich-text-inner` classes; a Code Block inherits none of that, so
  every rule is now scoped under `.vpm-rr`.
- **Type scale matches the theme's measured rich-text scale** — 16px root, 17px body (Public
  Sans), 30px section headings (Oswald 700). Measured live via computed styles on
  `vpmnews.kinsta.cloud` 2026-08-11 (not inferred from source markup, which used no inline
  `rem` overrides on this page — unlike `racism-challenging-perceptions`, there was no 10px-root
  inflation bug here).
- **Iframe a11y/perf:** the PBS viral player now gets `loading="lazy"` and a real `title`; source
  had neither.
- **Brightspot CMS metadata stripped** from two `<h2>` elements ("The Team", "About") that
  carried large inline `data-state` JSON blobs — internal publishing metadata, not content.
- **Press grid restructured** from single-column stacked `page-split` sections into a responsive
  CSS grid (`auto-fit`, min 240px), and every card is now a real link (`.vpm-rr-press-card__link`)
  to its article — restoring behavior the Kinsta port had lost.

## Known issues

None outstanding. All content gaps found during the first pass turned out to be artifacts of a
stale/broken migration source (Kinsta), not real defects on the canonical live page — see
"Kinsta vs. live" above.

## Ship-page notes

- **Scoping was verified against the real host stylesheets** (base/components/overrides/
  page-builder/archive/player from `wpp-base`), per the method `CLAUDE.md` (Page Builds)
  specifies — zero deltas across 11 selectors including `a`, `h2`, `img`, `p`. A synthetic
  `a { color: red !important }` / `h2 { font-size: 48px !important }` injection *does* override
  this page's styles, but that's expected and explicitly called out in `CLAUDE.md` as the wrong
  check: `!important` beats any selector specificity by definition, the live theme itself declares
  none on bare elements, and no page in this repo is written to survive a hypothetical one. Don't
  re-flag this as a scoping failure on a future ship-page run.

## Uses widget

None.
