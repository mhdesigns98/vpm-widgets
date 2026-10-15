# Build stamp

`/ship` adds three attributes to the root element of every HTML block it emits, so the live copy
can be traced back to the repo. `stamp.mjs` computes them; the drift check reuses its `hash()`.

```bash
node tools/drift-check/stamp.mjs <slug>             # from the repo root
node tools/drift-check/stamp.mjs <slug> --dry-run   # allows uncommitted changes, build="uncommitted"
```

| Attribute | Value |
|---|---|
| `data-vpm-build` | First 12 hex chars of the last commit touching the build folder (`git log -1 --format=%H -- <folder>`). The script refuses if the folder has uncommitted changes. Merges use `--merge`, not squash, so the commit stays on `main`. |
| `data-vpm-hash` | One `name:hash` pair per pasted part, joined with `;`. ACF-split: `html:…;css:…;js:…` (only the parts that exist). Sections and extra `html-*.html` files: one stamp per HTML file, each with its own `html` hash and the shared `css`/`js`. Single file: `block:…` for the whole `index.html`. Per-part hashes say which field was hand-edited. |
| `data-vpm-source` | `module` for widgets, `page` for page builds and for widgets whose README has a `Placement: pasted` line (per-page content, e.g. `feed-rail`, `live-updates-rail`). |

## Where it goes

- Only on the emitted blocks. Repo files stay unstamped, so the hash of a repo file equals the hash
  of its emitted, stamped copy.
- On the first element of the HTML block that isn't `<style>`, `<script>`, `<link>` or a comment,
  i.e. the build's namespaced root. For an iframe embed, that's the `<iframe>` (or its wrapper,
  if the block has one), never inside the framed document.
- Single-file blocks: the same root element, inside the one block.

## Hash

Input is one part's text (a repo file, or the matching live code). Normalize, in order:

1. Strip a leading BOM.
2. Convert CRLF and CR to LF.
3. Remove the stamp attributes: regex `\s+data-vpm-(?:build|hash|source)="[^"]*"`.
4. Strip trailing spaces and tabs from every line.
5. Trim leading and trailing whitespace from the whole text.

Then sha256 of the UTF-8 bytes, first 12 hex chars. Nothing else is normalized: indentation, blank
lines and attribute order all count, so a hand edit of any kind shows.

## Unverified

Whether WordPress outputs a Code Block or ACF field byte-for-byte. The drift check's first run
must calibrate: ship one stamped build, paste it, then hash the live copy. If the hashes differ,
find what WordPress changed and add that step to `normalize()` here, not in the drift check.
