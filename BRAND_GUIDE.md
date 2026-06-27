# VPM Brand Guide

Reference for building VPM digital widgets and components. Use this when prompting Claude or starting a new widget.

Live visual version: [`brand-guide.html`](brand-guide.html)

---

## Colors

### Primary Brand Colors

| Name | CSS Variable | Hex | PMS | CMYK |
|---|---|---|---|---|
| Dark Blue | `--vpm-dark-blue` | `#003865` | PMS 2955 C | 100 60 10 53 |
| Light Blue | `--vpm-light-blue` | `#6CACE4` | PMS 284 C | 59 17 0 0 |
| Yellow | `--vpm-yellow` | `#E0E721` | PMS 388 C | 15 0 80 0 |
| Red | `--vpm-red` | `#EE2737` | PMS 1788 C | 0 88 82 0 |
| Black | `--vpm-black` | `#101820` | PMS Black 6 C | 75 68 67 90 |
| Grey | `--vpm-grey` | `#B2B4B2` | PMS 421 C | 13 8 11 26 |
| White | `--vpm-white` | `#FFFFFF` | — | — |

### Extended Blue Scale

| Name | CSS Variable | Hex |
|---|---|---|
| Blue 900 | `--vpm-blue-900` | `#002244` |
| Blue 800 | `--vpm-blue-800` | `#002E54` |
| Blue 050 | `--vpm-blue-050` | `#EEF4FB` |
| Blue 100 | `--vpm-blue-100` | `#D6E8F6` |

### Gray Scale (UI)

| Name | CSS Variable | Hex |
|---|---|---|
| Gray 600 | `--vpm-gray-600` | `#5A6470` |
| Gray 500 | `--vpm-gray-500` | `#7B8591` |
| Gray 300 | `--vpm-gray-300` | `#D1D3D4` |
| Gray 200 | `--vpm-gray-200` | `#E5E7E9` |
| Gray 100 | `--vpm-gray-100` | `#F2F3F4` |
| Gray 050 | `--vpm-gray-050` | `#F8F9FA` |

---

## Typography

### Typefaces

| Role | Family | CSS Variable | Notes |
|---|---|---|---|
| Brand / Display | GT America → Oswald (web) | `--font-display` | `'Oswald', Impact, sans-serif` |
| UI / Body | Inter | `--font-sans` | `'Inter', 'Helvetica Neue', Arial, sans-serif` |
| Print Fallbacks | Arial, Helvetica, Calibri, Times New Roman | — | Office/print environments only |

### Type Scale

| Token | Value | Usage |
|---|---|---|
| `--fs-h1` | `clamp(28px, 3.2vw, 44px)` | Page headlines (Oswald 700, uppercase) |
| `--fs-body` | `16px` | Body copy (Inter 400) |
| `--fs-sm` | `14px` | Supporting text, card descriptions |
| `--fs-eyebrow` | `13px` | Eyebrow labels (Inter 700, uppercase, tracked) |
| `--fs-xs` | `12px` | Captions, metadata, fine print |
| `--tracking-eyebrow` | `0.12em` | Letter-spacing for eyebrow labels |

### Type Hierarchy

| Level | Font | Size | Weight | Treatment |
|---|---|---|---|---|
| Display / H1 | Oswald | `--fs-h1` | 700 | Uppercase |
| Section Title | Oswald | 20px | 700 | Uppercase, `letter-spacing: 0.06em` |
| Card Title | Oswald | 17px | 700 | Uppercase, `letter-spacing: 0.04em` |
| Body | Inter | 16px | 400 | `line-height: 1.45` |
| Small / Desc | Inter | 14px | 400 | `color: --vpm-gray-600` |
| Eyebrow | Inter | 13px | 700 | Uppercase, `letter-spacing: 0.12em`, yellow on dark |
| Caption / XS | Inter | 12px | 400 | `color: --vpm-gray-500` |
| Button Label | Inter | 10px | 700 | Uppercase, `letter-spacing: 0.08em` |

---

## Voice & Tagline

**Primary tagline:** `EDUCATE. ENTERTAIN. INSPIRE.`

- Always three words, each ending with a period. Never truncate.
- All caps when set in Oswald/display type.
- Eyebrow labels: "VPM News" — yellow, uppercase, `letter-spacing: 0.12em`.
- Brand voice: direct, local, public service. Avoid corporate jargon.
- CTAs: strong imperatives — *Keep Me Informed*, *Watch Live*, *Read More*.

---

## Accent Bar

A 5px horizontal stripe placed at the very top of pages and components. Light Blue → Yellow → Red in equal thirds.

```css
.accent-bar {
  height: 5px;
  background: var(--accent-bar);
}

--accent-bar: linear-gradient(90deg,
  var(--vpm-light-blue) 0%,   var(--vpm-light-blue) 30%,
  var(--vpm-yellow)     30%,  var(--vpm-yellow)     70%,
  var(--vpm-red)        70%,  var(--vpm-red)        100%);
```

