> **Migrated into the `vpm-pages` repo on 2026-08-06 (since merged into `vpm-widgets`).** Previously its own repo at
> `~/Projects/vpm/vpm-voter-guide-2026`, now archived at
> `~/Projects/archive/vpm-voter-guide-2026`.
>
> **Deploying:** this is a Vercel CLI-deployed project (not git-connected). The `.vercel/`
> link is tracked in git and came along with the move, so `vercel` run from **this
> directory** deploys to the same `vpm-voter-guide` project. Don't run it from the repo root.
>
> Two branches on `origin` preserve pre-migration state:
> `wip/voter-guide-video-section` (in-progress video section, unreviewed) and
> `archive/voter-guide-pre-migration`.

# VPM News Voter Guide 2026

VPM News' nonpartisan guide to Virginia's 2026 elections: important dates, key state and regional
races, video coverage, a voting FAQ and a newsletter signup, on one page.

Consolidation of the two previously separate projects (`vpm-voter-guide` and
`vpm-voter-guide-2026`) into one. See `BRIEF.md` for goals and the deploy deadline.

## Layout

```
sections/       canonical source — one ACF block-html fragment per page section
  PASTE-ORDER.md    paste order and the rules for placing them (read first)
preview.html    GENERATED from sections/ in paste order — run ./.build-preview.py after
                editing a fragment. What the share link and GitHub Pages preview show.
demo/           static demo, deploys to Vercel (https://vpm-voter-guide.vercel.app)
reference/      superseded material, kept for salvage — not the build
```

## Where the page actually lives

`https://vpmnews.kinsta.cloud/vpm-news-voter-guide/` (page id 466103), built with the theme's
**Section Builder** page template (`templates/section-builder.php`), using 8 `block-html`
layouts. All 7 fragments in `sections/` are already pasted there and verified present.

## Host environment (verified 2026-08-06)

- WordPress 7.0.2, theme `wpp-base`, **no child theme**
- **Classic ACF-driven theme — zero Gutenberg.** No `wp-block-*` in post content, no FSE.
  Anything assuming native WordPress blocks does not apply here.
- The theme inlines its own CSS; the only external stylesheet on the page is Google Fonts.
- Custom post types: `vpm_show`, `vpm_episode`, **`npr_story_post`**. Rank Math SEO.
- Categories: `elections` (id **871**, 311 posts), `news` (870), `npr-news` (867).

## Merge decisions

**`sections/` came from the old `vpm-voter-guide`, not from this project's PHP templates.**
The two projects shared no class vocabulary — the fragments use semantic `vg-` BEM, the PHP
template parts used utility classes. The fragments won on evidence: they are deployed and
verified on dev, and carry 242 selectors across 7 breakpoints versus 153 across 2 in
`reference/wordpress-php-template/assets/voter-guide.css`. The PHP version is less finished,
not leaner.

**All page CSS lives in one place: inside `sections/header-section.html`** (~35.5KB, 242
selectors). The other six fragments carry **zero CSS** by design. This is already consolidated
— it is *not* duplicated per block.

> **Fragility to be aware of:** because the stylesheet is bundled inside the header fragment,
> removing or reordering that block strips styling from the entire page. This is the main
> reason to ask the devs for a per-page CSS field (see below).

**`reference/_shared-styles.superseded.html` is dead code.** It is a strict subset of
`header-section.html` — all 234 of its selectors also appear there, none unique. Only the
header-section copy is live. Kept only for salvage.

**`reference/newsletter-api-form.superseded.html` is dead code.** An Aug 2026 elections
newsletter form that subscribed to Morning Monitor through newsletter-signup's `/api/subscribe`
with an `elections` Mailchimp tag. Moved here from `newsletter-signup/public/` (where it was never
committed) on 2026-09-25. The live form is `sections/newsletter-signup.html`, which posts straight
to Mailchimp. Don't revive the API version as written: `/api/subscribe` now only applies allowlisted
tags, so `elections` would be silently dropped unless it's added there first.

**`reference/wordpress-php-template/`** holds the old custom page template and template parts.
Not the path forward — the theme's Section Builder already does this job, and submitting a
competing page template to the vendor who owns the theme is a slow, low-odds request. Two
sections there have no fragment equivalent yet and are worth porting into `vg-` vocabulary:
`section-election-results.php` and `section-voter-resources.php`.

## Open asks with the theme devs

Theme deploys are vendor-gated. Do **not** ask for a child theme — `wpp-base` is already a
custom theme, and a child of it adds a layer without buying self-service.

1. Does a per-page or Customizer custom CSS mechanism already exist? If not, one enqueued
   stylesheet. Confirm whether the theme builds from LESS/SCSS and what the source path is —
   don't assume.
2. Does Section Builder already include an article-list layout? Request the ACF field group
   export.
3. Should an elections coverage feed include `npr_story_post` alongside `post`?
4. Read-only SFTP or git access to `wpp-base`.
