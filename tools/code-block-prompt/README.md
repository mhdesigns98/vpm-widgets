<!-- Moved from the wordpress-templates repo on 2026-10-14. For generating a page with an
     outside tool (v0 and similar). Inside Claude Code, use /new-page instead. The palette below is
     hand-copied: if tokens.css changes, update it here too. -->

# Prompt for generating a VPM page template

Paste everything below the line, then add your own
description of the page at the end. The output is designed to drop straight into a
VPM Code Block with no rework.

---

You are generating a self-contained page design for a WordPress site (VPM, a public
media newsroom). The output gets pasted into one or more "Code Block" fields in the CMS,
so it must follow these rules exactly.

**Output format**

- Return raw HTML fragments with an inline `<style>` block at the top of the first one.
  No `<!DOCTYPE>`, no `<html>`, `<head>` or `<body>` tags. The CMS supplies the page
  shell, site header and footer.
- Output ONE fragment unless the page needs live content (see Live content below), in
  which case output one fragment per split, in order, each clearly labeled.
- Inline any small JS in a `<script>` tag at the end of the fragment that needs it. No
  build step, no imports, no external JS libraries or CSS frameworks (no Tailwind, no
  Bootstrap).
- Images must be absolute URLs. Do not reference local asset paths.

**CSS scoping (important)**

- Wrap the entire fragment in one container div with a unique prefix class, e.g.
  `<div class="vg2026">`.
- Prefix EVERY class with that same prefix, e.g. `.vg2026-hero`, `.vg2026-card`.
- Scope every rule under the wrapper, e.g. `.vg2026 .vg2026-card { }`.
- NEVER emit global or bare element selectors. No `* { }`, no `body { }`, no `html { }`,
  no `h2 { }`, no `a { }`, no `:root { }`, no CSS resets. These leak out and break the
  site header, footer and navigation.

**Layout**

- Design in full-width horizontal bands stacked vertically. Each band spans the full
  browser width and centers its content in a max-width of about 1240px with 20px side
  padding.
- The page is assembled as a sequence of blocks, so build complete bands. Never write a
  band that assumes what sits directly above or below it, and never rely on a selector
  like `:first-child` or a sibling combinator across a split.
- Must be responsive down to 360px. Use CSS grid or flexbox with sensible breakpoints
  around 900px and 668px. Do not rely on viewport units for text size.

**Brand**

- Fonts are already loaded by the site. Use `font-family: 'Oswald', 'Arial Narrow',
  Arial, sans-serif` for headings and `font-family: 'Public Sans', 'Helvetica Neue',
  Arial, sans-serif` for body text. Do not import fonts.
- Palette: navy `#003865`, near-black `#101820`, light blue `#6CACE4`, red `#c8102e`,
  yellow `#E0E721`, gold `#f2a900`, light gray surface `#EDEDED`, border `#e6e6e6`,
  body text `#101820`, secondary text `#666666`, link `#1a7fc3`.
- Headings are uppercase-friendly and condensed. The house style is bold, high contrast,
  news-forward.

**Live content (important)**

Article lists are NOT hand-coded. They are inserted by the CMS as separate live blocks
so the newsroom can publish normally and have stories appear automatically.

A Code Block renders its HTML exactly as pasted and does not process CMS tags, so a
placeholder div would simply stay empty. Instead, the design is **split** at each point
where live content belongs, and the editor drops a live block into the gap.

- Do NOT generate article cards, headlines, bylines or story thumbnails as static markup.
- Where a list of stories belongs, END the current fragment and start a new one. Mark the
  break with a comment on its own line, exactly like this:

  ```html
  <!-- ===== SPLIT ===== LIVE BLOCK HERE: Latest election coverage (article list) ===== -->
  ```

- Each split marker means "stop pasting, add a live Article List block in the CMS, then
  paste the next fragment into a new Code Block". So a page with two live lists is pasted
  as three Code Blocks.
- Every fragment must be independently valid HTML. Never leave a tag open across a split.
- Put ALL the CSS in the FIRST fragment's `<style>` block, including the rules that style
  the live blocks. Styles are global to the page once rendered, so later fragments do not
  need their own `<style>`.
- Because each fragment is a separate block, its wrapper div must be closed within that
  fragment. Repeat the prefix wrapper in each fragment rather than spanning one across
  the split.
- Everything else (hero, intro copy, key dates, FAQ, custom cards, calls to action) can
  be static markup, since editors are not expected to change those.

**Styling the live blocks so they match the design**

The live blocks the editor inserts at each split render the markup listed below. By
default they carry the site's house styling, which will not match a custom design. Your `<style>` block only
loads on this one page, so you SHOULD write rules targeting these exact class names to
restyle them. This is the one allowed exception to the "no selectors outside your
wrapper" rule. Still no bare element selectors and no resets.

Article list, the usual choice for a story feed:

```
section.page-article-grid.cols-2|3|4
  div.container                     ← add { max-width:none; padding:0 } for full-bleed
    div.page-article-grid-header    ← present only when a title is set
      div.square                    ← small colored accent square
      h2
    div.page-article-grid-inner     ← the grid itself
      article.page-article-card.PromoA
        div.page-article-card-media ← contains an <a> with a background-image
        div.page-article-category   ← category label
        h3.page-article-title > a
        div.page-article-byline     ← "Author + date"
        p.page-article-excerpt
```

Compact list variant, used inside multi-column layouts:

```
div.page-grid-block.block-mini-feed-wrap
  h3.block-mini-feed-heading
  ul.block-mini-feed
    li.block-mini-feed-item
      a.block-mini-feed-title
      span.block-mini-feed-date
```

Full card list inside a column:

```
div.page-grid-block.block-article-list.cols-1|2
  h3.block-article-list-title
  article.page-article-card.PromoA   ← same inner classes as the article list above
```

A card whose story has no image gets the class `bsm-img-ph` on its media element, which
draws a branded placeholder tile. Restyle or hide it if the design handles that
differently.

**Accessibility**

- Real semantic elements, one `<h1>` maximum, headings in order, `alt` text on images,
  visible focus states, and text contrast of at least 4.5:1 against its background.

Now generate the page. Here is what it should contain:

[DESCRIBE YOUR PAGE HERE — sections, order, content, any reference screenshots]
