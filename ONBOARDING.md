# Widget Lab: Developer Onboarding

Standalone HTML/CSS/JS embeds for VPM (vpm.org, Brightspot, WordPress ACF). Every widget must work when pasted into a CMS you don't control, twice on one page, next to hostile CSS.

- Repo: https://github.com/mhdesigns98/vpm-widgets
- Live previews: https://mhdesigns98.github.io/vpm-widgets/ (each widget at `/widgets/<name>/`)

## 1. Get running

```bash
git clone https://github.com/mhdesigns98/vpm-widgets.git
cd vpm-widgets
python3 -m http.server 8471
# widget preview:  http://localhost:8471/widgets/<name>/index.html
# CMS harness:     http://localhost:8471/harness/harness.html?widget=<name>
```

No build step, no package install.

## 2. Repo map

| Path | What it is |
|---|---|
| `widgets/<name>/` | One widget per folder. See shapes below |
| `tokens.css` | Canonical VPM design tokens (colors, type, spacing, radii, motion) |
| `BRAND_GUIDE.md`, `brand-guide.html` | Brand rules and usage |
| `INDEX.md` | Every widget and its purpose. Check it before picking a name |
| `harness/` | CMS stress harness (see section 5) |
| `CLAUDE.md` | Conventions and the pre-ship checklist (canonical) |

**Widget shapes**

- Single file: `index.html` (self-contained) plus `README.md`.
- ACF split: `preview.html`, `html.html`, `css.css`, optional `js.js`. Each of the last three is pasted into its own ACF field.

## 3. Rules that apply to every widget

1. **Namespace everything.** Every class and id starts with a widget-specific prefix (`vpm-elec26-`, `vpm-mm-`). Use BEM inside it. Check `INDEX.md` so your prefix doesn't collide.
2. **Self-contained.** No external CSS frameworks, no linked stylesheets, no libraries without explicit approval. Widgets ship as a single file or the split set.
3. **Tokens are copied, not linked.** Copy the custom properties you need from `tokens.css` into the widget's own scoped `<style>`. Never `<link>` it. No hard-coded hex values.
4. **Scripts:** IIFE-wrapped, no `document.write()`. Scope to your own container (for example `document.currentScript.previousElementSibling`), never a page-wide selector, so two copies on one page initialize independently.
5. **No `id` attributes** unless they can't duplicate when the block is placed twice.
6. **Third-party scripts** load once per page, guarded with a `querySelector` check.
7. **Accessibility:** WCAG 2.1 AA, keyboard operable, visible focus, `prefers-reduced-motion` respected.
8. **Local assets in CSS use absolute URLs.** A relative `url(...)` breaks when the harness injects markup instead of iframing it.

## 4. Brand quick reference

Source of truth is `tokens.css`. Do not invent values.

| Token | Value | Use |
|---|---|---|
| `--vpm-dark-blue` | `#003865` | Primary |
| `--vpm-light-blue` | `#6CACE4` | Secondary, accent |
| `--vpm-yellow` | `#E0E721` | Highlight |
| `--vpm-red` | `#EE2737` | Alerts, news pillar |
| `--vpm-black` | `#101820` | Text |
| `--vpm-grey` | `#B2B4B2` | Neutral |

- **Body font:** `--font-sans` = Public Sans (stand-in for GT America). Not Inter, not system-ui.
- **Display font:** `--font-display` = IBM Plex Sans Condensed. Cap weight at 700 (no 800 cut).
- **Corners are sharp:** 0 to 4px, 8px as the rare exception. Pills are for tags only.
- **Contrast trap:** `#EE2737` on `#003865` is 2.84:1 and white on `#EE2737` is 4.22:1. Both fail AA for small text. Use yellow or white for small text on dark blue, and keep red for large text, icons, and fills.
- Copy voice and tagline rules are in `BRAND_GUIDE.md`.

Reuse the canonical token names (`--font-sans`, `--font-display`) inside your widget's scope instead of inventing per-widget names, so the fleet stays greppable.

## 5. The CMS harness (required before shipping)

`harness/harness.html?widget=<name>` injects your widget the way the CMS does and throws problems at it: delayed hydration plus a detach and re-inject, a sticky stream player that steals focus, hostile host CSS, a click-intercepting overlay, a 320px column, and audits for duplicate ids, duplicate scripts, and cross-instance coupling. Modes: `mode=single|acf|auto`. Details: `harness/README.md`.

Known gap: widgets that fetch from a CORS-locked first-party API can't reach their success path on localhost. Verify those after deploy.

## 6. Pre-ship checklist

Copy this into your PR.

- [ ] Survives delayed hydration and one detach/re-inject (no double-init, listeners intact)
- [ ] No focus loss or overlap with the sticky Stream Player
- [ ] Styles fully scoped, unaffected by hostile host CSS
- [ ] CTAs clickable after the click interceptor clears
- [ ] Degrades gracefully at 320px
- [ ] Keyboard accessible, visible focus, AA contrast, reduced motion respected
- [ ] No duplicate `id`s when placed twice
- [ ] Scopes itself to its own container; two copies initialize independently
- [ ] Third-party scripts load once per page
- [ ] No console errors in the harness log
- [ ] Absolute URLs for local assets in CSS
- [ ] No hex values outside `tokens.css` values; no Inter, no system-ui stacks

## 7. Adding a widget

1. Pick a slug and CSS prefix after checking `INDEX.md`.
2. Create `widgets/<slug>/` in the single-file or ACF-split shape, with a one-paragraph `README.md` (purpose, source, usage).
3. Copy the tokens you need into the widget's scoped `<style>`.
4. Build, then run it through the harness and the checklist above.
5. Add a row to `INDEX.md`.
6. Open a PR. After merge, the preview appears at `https://mhdesigns98.github.io/vpm-widgets/widgets/<slug>/`.
7. Paste into the CMS only after the checklist passes.

## 8. Known drift to avoid

An audit on 2026-09-28 found these, now fixed or worth watching: a stray red (`#C8102E`) in the elections widget, Inter left over from before the Public Sans switch, per-widget font variable names, and system-ui stacks in a few shipped widgets. If you see `#C8102E`, `'Inter'`, or `-apple-system` in widget code, it is a bug.
