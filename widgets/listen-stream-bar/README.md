# Listen Stream Bar

Quick-access audio stream bar for the VPM **Listen** page. Sits directly below the page hero as a horizontal bar: a yellow uppercase eyebrow label ("Listen now") on the left, four stream/podcast buttons (News Stream, Music Stream, Podcasts, Music Archive) on the right, all on VPM dark blue with the 3-stripe accent bar (blue/yellow/red) along the top.

**Origin:** Replaces the old `.listen-page-header` block, which duplicated the hero's "Listen to VPM" H1 and used generic Material blues (`#1a237e`/`#0d47a1`). Rebuilt on VPM brand tokens with the redundant heading swapped for a functional eyebrow label.

**Deploy target:** WordPress — paste `index.html` into an HTML block below the Listen page hero.

**Usage notes:**
- Self-contained: VPM tokens are inlined in the scoped `<style>`; no external dependencies.
- Namespaced `.vpm-streambar__*` (BEM within namespace).
- **Swap the placeholder `href="#..."` anchors** for the real stream/podcast URLs before deploying.
- Responsive: buttons stack two-up under 800px; `:focus-visible` yellow outline for keyboard users; `prefers-reduced-motion` respected.
