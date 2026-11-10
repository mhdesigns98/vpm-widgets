# Voter Guide — ACF Code Block fragments

Paste-ready HTML fragments for the VPM News Voter Guide, built to the
`vpm-page-builder` conventions: raw fragments (no `<!DOCTYPE>`/`<html>`/`<body>`),
every class prefixed and scoped under a single `.vpm-vg` wrapper, no frameworks, no
font imports, no build step, images as absolute URLs.

## Header by phase

Block 1 changes with the election calendar. Each phase has its own file, kept so it can be
pasted again next cycle. Paste exactly one; all three carry the shared stylesheet.

| Phase | File | What the hero sidebar shows | Copy it |
|---|---|---|---|
| Pre-election | `header-section.html` | Important Dates calendar | `copy-voterguide-header.sh --pre` |
| Election night | `results-header-section.html` | AP live results embed | `copy-voterguide-header.sh --results` |
| Post-election | `post-election-header-section.html` | Key results, linked to stories | `copy-voterguide-header.sh` (default) |

## Paste order

| # | Block | File |
|---|---|---|
| 1 | Code Block — hero, Important Dates, "Featured Stories" label. **Carries the entire stylesheet.** | `header-section.html` |
| 2 | **Article List (live CMS block)** — 3 columns, leave the title field EMPTY | — (editor-inserted) |
| 3 | Code Block — sticky "On this page" nav + scrollspy script | `section-nav.html` |
| 4 | Code Block — VPM Video Coverage (YouTube playlist player + JW vertical shorts carousel) | `video-coverage.html` |
| 5 | Code Block — Key Virginia Elections | `key-virginia-elections.html` |
| 6 | Code Block — Key Regional Races (+ Voter Resources bar) | `key-regional-races.html` |
| 7 | Code Block — Voting FAQ | `voting-faq.html` |
| 8 | Code Block — Newsletter signup | `newsletter-signup.html` |

Block 1 ends at the marker

```html
<!-- ===== SPLIT ===== LIVE BLOCK HERE: Featured Stories (article list) ===== -->
```

which is the instruction to stop pasting, add the live Article List block in the CMS,
and continue with block 3 in a **new** Code Block. Fragments are independently valid
HTML — each opens and closes its own `.vpm-vg` wrapper.

Ads are separate builder rows, not part of any fragment (a Code Block's HTML can't
contain a `[vpm_section id="..."]` shortcode):

- **970×90 leaderboard** — its own full-width row between block 3 and block 4.
- **300×250** — narrow column of a 2-column row beside block 1.
- **300×600** — narrow column of a 2-column row beside block 4.

## Rules that matter

- **All CSS lives in block 1.** Blocks 3–8 carry no `<style>` of their own. If you build
  a page without the header, paste `_shared-styles.html` once instead — it is generated
  from `header-section.html`'s `<style>` block and must stay in sync with it.
- **Story lists are never hardcoded.** They're live CMS blocks so the newsroom publishes
  and the page updates itself. The stylesheet restyles the live block's own classes to
  match the design — see the `LIVE BLOCK OVERRIDES` section in `header-section.html`.
  Those are the only un-prefixed selectors allowed in this stylesheet; a `Latest
  Coverage` feed added later picks up the same styling automatically.
- **No global selectors.** No `html`, `body`, `*`, `:root`, or bare element rules — they
  leak out and break the site header, footer and nav. Smooth scrolling is done in JS in
  `section-nav.html` for exactly this reason (a global `html{scroll-behavior:smooth}`
  used to be here).
- **Keep the `vg-` prefixes.** A white-background bug on the live site was traced to
  generic names like `.wrap`/`.sidebar` colliding with the WordPress theme's CSS.
- **Section ids** `#video`, `#elections`, `#regional`, `#faq` are what the
  nav links and scrollspy target. Drop a section → drop its `<li>` in `section-nav.html`.

## Live block class structure (for reference)

The overrides in the stylesheet target this structure, which the CMS's Article List
block renders **outside** `.vpm-vg` (which is why the custom properties are redeclared
on `section.page-article-grid`):

```
section.page-article-grid.cols-3
  div.container
    div.page-article-grid-header      ← only if a title is set; hidden by our CSS
    div.page-article-grid-inner
      article.page-article-card.PromoA
        div.page-article-card-media   ← <a> with background-image, or .bsm-img-ph
        div.page-article-category
        h3.page-article-title > a
        div.page-article-byline
        p.page-article-excerpt        ← hidden by our CSS
```

