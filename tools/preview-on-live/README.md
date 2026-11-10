# Preview on live

Try a CMS paste on the real vpm.org page before saving it in the CMS. The preview shows only in your own browser tab, and refreshing the page undoes it.

The tool turns a paste into a console snippet and copies it to your clipboard. Then:

1. Open the live page.
2. Open the console (Cmd+Option+J).
3. Paste the snippet and press Enter.

The block on the page is swapped for your paste. It renders with the real site CSS, the real CMS rows around it and the Stream Player, so it catches drift between the repo and the live page that a local preview can't.

The first time, Chrome asks you to type `allow pasting` before it accepts a paste in the console.

## Usage

```bash
node tools/preview-on-live/preview-on-live.mjs paste.html
some-copy-script --print | node tools/preview-on-live/preview-on-live.mjs
```

By default, the snippet replaces the live element that has the same classes as the paste's first top-level element. For example, `<div class="vpm-vg vg-header">` replaces `.vpm-vg.vg-header`. To replace a different element, pass `--replace "<css selector>"`. To print the snippet instead of copying it, pass `--print`.

For the voter guide header, a shortcut does both steps: `pages/voter-guide-2026/copy-voterguide-header.sh --preview`.

## Notes

- **Stand-in for the paste.** The snippet does what the paste would do. Any `<style>` and `<script>` tags land where they sit in the paste, and scripts run as fresh scripts. The live block's own `<style>` stays as it is.
- **Previewing again after an edit.** Rerunning the snippet works. Refresh the page first if you want a clean test of the scripts, because a rerun leaves the previous run's scroll listeners in place.
- **Not a substitute for `/ship`.** The preview checks how the paste looks on the real page, and that's all. `/ship` is still the gate before anything goes into the CMS.
- **New blocks.** A paste for a block that isn't on the page yet has nothing to replace. Use `--replace` to point it at the element it should take over.
