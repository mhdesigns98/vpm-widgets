# Mending Walls

**Live URL:** https://www.vpm.org/mending-walls (canonical source of truth)
**Also seen at:** https://vpmnews.kinsta.cloud/mending-walls/ — a WordPress migration/staging
port of this page, used as the primary extraction source. It is **missing one content block**
present on the live `vpm.org` original (see "Kinsta vs. live" below); confirmed by comparing a
screenshot Mark took of the live page against the Kinsta HTML.
**Shape:** `acf-split` (Code Block — HTML + CSS + JS fields)
**Namespace:** `vpm-mw-`

## Purpose

Companion page for *Mending Walls: The Documentary*, about the public art project Mending Walls
RVA (Hamilton Glass, Spring 2020). Consolidates the 12 stacked `page-hero` / `page-rich-text`
sections on the live page into one namespaced Code Block, following the same pattern used for
`raised-razed`.

## Files

| File | Purpose |
|---|---|
| `html.html` | ACF HTML field — paste into the Code Block's HTML field |
| `css.css` | ACF CSS field — paste into the Code Block's CSS field |
| `js.js` | ACF JS field — paste into the Code Block's JS field (drives the carousel prev/next) |
| `preview.html` | Generated — full browser preview, simulates wpp-base chrome |
| `.build-preview.py` | Regenerates `preview.html` from `html.html` + `css.css` + `js.js` |

Paste order: `html.html` → HTML field, `css.css` → CSS field, `js.js` → JS field.

## Kinsta vs. live — what the WordPress port is missing

`vpmnews.kinsta.cloud` was the initial extraction source. `www.vpm.org` sits behind a Cloudflare
Turnstile challenge that this session's automated browser could not clear (retrying to defeat a
bot challenge was out of scope — Mark manually verified the live page with a screenshot and
supplied specific asset URLs instead). That comparison surfaced one real gap:

1. **A 5-image mural-photo carousel, entirely missing from Kinsta.** The live page shows a
   carousel ("1 of 5" with prev/next controls) between the About body copy and Teacher
   Resources. Kinsta has no equivalent markup at all — the About section on Kinsta is plain text
   with nothing after it. **Fixed** — Mark supplied the 5 image URLs (from `assets.vpm.org`,
   proxying `k1-prod-vpm.s3.us-east-2.amazonaws.com` originals) and this build adds a lightweight
   carousel (`.vpm-mw-carousel`) with JS-driven prev/next and a live status region. Alt text is
   empty (`alt=""`) because none was captured from the live page — **if these are decorative
   mural-progress photos that's correct, but confirm before shipping; if they need descriptive
   alt text, someone with access to the live page's DOM needs to supply it.**