Never scale to taller heights — it reads as decoration, not a banner.

---

## Texture, Pattern & Overlays

| Pattern | Description | Usage |
|---|---|---|
| Diagonal Lines | 45° white stripe texture at 20–30% opacity over brand colors | Background texture; subtle energy |
| Color Block Grid | Hard-edged quadrant splits using brand colors | Bold graphic moments |
| Speech Bubble Logo Mark | Irregular speech bubble containing VPM wordmark | On dark backgrounds only |
| Dark Overlay | Semi-transparent dark blue (`70–90% opacity`) over photography | Ensures text legibility on photos |
| Yellow Background + Border Frame | Yellow panel with black border frame, slight tilt | High-energy callouts |
| Stacked Type | Repeated tagline at ascending opacity levels | Brand moment; not a UI pattern |

---

## Spacing Scale

| Token | Value |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 48px |
| `--space-8` | 64px |

## Border Radius & Shadows

| Token | Value | Usage |
|---|---|---|
| `--radius-md` | `4px` | Cards, buttons, code blocks |
| `--shadow-sm` | `0 2px 6px rgba(16,24,32,0.08)` | Default card state |
| `--shadow-md` | `0 8px 24px rgba(16,24,32,0.12)` | Hover / elevated state |
| `--dur-fast` | `120ms` | Color, opacity transitions |
| `--dur-base` | `200ms` | Position, transform transitions |

---

## Component Conventions

| Rule | Detail |
|---|---|
| **Namespace** | All classes/IDs prefixed with widget slug: `vpm-elec26-`, `vpm-mm-` |
| **Naming** | BEM within namespace: `vpm-widget__element--modifier` |
| **Encapsulation** | Shadow DOM for reusable web components; scoped namespacing for simple embeds |
| **JavaScript** | IIFE-wrapped; no `document.write()`; no globals; vanilla JS only |
| **Self-Contained** | Single file (or ACF split set) must work in any CMS with no external CSS framework |
| **Accessibility** | WCAG 2.1 AA — semantic HTML, keyboard nav, `aria-label` on icon controls, `:focus-visible` |
| **Color on dark** | Body text: white. Secondary: `rgba(255,255,255,0.6)`. Yellow for eyebrows/interactive accents only. |
| **Reduced Motion** | Always include `@media (prefers-reduced-motion: reduce)` disabling transitions and hover transforms |
| **File Format** | Self-contained: `index.html`. ACF: `html.html`, `css.css`, `js.js`, `preview.html`. Always add `README.md`. |

---

## CSS Token Template

Paste into the `<style>` block of any new widget:

```css
:root {
  --vpm-dark-blue:  #003865;
  --vpm-light-blue: #6CACE4;
  --vpm-yellow:     #E0E721;
  --vpm-red:        #EE2737;
  --vpm-black:      #101820;
  --vpm-grey:       #B2B4B2;
  --vpm-white:      #FFFFFF;

  --vpm-blue-900: #002244;
  --vpm-blue-800: #002E54;
  --vpm-blue-050: #EEF4FB;
  --vpm-blue-100: #D6E8F6;

  --vpm-gray-050: #F8F9FA;
  --vpm-gray-100: #F2F3F4;
  --vpm-gray-200: #E5E7E9;
  --vpm-gray-300: #D1D3D4;
  --vpm-gray-500: #7B8591;
  --vpm-gray-600: #5A6470;

  --font-sans:    'Inter', 'Helvetica Neue', Arial, sans-serif;
  --font-display: 'Oswald', Impact, sans-serif;

  --fs-h1:      clamp(28px, 3.2vw, 44px);
  --fs-body:    16px;
  --fs-sm:      14px;
  --fs-xs:      12px;
  --fs-eyebrow: 13px;
  --tracking-eyebrow: 0.12em;

  --space-1: 4px;   --space-5: 24px;
  --space-2: 8px;   --space-6: 32px;
  --space-3: 12px;  --space-7: 48px;
  --space-4: 16px;  --space-8: 64px;

  --radius-md: 4px;
  --shadow-sm: 0 2px 6px rgba(16,24,32,0.08);
  --shadow-md: 0 8px 24px rgba(16,24,32,0.12);
  --dur-fast: 120ms;
  --dur-base: 200ms;

  --accent-bar: linear-gradient(90deg,
    var(--vpm-light-blue) 0%,   var(--vpm-light-blue) 30%,
    var(--vpm-yellow)     30%,  var(--vpm-yellow)     70%,
    var(--vpm-red)        70%,  var(--vpm-red)        100%);

  --border-default: var(--vpm-gray-200);
}
```
