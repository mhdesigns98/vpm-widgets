# Salvaged from `vpm-tools` — superseded, do not build on

Two June 2026 voter-guide artifacts found untracked in
`~/Projects/vpm/vpm-tools/tools/wordpress/` on 2026-08-06 and moved here so the material
lives with the project it belongs to. **Neither is the current build** — see `../../sections/`
for that.

| File | What it is | Why it's superseded |
|---|---|---|
| `voter-guide-embed.html` | Self-contained embed that fetches posts from the WP REST API by tag, driven by `VPM_VG_SITE` / `VPM_VG_TAG` / `VPM_VG_LIMIT` globals | Written for a **Gutenberg Custom HTML block**. The live theme (`wpp-base`) is classic ACF-driven with zero Gutenberg — see the host-environment notes in `../../README.md`. Also filters by **tag** `voter-guide`; the build filters by the **`elections` category** (id 871). |
| `voter-guide-section.php` | `[vpm_voter_guide]` shortcode for `functions.php` | Same tag-vs-category mismatch, and requires a theme edit. There is no child theme, so editing `functions.php` directly would be overwritten on theme update. |

## Worth salvaging

The REST-API query shape and the article-card markup in `voter-guide-embed.html` are still
a useful starting point for the outstanding **article-feed section** — the part of the build
that currently renders a dashed-border placeholder grid. Retarget it from tag to category
871 and render it inside an ACF `block-html` layout rather than a Gutenberg block.
