# Preferred Source (Google)

Inline CTA asking readers to add vpm.org as a **preferred source** in Google Search, so VPM stories
show up more in their Top Stories (and, if vpm.org is opted in to Search generative AI features in
Search Console, in AI Overviews and AI Mode). Built for article pages; used on many pages, so it's a widget.

**Deploy target:** WordPress ACF code block (split-file: `html.html` + `css.css`, no JS).
**Namespace:** `vpm-ps-`

## How it works

The button is a plain link to Google's source preferences tool, using the deeplink format from
Google's docs (https://developers.google.com/search/docs/appearance/preferred-sources):

```
https://www.google.com/preferences/source?q=vpm.org
```

Signed-out readers go through Google sign-in first, then land on the tool with VPM preselected.

**Why a link and not Google's JS button:** the official button loads `news.google.com/swg/js/v1/publisher.js`,
an external dependency, and adds the domain the page is served from. On staging that would be the Kinsta host,
which isn't an eligible source. The link hardcodes `vpm.org`, so it behaves the same on staging and production.
The same URL works in newsletters and social posts.

## Usage

- Paste `html.html` into the ACF HTML field and `css.css` into the CSS field.
- If the block appears twice on one page, rename `vpm-ps-title` in the second copy (it's an `id`).
- Layout follows the block's own width (container query): stacked under 560px, one row above.

Run `/ship preferred-source` before pasting into the CMS.
