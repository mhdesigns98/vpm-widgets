#!/bin/sh
# Copy a vpm.org/voterguide header (Block 1) to the clipboard, ready for the CMS.
# One file per phase (see sections/PASTE-ORDER.md, "Header by phase"):
#   (default)  post-election  sections/post-election-header-section.html
#   --pre      pre-election   sections/header-section.html         (Important Dates calendar)
#   --results  election night sections/results-header-section.html (AP live results)
#
# Post-election: paste over everything AFTER the first </style> in the header Code Block
# and leave the live <style> alone (it has drifted from this repo copy). The clipboard
# gets the post-election CSS in its own <style>, then the hero, Key results and nav.
# Pre and results: these copy the whole file, stylesheet included, and replace the
# whole block, as they were pasted originally.
#
# Add --print to print instead of copying, or --preview to copy a console snippet that
# previews it on the live page (tools/preview-on-live). Flags combine: --pre --preview.
cd "$(dirname "$0")" || exit 1
phase=post mode=copy
for a in "$@"; do
  case "$a" in
    --pre) phase=pre ;;
    --results) phase=results ;;
    --post) phase=post ;;
    --print) mode=print ;;
    --preview) mode=preview ;;
    *) echo "Unknown option: $a (use --pre, --results, --post, --print, --preview)" >&2; exit 1 ;;
  esac
done
case "$phase" in
  pre) file=sections/header-section.html ;;
  results) file=sections/results-header-section.html ;;
  post) file=sections/post-election-header-section.html ;;
esac
if [ "$phase" = post ]; then
  out=$(python3 - "$file" <<'EOF'
import sys
s = open(sys.argv[1], encoding='utf-8').read()
css = s[s.index('  /* Post-election outcomes panel'):s.rindex('</style>')]
markup = s[s.index('<div class="vpm-vg vg-header">'):].strip()
print('<style>\n' + css + '</style>\n\n' + markup)
EOF
  ) || exit 1
  where="Paste over everything after the first </style> in the header Code Block."
else
  out=$(cat "$file") || exit 1
  where="Paste it as the whole header Code Block, replacing what's there."
fi
if [ "$mode" = print ]; then printf '%s\n' "$out"; exit 0; fi
if [ "$mode" = preview ]; then
  printf '%s\n' "$out" | node ../../tools/preview-on-live/preview-on-live.mjs || exit 1
  echo "Live page: https://www.vpm.org/voterguide/"
  exit 0
fi
printf '%s\n' "$out" | pbcopy && echo "Copied the $phase header ($(printf '%s' "$out" | wc -c | tr -d ' ') characters). $where"
