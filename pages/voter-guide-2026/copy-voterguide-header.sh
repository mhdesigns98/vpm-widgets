#!/bin/sh
# Copy a vpm.org/voterguide header (Block 1) to the clipboard, ready for the CMS.
# One file per phase (see sections/PASTE-ORDER.md, "Header by phase"):
#   (default)  post-election  sections/post-election-header-section.html
#   --pre      pre-election   sections/header-section.html         (Important Dates calendar)
#   --results  election night sections/results-header-section.html (AP live results)
#
# Every phase copies the whole file, stylesheet included: select everything in the header
# Code Block and paste over it. (Pasting only part of the block, after the first </style>,
# is how vpm.org/voterguide lost its stylesheet on Nov. 10, 2026.)
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
out=$(cat "$file") || exit 1
if [ "$mode" = print ]; then printf '%s\n' "$out"; exit 0; fi
if [ "$mode" = preview ]; then
  printf '%s\n' "$out" | node ../../tools/preview-on-live/preview-on-live.mjs || exit 1
  echo "Live page: https://www.vpm.org/voterguide/"
  exit 0
fi
printf '%s\n' "$out" | pbcopy && echo "Copied the $phase header ($(printf '%s' "$out" | wc -c | tr -d ' ') characters). Select everything in the header Code Block (Cmd+A) and paste over it."
