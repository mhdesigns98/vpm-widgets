#!/bin/sh
# Copy the vpm.org/voterguide header to the clipboard, ready for the CMS.
# Paste it over everything AFTER </style> in the header Code Block (leave the live
# <style> alone: it has drifted from this repo copy). The clipboard gets the
# post-election CSS in its own <style>, then the hero, Key results and nav markup.
#   ./copy-voterguide-header.sh          copy
#   ./copy-voterguide-header.sh --print    print instead of copying
#   ./copy-voterguide-header.sh --preview  copy a console snippet that previews it on the
#                                          live page (tools/preview-on-live)
cd "$(dirname "$0")" || exit 1
out=$(python3 - <<'EOF'
s = open('sections/header-section.html', encoding='utf-8').read()
css = s[s.index('  /* Post-election outcomes panel'):s.rindex('</style>')]
markup = s[s.index('<div class="vpm-vg vg-header">'):].strip()
print('<style>\n' + css + '</style>\n\n' + markup)
EOF
) || exit 1
if [ "$1" = "--print" ]; then printf '%s\n' "$out"; exit 0; fi
if [ "$1" = "--preview" ]; then
  printf '%s\n' "$out" | node ../../tools/preview-on-live/preview-on-live.mjs || exit 1
  echo "Live page: https://www.vpm.org/voterguide/"
  exit 0
fi
printf '%s\n' "$out" | pbcopy && echo "Copied $(printf '%s' "$out" | wc -c | tr -d ' ') characters. Paste over everything after </style> in the header Code Block."
