# Theme questions — VPM News Voter Guide

Draft to send to the `wpp-base` theme developers. Questions first, requests second — several
of these may already be solved and just need pointing at.

---

**Subject:** Voter Guide page — four theme questions (needed before mid-September)

Hi —

I'm building out the VPM News Voter Guide page on the dev site
(`/vpm-news-voter-guide/`, page id 466103). It's assembled from `block-html` layouts in the
Section Builder template and is largely working. Four questions before I go further, mostly
to avoid asking you to build something that already exists.

Timing: we're aiming to have this live before early voting opens, so mid-September is the
date I'm working back from. Only #1 and #2 could affect that — #3 and #4 are whenever you
have a moment. If #1 turns out to need dev work on your side, I'd like to know sooner rather
than later so I can plan around your lead time.

**1. Custom CSS — is there already a way for me to update it myself?**

Right now the page's entire stylesheet (~35KB) is inlined inside one of the `block-html`
layouts. That works, but it makes the page fragile: if that block gets reordered or removed,
the whole page loses its styling.

Is there an existing mechanism for page- or site-level custom CSS — a field on the Section
Builder, an ACF options page, or Customizer Additional CSS? If something already exists, I'll
use it and there's nothing for you to do.

If not, could we add a stylesheet to the theme that I can send you updates for? Two things I'd
need to know: does the theme build its CSS from LESS or SCSS, and if so what's the source path?
I don't want to hand you compiled output if you have a build step.

I did notice the theme inlines its CSS rather than linking it, so if an external stylesheet
cuts against your performance approach, a per-page CSS field would work just as well for me.

**2. How configurable is the `page-article-grid` layout?**

I'm already using the article grid layout on the page (it renders as
`page-section page-article-grid cols-3`) and it's pulling stories correctly, so this is a
question about its options rather than a request to build anything.

What can it be filtered by — category, post type, tag, post count? I need it scoped to
elections coverage specifically. If there are fields for that I've missed in the editor, just
point me at them. A copy of the ACF field group export would also answer it.

**3. Which post types should an election coverage feed include?**

I see `npr_story_post` is a separate post type from `post`. For a feed of elections coverage
(category `elections`, id 871), should it include `npr_story_post` as well? And how do the
existing story listings elsewhere on the site handle that? I'd rather match what the site
already does than invent a different query.

**4. Could I get read-only access to the theme?**

Read-only SFTP or a git repo for `wpp-base` — not deploy access. Most of my questions above
come from having to infer how the theme works from rendered HTML. Being able to read the
templates would save us both a round trip on future work like this.

Thanks,
Mark

---

## Notes (not part of the message)

**Deliberately not asking for:**

- **A child theme.** `wpp-base` is already a custom theme; a child of it adds a layer without
  buying self-service, and vendors generally resist it.
- **A custom page template.** Both old repos had one
  (`reference/wordpress-php-template/page-templates/template-voter-guide.php`). The Section
  Builder already does this job, and submitting a competing template to the team that owns the
  theme is a slow request with low odds.

**#2 was largely answered by the audit** — the `page-article-grid cols-3` layout already exists
and is already live on the page rendering six real stories. The remaining question is only
whether it can be filtered to elections coverage. If it can't, v1 ships with the grid unfiltered
or a curated static list, so this doesn't block the deadline either way.

**Verified facts behind these questions** (from the public dev site, 2026-08-06): WordPress
7.0.2, theme `wpp-base`, no child theme, classic ACF-driven with zero Gutenberg, Section
Builder template, layouts in use are `block-html` / `block-button` / `block-file` /
`block-color` / `block-synced-color`.
