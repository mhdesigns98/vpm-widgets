# Preview on live

Try a CMS paste on the real vpm.org page before you save it in the CMS. The preview shows only in your own tab, and refreshing the page undoes it. It renders with the real site CSS, the real CMS rows around it and the Stream Player, so it catches drift between the repo and the live page that a local preview can't.

## Bookmark (two steps)

To install it, open `index.html` in Chrome and drag **Preview paste** to the bookmarks bar.

```bash
open -a "Google Chrome" tools/preview-on-live/index.html
```

Then, each time:

1. Copy the paste. For the voter guide header, run `vgcopy`.
2. On the live page, click **Preview paste**.

The first time, Chrome asks to let vpm.org see your clipboard. If the clipboard is blocked, a box opens so you can paste by hand. Your clipboard still holds the paste afterward, so it's ready for the CMS.

When `inject.js` changes, drag the bookmark from `index.html` again so it picks up the update.

## Console route (for `--replace`)

```bash
node tools/preview-on-live/preview-on-live.mjs paste.html
some-copy-script --print | node tools/preview-on-live/preview-on-live.mjs
```

The script copies a snippet. Open the live page, press Cmd+Option+J, paste it and press Enter. The first time, Chrome asks you to type `allow pasting` before it accepts a paste in the console. `--print` prints the snippet instead of copying it. For the voter guide header, `pages/voter-guide-2026/copy-voterguide-header.sh --preview` does all of this in one step.

## What it replaces

By default, it replaces the live element that has the same classes as the paste's first top-level element. For example, `<div class="vpm-vg vg-header">` replaces `.vpm-vg.vg-header`. The console route takes `--replace "<css selector>"` to point it at a different element. You need that for a block that isn't on the page yet.

## Notes

- **Stand-in for the paste.** It does what the paste would do. Any `<style>` and `<script>` tags land where they sit in the paste, and scripts run as fresh scripts. The live block's own `<style>` stays as it is.
- **Previewing again after an edit.** Rerunning works. Refresh the page first if you want a clean test of the scripts, because a rerun leaves the previous run's scroll listeners in place.
- **Not a substitute for `/ship`.** The preview checks how the paste looks on the real page, and that's all. `/ship` is still the gate before anything goes into the CMS.
- **One source.** `inject.js` holds the in-page code, and both routes use it.
