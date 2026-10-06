# Related Stories

Article-aside widget that lists 4 recent vpm.org stories sharing a tag with the current article (falling back to the article's category), and stays sticky in the aside on desktop as the reader scrolls. Data comes from vpm.org's public WordPress REST API (`/wp-json/wp/v2/posts`), same-origin; the current post is identified from the `postid-NNNN` body class.

**Deploy target:** WordPress Code Block in the article widget template (installed once, runs on every article). Single file: paste everything between the `Paste from here` / `End paste` comments in `index.html`.

**Namespace:** `vpm-rel-`

**Status:** scaffold. See `BRIEF.md` for requirements and open questions. Run `/ship-widget related-stories` before deploying.
