---
description: Give a direct share link for a widget or page build. Usage: /share [slug] [note]. The link opens a page that explains what it is, where it goes, and shows the preview at desktop/tablet/mobile width.
---

Produce a link that can go straight to someone who has never seen the Widget Lab: a coworker,
an editor, a stakeholder. It opens `share/` in this repo, a context page (title, one-line
summary, where it'll be deployed, a "not live" badge, and an optional note) wrapped around the
live preview, at wide/desktop/tablet/mobile width. They don't need to find anything in the gallery.

**Arguments:** $ARGUMENTS

## Step 1: Work out what's being shared

The first word of `$ARGUMENTS` is a slug. Anything after it is the note for the viewer.

- If `widgets/<slug>/` exists in this repo, it's a widget: `?w=<slug>`.
- If it's a page build in `vpm-pages` (`~/Projects/vpm/vpm-pages/pages/<slug>/`, or the sibling
  checkout), use `?p=<slug>`. Page links still go through this repo's `share/` page. Both repos
  publish on the same GitHub Pages origin, so one viewer serves both.
- No slug: infer it from the current directory or the folder you've just been working in. If it
  could be more than one, ask.

## Step 2: Check it will actually load

GitHub Pages publishes `main` only. A folder that exists only on a branch or an open PR gives the
viewer a "Preview not found" page.

```bash
git fetch -q origin main && git ls-tree -d origin/main widgets/<slug>   # or pages/<slug> in vpm-pages
```

If it isn't on `origin/main` yet, say so plainly. Don't hand over a link that will 404. Offer to
send the link once the PR is merged. Also check that the folder has a `README.md`, because its
H1 and first sentence become the title and summary people see. If the first sentence is internal
shorthand (namespaces, "imported from…"), suggest a plain-language rewrite rather than shipping it.

## Step 3: Build the link

```
https://mhdesigns98.github.io/vpm-widgets/share/?w=<slug>
https://mhdesigns98.github.io/vpm-widgets/share/?p=<slug>
```

Optional parameters:

- `&note=<text>`: URL-encode it. Use it for what you want from the viewer, e.g. "Feedback on the
  mobile layout by Friday."
- `&view=wide` (1920px), `desktop` (1280px, the default), `tablet` (768px) or `mobile` (390px):
  the width the preview opens at. It renders at that true width, so the widget's own breakpoints
  apply, and scales down to fit smaller screens. Use it when the note is about one width.

Output the link on its own line, ready to paste, with a one-line summary of what the viewer will
see. Don't open a PR or commit anything for this command.