2. **Podcast module differs.** The live page shows a custom playlist-style audio player (artwork,
   scrubber, 5-episode playlist: "Trust Building/s: Empatia," "Inspiring the Next Generation of
   Artists," etc.) that is almost certainly a WordPress/theme-native podcast widget, not
   something a static Code Block can reproduce standalone. Per Mark's direction, this build keeps
   Kinsta's simpler `castbox.fm` iframe embed instead — same podcast, simplified presentation.
   **Known simplification, not a defect.**

Nothing else diverged in the screenshot comparison — hero, jump nav, Watch/video, PBS app note,
About body copy, Teacher Resources, PIA workshop paragraph, Team Members, and the Walls link
table all matched between Kinsta and the live page.

## Known issues — not blocking

**The "Walls" link table has several label/URL mismatches, reproduced as-is.** At least two
entries point to a URL slug that doesn't match their visible link text:

- Label "SILENCE ISN'T GOLDEN" → `https://mendingwallsrva.com/walls/water-rights-for-all/`
- Label "THE JOURNEY FORWARD" → `https://mendingwallsrva.com/walls/a-new-change/`

These mismatches are present on both Kinsta and the live page — confirmed pre-existing on the
original Brightspot-era page, not something the WordPress migration introduced. Per Mark's
direction, reproduced exactly as they appear live rather than guessed at. If the correct
label/URL pairing is known, fix it here and the fix carries through to the next `/ship-page` pass.

## Provenance table

Every source section (from `vpmnews.kinsta.cloud/mending-walls/`, cross-checked against a
screenshot of `www.vpm.org/mending-walls`), where it landed, and what changed.

| # | Source section (Kinsta classes) | Content | Landed as | Changed |
|---|---|---|---|---|
| 1 | `page-hero page-hero--no-image` | H1 + subtitle | `.vpm-mw-hero` | Namespaced only |
| 2 | `page-rich-text width-wide` | Jump nav (About\|Team\|Artists\|Walls\|Podcast\|Resources) | `.vpm-mw-jumpnav` | Converted inline `<a>` links to a `<nav>`; anchor targets point at the sections below |
| 3 | `page-rich-text width-wide` | "Watch" H2 + Vimeo iframe | `.vpm-mw-watch` | Namespaced; added `loading="lazy"` and a real `title` |
| 4 | `page-rich-text width-wide` | Empty `<a id="about">` anchor | Folded into `#vpm-mw-about` on the About section | Anchor target preserved, empty wrapper removed |
| 5 | `page-rich-text width-medium` | PBS Video App note | `.vpm-mw-pbs-note` (moved under Watch) | Namespaced only |
| 6 | `page-rich-text width-medium` | 3 paragraphs of About body copy | `.vpm-mw-about` | Namespaced; **5-image carousel added** — missing from Kinsta, sourced from live page (see "Kinsta vs. live" above) |
| 7 | `page-rich-text width-wide` | Empty `<a id="resources">` + "Teacher Resources" H2 + banner image | `.vpm-mw-resources` | Namespaced only |
| 8 | `page-rich-text width-medium` | PIA workshop paragraph + register link | `.vpm-mw-resources` (merged with #7) | Namespaced only |
| 9 | `page-rich-text width-wide` | Empty `<a id="podcast">` + "Podcast" H2 + castbox iframe | `.vpm-mw-podcast` | Namespaced; kept castbox iframe rather than the live page's native playlist widget (see "Kinsta vs. live" above) |
| 10 | `page-rich-text width-wide` | Empty `<a id="team">` + "Team Members" H2 + 4 bio paragraphs (2 people, image-in-text float layout) | `.vpm-mw-team` | Converted float-based image/text layout to CSS grid; removed `clear: both` `<br>` hacks |
| 11 | `page-rich-text width-wide` | Empty `<a id="walls">` anchor | Folded into `#vpm-mw-walls` on the Walls section | Anchor target preserved, empty wrapper removed |
| 12 | `page-rich-text width-medium` | "Walls" H2 + 2-column link table (17 links) | `.vpm-mw-walls` | Converted `<table>` to two `<ul>` lists in a CSS grid; all labels/hrefs reproduced exactly, including known mismatches (see "Known issues") |

## Known issues — jump-link offset unmeasured

Every jump-nav target has `scroll-margin-top: 90px` so the sticky vpm.org header doesn't cover
the heading on landing. That value is a conservative estimate, not a measurement — this session's
automated browser couldn't get past the live page's Cloudflare Turnstile challenge to read the
header's actual height (see "Kinsta vs. live" above). Confirm against the live header before
shipping and adjust if it's off.

## Known issues — scoping

**Adversarial `!important` host CSS can still override this page's scoped rules.** The
`/ship-page` scoping test injects `a { color: red !important }`, `h2 { font-size: 48px
!important }`, `img { max-width: none !important }`, `p { font-size: 24px !important }` and
confirms the page is unmoved. On this build, all four overrides won — none of this page's
selectors carry `!important`, so a real host page with bare-element `!important` rules would
visibly break this page's type scale, link color, and image sizing.

This is a known gap, not unique to this page: `raised-razed` has the same absence of defensive
`!important` (only one exists, on a `prefers-reduced-motion` rule) and was shipped without this
test being recorded as run. Per Mark's direction (2026-08-11), this build ships with the same
posture rather than being singled out for a fix — if `wpp-base` is confirmed to actually emit
bare-element `!important` rules, this needs a coordinated pass across every page in this repo,
not a one-off patch here.

## Uses widget

None — this page has no widget dependencies.
