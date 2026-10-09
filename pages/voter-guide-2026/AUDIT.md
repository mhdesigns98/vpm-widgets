# Accessibility & responsive audit — live dev page

**Target:** `https://vpmnews.kinsta.cloud/vpm-news-voter-guide/` (page id 466103)
**Date:** 2026-08-06 · **Method:** Chrome DevTools, emulated 320×720 @2x mobile, plus static
analysis of the served HTML.

This is the audit the old HANDOFF flagged as never done. It covers the page **as it stands
today** — nothing was repasted first, so these are pre-existing findings.

## Passes

| Check | Result |
|---|---|
| Duplicate `id` across the 8 pasted blocks | **86 IDs, 86 unique** — none |
| In-page anchor targets | all 16 resolve |
| Heading outline | no skipped levels; exactly one `h1` |
| Image alt text | 18 images, 0 missing |
| Horizontal overflow at 320px | none; zero elements exceed viewport |
| Visible focus | all 27 focusable elements in `.vpm-vg` show an indicator |
| `prefers-reduced-motion` | media query present (71 animated elements in scope) |
| Style scoping | 7 `.vpm-vg` roots, matching the 7 fragments; no bleed observed |

## Findings

### 1. HIGH — the page depends on a personal Vercel deployment

**17 image references across 3 fragments** point at `https://vpm-voter-guide.vercel.app`:

| Fragment | refs |
|---|---|
| `sections/video-coverage.html` | 8 |
| `sections/voting-faq.html` | 7 |
| `sections/header-section.html` | 2 |

Seven distinct assets: `photo-short-earlyvoting.jpg`, `photo-short-ballot.jpg`,
`photo-short-senate.jpg`, `icon-play-overlay.svg`, `icon-chevron.svg`,
`icon-video-unavailable.svg`, `icon-youtube-link.svg`.

They currently return 200, so nothing is visibly broken. But a vpm.org page is relying on a
personal demo project for its images — if that Vercel project is renamed, deleted, or hits a
limit, the page loses them, and nobody would connect the failure to Vercel.

Worth noting: this is the exact failure mode that made externally-hosted CSS/JS on S3 a bad
idea. The same dependency already exists here by accident.

**Fix:** all 7 assets already exist in `demo/assets/`. Upload them to the WordPress media
library and repoint the references. No design change, no dev involvement.

### 2. MEDIUM — 9 undersized tap targets

Nine links render 16–19px tall: four "Learn more →", `elections.virginia.gov →`, and the four
voter-resource links (Voter Resources, Find Your Ballot, Check Registration, Early Voting Info).

To be precise about the standard: these **pass WCAG 2.1 AA**, which has no minimum target-size
criterion at that level. They **fail WCAG 2.2 AA (2.5.8 Target Size Minimum, 24×24 CSS px)**.
Since the checklist specifies 2.1 AA this is not a formal failure — but it is a real
thumb-accuracy problem on phones, and the fix is a few px of vertical padding.

### 3. LOW — one contrast failure, and it is a brand-level issue

`Visit VPM on YouTube` — white on `#EE2737` at 13px = **4.22:1**, needs 4.5:1.

`#EE2737` is the canonical `--vpm-red` from `tokens.css`, so white-on-red at small sizes will
fail anywhere it is used, not just here. Either bump this instance's size/weight, or treat it
as a brand-token question. Everything else on the page passes.

### 4. LOW — section nav order does not match DOM order

The nav links `#video → #elections → #regional → #faq`, but the sections appear in the DOM as
video → elections → newsletter → **faq → regional**. Clicking "regional" jumps past FAQ.
Confirm which order is intended and align one to the other.

### 5. INFO — one console error

A single `ERR_CONNECTION_REFUSED`, from third-party ad/analytics origins (`servedbyadbutler`,
`googletagmanager`), not from our markup. Not actionable here.

## Also confirmed during the audit

**The dynamic article feed already exists and is live.** The Section Builder includes a
`page-article-grid cols-3` layout, and it is already placed on this page directly beneath the
static "Featured Stories" heading in the header block, rendering six real election stories.

Full layout inventory on the page: 8 × `page-code-block`, 1 × `page-article-grid cols-3`,
1 × `page-grid bg-white`.

This substantially answers what was going to be the main ask of the theme devs — see
`DEV-REQUEST.md`, where that question is now narrowed to the grid's configuration options
rather than whether one exists.
