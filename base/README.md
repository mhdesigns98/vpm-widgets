# VPM Base Layer

Shared atoms for widgets deployed as **ACF Code Blocks** on vpm.org. Pasted once per page
instead of re-pasted inside every block.

## Why this exists

Every VPM widget ships as paste-into-a-Code-Block: `html.html` → HTML field, `css.css` → CSS
field, `js.js` → JS field. Because each block instance carries its own CSS, the same button,
eyebrow, badge, reset, and token declarations were being re-pasted on every page. Measured
across `widgets/*/` before this layer existed:

- 6 widgets redeclared the core brand colors locally; **zero** referenced `/tokens.css`
- `elections-2026-primary` and `vpm-banner` hard-coded hex values outright
- the scoped `box-sizing` reset appeared near-verbatim in 4+ widgets
- 3 button classes were identical but for background color
- `prefers-reduced-motion` was honoured in **1** of 6 split-file widgets
- there was no consistent focus ring

## The three tiers

| Tier | What it is | Where it lives |
|---|---|---|
| **Atoms** | Buttons, eyebrows, badges, media frames, cards, the accent bar, the focus ring, reduced-motion | `base/` — this folder |
| **Molecules** | Named compositions of atoms (card, CTA row, form row). Documented below as canonical markup, not shipped as files — a Code Block has no include mechanism | this README |
| **Organisms** | The widgets themselves | `widgets/*/` |

## Paste order

Into the **first Code Block on the page**, in the CSS field, top to bottom:

1. `base/reset.css`
2. `base/tokens.css`
3. `base/atoms.css`
4. …then that block's own `css.css`

Every later Code Block on the same page pastes **only** its own `css.css`.

Then add `vpm-ui` to each widget's root element, alongside its namespace class:

```html
<div class="vpm-ui vpm-elec26cta">
```

Three pastes rather than one is deliberate: a single concatenated `base.css` would be a fourth
copy of the same rules that silently drifts from its sources, and there is no build step here to
regenerate it.

## Rules for widget authors

**A widget may not define its own** button, eyebrow, badge, focus ring, or reduced-motion block.
If you need a variant, add a modifier to the atom in `base/atoms.css` — do not add a private
class to your widget's `css.css`.

**A widget's own CSS may override an atom's colour. It may not override an atom's box model or
its motion.** Padding, border-radius, transition timing, and focus behaviour stay consistent
across the site; brand colour per context does not.

**Atoms carry appearance only.** No layout, no positioning, no width. Where an atom sits is the
organism's business — that stays in the widget's `css.css`.

**Scoping.** Every rule in this folder starts with `.vpm-ui`. Nothing here can reach the host
page. If you add a rule that doesn't start with `.vpm-ui`, it is a bug.

**Tokens are scoped to `.vpm-ui`, not `:root`.** The canonical `/tokens.css` declares on `:root`
*and* styles bare elements (`html, body, h1, p, a`) — pasting that into a Code Block would
restyle the entire host page. `base/tokens.css` is a paste-sized subset with that hazard removed.
It is a **derived file**: change `/tokens.css` and re-derive, never hand-edit a value here.

## Molecules

Canonical compositions. Copy the markup; don't invent a parallel structure.

**CTA row** — one primary action, optional secondary:

```html
<div class="vpm-yourns__actions">
  <a class="vpm-btn vpm-btn--accent" href="#">
    Read more
    <span class="vpm-btn__arrow" aria-hidden="true">→</span>
  </a>
  <a class="vpm-btn vpm-btn--bare" href="#">All coverage</a>
</div>
```

**Media card** — image over copy:

```html
<article class="vpm-card">
  <figure class="vpm-media">
    <img class="vpm-img" src="" alt="">
  </figure>
  <div class="vpm-yourns__card-body">
    <p class="vpm-eyebrow vpm-eyebrow--red">Politics</p>
    <h3 class="vpm-h3">Headline goes here</h3>
    <p class="vpm-body-sm">Standfirst.</p>
  </div>
</article>
```

**Dark panel** — `.vpm-on-dark` is what inverts the type atoms; without it headings and body
copy stay dark and vanish into the panel:

```html
<div class="vpm-panel-dark vpm-on-dark vpm-yourns__panel">
  <p class="vpm-eyebrow">2026 Primary</p>
  <h2 class="vpm-h2">Heading</h2>
  <p class="vpm-body vpm-measure">Body copy.</p>
  <a class="vpm-btn vpm-btn--accent" href="#">Go</a>
</div>
```

## Atom reference

| Class | Modifiers |
|---|---|
| `.vpm-btn` | `--solid` `--accent` `--yellow` `--outline` `--icon` `--bare`; `.vpm-btn__arrow` for the glyph nudge |
| `.vpm-eyebrow` | `--dark` `--red` `--light` `--white` (default is yellow) |
| `.vpm-badge` | `--invert` `--live` `--accent` |
| `.vpm-media` | `--portrait` `--square` `--rounded`; set `--vpm-aspect` inline for anything else |
| `.vpm-img` | — (standalone carries 16/9; inside `.vpm-media` it fills the frame) |
| `.vpm-card` | `--flat` `--dark` `--muted` |
| `.vpm-panel-dark` | pair with `.vpm-on-dark` |
| `.vpm-accent-bar` | — (the blue/yellow/red 3-stripe rule) |
| Type | `.vpm-h1`–`.vpm-h4` `.vpm-display` `.vpm-body` `.vpm-body-lg` `.vpm-body-sm` `.vpm-caption` `.vpm-measure` |
| Utility | `.vpm-visually-hidden` `.vpm-on-dark` |

## Known exceptions — widgets the base layer cannot reach

**Shadow DOM widgets** — `watch-page-header`, `youtube-shorts-embed`, `basics-virginia`,
`vpm-morning-monitor-popup`. Shadow roots do not inherit page-level stylesheets by design, so
these keep their own copies of the atoms. This is accepted, not a backlog item.

**`ap-election-results`** — wraps AP's iframe and loads AP's external resizer. Its sizing is
dictated by a third party; a generic media frame fights it.

**Brightspot embeds** — `ecp-partners-team`, `annual-report-2025`, `how-federal-funding-works`,
`impact-testimonial`. Different CMS, different constraints. Out of scope.

## Verification

Beyond the standard Pre-Ship Checklist in `/CLAUDE.md`, every widget migrated onto this layer
must also pass:

- **Base absent** — renders as readable, coherent, unstyled-ish content rather than collapsing.
  Editors will forget the base paste.
- **Base pasted twice** — visually identical to once. (All three files are pure declarations
  with no `@keyframes` and no `@import`, so double-paste is inert by construction. Re-check this
  if you ever add either.)
- **Two widgets, one base paste** — no cross-contamination between them.
