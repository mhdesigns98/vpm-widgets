# VPM Spotlight — Lead on Top

Content spotlight component: one full-width lead story (image left, dark-blue text panel right) over a two-card secondary row. Design variant of `vpm-spotlight-homepage/`, namespaced separately (`vpm-spotlight-lot`) so both can safely live on the same page.

Content is hardcoded HTML — no admin UI or JSON queue. Each item block is commented with copy-length guidance (headline, description, meta character limits) and swappable badge classes (`--video` / `--podcast` / `--article`). Update by editing `index.html` directly: swap images, badge text/class, section label, headline, description, meta, and arrow CTA text per item.

**Source:** Prototype "Option C: Lead on Top" from `vpm-web-tools-public/components/spotlight`, adapted to repo conventions (Oswald/Inter brand fonts, unique class namespace, `:focus-visible` states, `prefers-reduced-motion` support).