## If a section ever needs hand-picked story links

Feeds are the default — Featured Stories is one, and a later "Latest Coverage" feed picks
up the same styling for free. For a genuinely curated row (hand-chosen links, not
most-recent-N), don't try to bend the live block: build it as a normal static band in its
own fragment. The old hand-coded card markup and CSS is still in `index.html` /
`wordpress-embed.html` (`featured-card`, `thumb`, `kicker`, `card-title`, `byline`, accent
bar) — lift it from there and re-prefix every class to `vg-`. It was removed from these
fragments when Featured Stories went live-feed.

## Verifying a change

Concatenate the fragments in paste order into one file, with markup matching the
structure above standing in for the live block, load it in a browser and check:

- no white strip at the seam between block 1 and the live block;
- the live cards match the design (kicker, headline, byline, cycling red/blue/yellow
  accent bar, image zoom + lift on hover, `.bsm-img-ph` tile when a story has no image);
- exactly one `<h1>` and no skipped heading levels;
- nothing outside `.vpm-vg` / `section.page-article-grid` picks up fragment styling;
- clicking each nav link scrolls smoothly and highlights the right link;
- 1440 / 980 / 760 / 360px wide with no horizontal page scroll.

Then paste block 1 + a live Article List block on Kinsta staging before touching the
live page — the theme-collision bugs only show up against the real theme.

## Election-night variant

On election night, paste `results-header-section.html` in Block 1's place instead of `header-section.html` (never both). It swaps the Important Dates card for the AP live results embed and carries the same shared stylesheet. Its title changes by phase on its own; see the header comment.

The live page at vpm.org/elections doesn't follow the table above. As of Nov. 3, 2026 it runs:

| # | Block | Kind |
|---|---|---|
| 1 | `results-header-section.html` | Code Block |
| 2 | `section-nav.html` | Code Block (new: paste it directly under the header) |
| 3 | "What You Need to Know" + Voting FAQ (`#faq`) | 2-column row: Promo List (hand-picked) + Code Block |
| 4 | "Know Your Candidates" (`#key-elections`) | Promo List (hand-picked) |
| 5 | "Proposed Constitutional Amendments" | Promo List (hand-picked) |
| 6 | VPM Video Coverage (`#video`) | Code Block |
| 7 | Morning Monitor newsletter | Code Block |
| 8 | "Latest Coverage" | Article List (automatic, Virginia Elections) |

- **1 p.m. ET Nov. 4:** the header moves the AP panel below the first block under it that isn't a Code Block, so it skips the nav and lands under row 3. For newest-first election stories above the results, drag "Latest Coverage" (or a copy of it) up into row 3's place; the header doesn't choose stories.
- **Section nav ids:** `#need-to-know`, `#amendments` and `#latest` are given to blocks whose heading starts with the expected name (any case) when the CMS block has no id. Setting those ids on the blocks in the CMS is sturdier. A link whose section is missing is hidden.

## Optional block, not in the default order

`house-races.html` (More U.S. House Races, `#house-races`) is a standalone Code Block for the seven districts without a VPM candidate Q&A. Its own comment says to paste it right after the "Know Your Candidates" article list, which this page doesn't currently have, so it has no slot in the table above. Its candidate lists need editorial sign-off before it goes live, and adding it means adding a `#house-races` link to `section-nav.html`.

## Post-election voter guide (vpm.org/voterguide, from Nov. 2026)

vpm.org/voterguide is now its own page; vpm.org/elections carries the results. On
/voterguide the header block changed:

- `post-election-header-section.html` is the whole top of the page: hero, Key results panel and the
  "On this page" nav, which now sits inside the hero (as on /elections).
- **No Featured Stories Article List under it**, and no split: paste the fragment whole.
- **Don't paste `section-nav.html`** on this page; the nav is already in the header.
- The nav links to `#need-to-know`, `#faq`, `#key-elections`, `#amendments`, `#video` and
  `#latest`. CMS rows without an id are matched by heading text ("What You Need to Know",
  "Know Your Candidates", "Proposed Constitutional Amendments", "Latest Coverage"). A link
  whose section isn't on the page hides itself.
- Paste the whole file over the whole block, stylesheet included (`copy-voterguide-header.sh`
  copies it). Don't paste part of the block: on Nov. 10, 2026 a paste after the first
  `</style>` replaced the live stylesheet too and left the header unstyled.
