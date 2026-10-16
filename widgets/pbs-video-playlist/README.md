# PBS Video Playlist

Episode playlist for a PBS show's vpm.org page: a PBS partner player above a strip of the five
newest episodes, autoplaying to the next. Data comes from the PBS Media Manager API through the
shared `pbs-api` Cloudflare Worker (`https://pbs-api.vpm-e01.workers.dev`). Every version is a
WordPress iframe embed. Any change to the playlist module lands in this folder.

One subfolder per production:

| Folder | What it is | Live on |
|---|---|---|
| [`template/`](template/) | Generic version (formerly `pbs-show-playlist`). Duplicate it for a new show. | Nowhere |
| [`virginia-home-grown/`](virginia-home-grown/) | Restyled to VHG's green sub-brand (formerly `virginia-home-grown-playlist`) | [VHG show page](https://www.vpm.org/shows/virginia-home-grown/) |

Merged into this folder on 2026-10-16. Each subfolder's README has its embed snippet.

## Adding a production

1. Copy `template/` to `<production>/` and set `SHOW_ID` (see the template README).
2. Give it its own namespace prefix and its own `postMessage` height key, so two playlists on one
   page don't resize each other's iframes. Check `INDEX.md` for prefix collisions.
3. Add a row to the table above and a file to this widget's entry in the gallery (`index.html`).

The versions are still full copies of one another. Once a third production arrives, merge them
into one shared build with a theme per production, the way `newsletter-signup-embed` does it.

## Old URL

`widgets/virginia-home-grown-playlist/` is now a redirect page, because the live VHG show page
still iframes that URL. Re-paste the VHG show page's code block from
[`virginia-home-grown/README.md`](virginia-home-grown/README.md), then delete the stub.
