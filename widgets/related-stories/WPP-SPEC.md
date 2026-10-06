# Related Stories in the article sidebar — spec for WPP

*From VPM Digital (Mark Hayes), 2026-10-06*

## What we're asking for

A "Related stories" list in the article sidebar (`aside.ArtP-aside`) on every article page, built server-side in the `wpp-base` theme. It should show the 4 VPM stories most related to the current article and stay sticky while the reader scrolls the top half of the article. The 300×600 ad then takes over the sticky slot for the bottom half.

A working client-side prototype is on staging now as a Custom HTML widget. Its sidebar title reads "Related Posts – test":
https://stg-vpmnews-staging.kinsta.cloud/news/2026-08-10/va-constitution-abortion-ivf-birth-control-family-planning-fertility-healthcare/

The prototype source (`index.html` in this folder) is the reference for behavior and ranking. **We want it moved into the theme because it's slow.** It makes about 6 REST requests from the browser in 3 rounds. None of them are cached: every response is `x-kinsta-cache: BYPASS` / `cf-cache-status: DYNAMIC`. The list fills in about 4s after page load on staging, and an estimated ~1.2s after page load on production.

## Behavior

**Where it shows:** every single-article template, including standard posts and NPR stories (`npr_story_post`).

**What it lists:** 4 standard posts (VPM's own stories), never the current article, and never NPR content. "NPR content" means any post that matches one of these:
- the NPR News category (867),
- the NPR News, Morning Edition or NPR Article tags (1058, 1057, 1055),
- a permalink under `/npr-news/`. A few NPR imports carry neither the category nor the tags.

**Ranking:**
1. Take the current article's tags, minus format/source/scope tags that don't describe topic: 1058, 1057, 2114, 1055, 1054, 905, 1740, 881, 962, 930, 967, 921, 897, 919, 966. These are NPR News, Morning Edition, NPR, NPR Article, Article, VPM Daily Newscast, VPM News Video, National, Announcements, Human Interest, Special Reports (×2), Analysis, Pressroom and Local News Feature. Show/series tags such as Un-Wine'd and Focal Point are kept on purpose.
2. Pick the 5 most specific of the remaining tags, meaning the lowest post count. Get the 8 newest eligible posts for each.
3. Score each candidate by the sum, over the tags it shares with the article, of `log(20000 / tag_count)²`. The square makes one specific match outrank several broad ones. For example, "Abortion" (62 posts) beats "Elections" (801) plus "Health" (1,049).
4. Sort by score, with newest first breaking ties, and keep 4.
5. If that yields fewer than 4, fill the rest with the newest eligible posts from the article's most specific (lowest-count) non-NPR category.
6. If there are still none, output nothing: no empty box and no heading.

**Display:** a heading ("Related stories"), then a list of headline links, each with its date (for example, "Oct 6, 2026"). Feel free to reuse the theme's existing sidebar list styles (`.ListB` / `.PromoLink`) rather than the prototype's CSS. VPM brand tokens are in the Widget Lab `tokens.css` if needed. Accessibility requirements: a labelled `<aside>` or section, real `<a href>` links, a visible focus style, and WCAG 2.1 AA contrast.

**Sticky, desktop only (≥768px):**
- Today, `article.css` makes `.ArtP-aside-content > :nth-child(2)` sticky, which is the ad. The prototype has to override that with `:has()` selectors, which breaks if widget order changes. A theme-level version should target the ad and the related list explicitly.
- Desired result: the related list sticks at `top: 20px` through roughly the top half of the article, then scrolls away, and the ad sticks for the rest. The prototype does this by giving the related list's wrapper `flex: 0 0 50%` of the aside column and making the list sticky inside it.
- Below 768px: nothing sticky, and the list stacks normally.
- Nothing after the sticky ad should be overlapped by it. Staging's "Most Popular Stories" widget currently scrolls over the stuck ad. We're removing that widget, but the theme rule should account for it.

**Caching:** cache the computed list per post, for example in a transient keyed by post ID with a TTL of 15–60 minutes, or in the object cache. It doesn't need to be instant when new stories publish.

## Separate, smaller ask

Could public, unauthenticated `GET /wp-json/wp/v2/*` responses be edge-cached at Kinsta/Cloudflare, even briefly (1–5 minutes)? Today they all bypass cache. Measured per-request time is 0.27–0.49s on production and 0.6–2.3s on staging. Other VPM widgets read the REST API too.

## Acceptance checks

- On the staging example article above, the list shows the constitutional-amendment / ballot-question stories, not generic Elections or Health stories.
- On an NPR story, for example https://stg-vpmnews-staging.kinsta.cloud/npr-story/the-first-day-of-school-bells-bikes-buses-and-big-feelings/, it lists VPM stories (school coverage), and no `/npr-news/` links appear.
- Links are present in the page HTML, with no client-side fetch.
- Desktop: the list is sticky for the top half of the article, then the ad is sticky for the rest, with no overlap. Mobile: nothing is sticky.
- An article with no usable tags or categories shows no related box.

## Questions for WPP

1. Would you build this as a template part in the theme, or as a block or widget the team can place?
2. What's a realistic timeline? Until then, the client-side prototype stays on staging only.
3. Is the REST edge-caching change possible on your side, or does it need a request to Kinsta?
