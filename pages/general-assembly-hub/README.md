# General Assembly hub

A standalone General Assembly landing page for vpm.org: session status, key dates, live coverage,
who's in charge, the bills VPM News is watching, explainers, a glossary and quick links. It
replaces the category archive as the main GA landing page, the way vpm.org/elections replaced the
Elections archive. The archive stays up as "All General Assembly coverage".

**Live URL:** https://www.vpm.org/general-assembly/ (not live yet)
**Shape:** sections. **Paste order:** `sections/PASTE-ORDER.md`.
**Newsroom editing guide:** `EDITING.md`.
**Namespace:** `vpm-gahub-` for new sections. Blocks 1 and 9 are copies from
`pages/general-assembly/` and keep its namespaces (`vpm-gahdr-`, `vpm-gares-`).
**Requirements:** `BRIEF.md`. The build prompt is in `HUB-PROMPT.md`.

## Copies of pages/general-assembly blocks

`01-header.html` and `09-resources.html` are copies, so the category archive keeps its own H1 and
resources module. The header copy differs only in its "On this page" links. When you change the
styles, script or links in one, change the other: `grep -rl vpm-gahdr pages/` and
`grep -rl vpm-gares pages/` find both. If the resources module goes on a third page, promote it
to `widgets/`.

Uses widget: newsletter-signup-embed
Uses widget: news-tips-cta

## Open before launch

- **From the Capitol** (block 6): Shaban Athuman's photo updates aren't on the live category page,
  so it's unknown whether they're a live block or static markup.
- Placeholders: crossover, sine die and reconvened session dates; the session end date for the
  status line; seat counts and leaders; bill rows (delete the three SAMPLE rows); two explainer
  story URLs; the "Status last updated" date.
- Fact-check the glossary definitions (block 8) and the key-date explanations (block 2).
