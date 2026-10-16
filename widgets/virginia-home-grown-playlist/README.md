# virginia-home-grown-playlist (moved)

Moved to [`pbs-video-playlist/virginia-home-grown/`](../pbs-video-playlist/virginia-home-grown/)
on 2026-10-16. `index.html` here only redirects there, because the live
[VHG show page](https://www.vpm.org/shows/virginia-home-grown/) still iframes this URL.

The page's height listener keeps working through the redirect: it matches the iframe's `src`
attribute, which doesn't change, and the redirected page posts from the same origin.

Delete this folder once the VHG show page's code block is re-pasted with the new URL.
