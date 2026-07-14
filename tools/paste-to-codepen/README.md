# Paste to CodePen

A standalone utility (not a VPM widget) for taking HTML/CSS/JS output from a chatbot and opening it directly in a new CodePen, without saving files locally first.

## Usage

Open `index.html` in a browser (or via GitHub Pages). Paste HTML, CSS, and JS into the three panes, optionally set a title, then click **Open in CodePen** or press ⌘/Ctrl+Enter. It POSTs to the [CodePen Prefill API](https://blog.codepen.io/documentation/prefill/) with `target="_blank"`, so nothing is uploaded anywhere except CodePen itself.

Live: `https://mhdesigns98.github.io/vpm-widgets/tools/paste-to-codepen/`

## Notes

- Must be served over `http(s)://`, not opened as a `file://` URL — browsers block form POSTs from local files. GitHub Pages or any static server works.
- No build step, no dependencies. Single self-contained file.
- Complements the `/codepen` Claude Code skill, which sends *existing local files* to CodePen; this tool is for code you don't have saved anywhere yet.
