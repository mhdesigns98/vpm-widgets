# ship-lint

The mechanical half of `/ship`. It reads a build's pasted files and checks the `SHIP-CHECKLIST.md`
items that need no browser, so `/ship` spends its time on the checks that do need a browser or a judgment call. Node only, no dependencies.

```bash
node tools/ship-lint/ship-lint.mjs <slug|path> [--prefix vpm-x-] [--json]
```

Exit `0` = no fails, `1` = fails, `2` = usage error. A **fail** blocks shipping. A **warn** is a
lead: something `/ship` has to look at and decide. A pass covers only what a file scan can
see; it never replaces the browser checks.

## What it reads

The files that get pasted, by shape: `html*.html` + `css` + `js.js` (ACF split), `sections/*.html`
(sections), or `index.html` (single). Previews, `demo/` and `reference/` are skipped. Stub folders
(README title says merged/moved) exit 0. The namespace comes from `--prefix`, then the build's
`INDEX.md` row (`namespace \`vpm-x-\``), then the `vpm-*` classes in its CSS. A build in a shadow
root, or one the README calls an **iframe embed**, can't style the host page, so scoping and
`id` checks are skipped for it.

## Checks

| Check | Group | Fails on | Warns on |
|---|---|---|---|
| `unscoped-selector` | Core | a selector with no namespace class (`p`, `*`, `:root`, `.card`) | an allowed host override |
| `hex-outside-token` | Core | a hex outside a `--custom-property`, inline styles included | a hex used only as a `var()` fallback |
| `rem-unit` | Core | any `rem`, custom properties included | |
| `img-alt` / `iframe-title` | Core | `<img>` without `alt`, `<iframe>` without `title` | |
| `heading-order` | Core | a heading level that skips (h2 → h4) | |
| `reduced-motion` | Core | keyframes, smooth scroll or WAAPI with no `prefers-reduced-motion` | transitions with no query |
| `inline-font-size` | Core | | `em`/`span`/`strong`/… with no rule setting its font-size |
| `dated-content` | Core | | a past date or "TBD" in visible text |
| `external-stylesheet` | Core | `<link rel=stylesheet>` or `@import` | Google Fonts |
| `id-attribute` | Widget | any `id` | |
| `page-wide-query` | Widget | | `document.querySelector…` (scope to the container) |
| `third-party-script` | Widget | a bare `<script src>` | injected scripts with no `script[src]` guard |
| `relative-css-url` | Widget | relative `url()` in a single-file widget | |
| `jump-link` | Page | `href="#x"` with no `x` in the build, its consumed widgets or README | anchors supplied by a widget or the README |
| `paste-order` | Page | missing `PASTE-ORDER.md`, or a section file it doesn't list | |
| `consumed-widget` | Page | a `Uses widget:` line naming a folder that doesn't exist | |

Not covered here (the browser and judgment checks in `/ship`): hostile-host CSS, 320px and tap
targets, keyboard and focus, contrast, console errors, the CMS harness scenarios, and drift
between a page's widget copy and `widgets/`.

## Deliberate host overrides

When a build styles host markup on purpose (the voter guide's live-block overrides, for example), mark it
in the CSS. Allowed hits become warns, so `/ship` still reviews them.

```css
/* ship-lint: allow unscoped-selector */
section.page-article-grid { … }

/* ship-lint: allow unscoped-selector start */
…several rules…
/* ship-lint: end */
```

## Adding a check

When `/ship` catches something a file scan could have caught, add it here rather than only to
the checklist: one `run()` plus its `add()` calls, a row in the table above, and a run over every
build (`for d in widgets/*/ pages/*/; do node tools/ship-lint/ship-lint.mjs ${d%/}; done`) to make
sure it doesn't flood old builds with false positives.
