# Related Stories

Article-aside widget that lists 4 recent vpm.org stories sharing a tag with the current article, topped up from the article's most specific category when tags don't yield 4. It stays sticky in the aside on desktop for the top half of the article, then hands the sticky slot to the 300×600 ad for the bottom half. Data comes from the site's own WordPress REST API, found via the `<link rel="https://api.w.org/">` WordPress prints in `<head>` (so staging uses staging's API). The current item comes from the `<link rel="alternate" type="application/json">` link, which works for any post type, including NPR stories (`npr_story_post`); the `postid-NNNN` body class is the fallback.

**Deploy target:** WordPress Code Block (Custom HTML widget) in the article sidebar, installed once, runs on every article. Single file: paste everything between the `Paste from here` / `End paste` comments in `index.html`.

**Placement matters:** put it **2nd** in the article aside, directly **above the ad** (signup → Related Stories → ad). The theme makes the aside's 2nd widget sticky (`.ArtP-aside-content > :nth-child(2)` in wpp-base `article.css`); the block's `<style>` overrides that so its own wrapper takes half the aside and the widget after it (the ad) gets the sticky rule. If the ad isn't directly after it, the ad won't stick. If the theme's aside markup or that rule changes, re-check the hand-off.

**Behavior:**
- Runs on every article type (VPM posts and NPR stories), but results are **VPM stories only**: standard posts, excluding the NPR News category (867), the NPR News / Morning Edition / NPR Article tags (1058, 1057, 1055), and any `/npr-news/` URL (a few NPR imports carry neither marker). It fetches 8 and keeps 4 so the URL filter can't leave it short.
- Format/source tags that match nearly everything (NPR News, Morning Edition, Article, VPM Daily Newscast, NPR) are ignored for matching; list is `IGNORE_TAGS` in the script.
- Loading shows 4 placeholder bars. No results, no post ID, or any API error → the block hides itself (and the ad gets the space back); errors log a `[vpm-rel]` console warning.
- Mobile (< 768px): not sticky, stacks in the aside below the article.
- Off WordPress (Widget Lab preview, CMS harness) it previews against vpm.org post 490549 using live API data; vpm.org's API allows cross-origin reads.
- Leave the WordPress widget's **Title** field empty; the block has its own "Related stories" heading.

**Namespace:** `vpm-rel-`
