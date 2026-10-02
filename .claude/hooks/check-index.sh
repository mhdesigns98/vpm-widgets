#!/usr/bin/env bash
# Widget Lab drift check: every widgets/<slug>/ must appear in INDEX.md and have a README.md.
#
# INDEX.md is the slug/namespace-collision lookup that CLAUDE.md tells Claude to consult before
# picking a prefix. When it drifts, that check silently stops working — hence this script.
#
# Run by hand from anywhere, or automatically via the Stop hook in .claude/settings.json.
# With --json it emits {"systemMessage": "..."} for the hook; without, plain lines for a human.

set -uo pipefail

repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo" || exit 0

[ -f INDEX.md ] || exit 0

missing_index=()
missing_readme=()
stale_index=()

# Folder -> INDEX.md, and folder -> README.md
for d in widgets/*/; do
  [ -d "$d" ] || continue
  slug="$(basename "$d")"
  grep -q -- "$slug" INDEX.md || missing_index+=("$slug")
  [ -f "$d/README.md" ] || missing_readme+=("$slug")
done

# INDEX.md -> folder. Catches rows left behind when a widget is deleted (as happened to
# elections-banner-2026, removed in bb64962 with its row surviving another 20-odd commits).
while read -r slug; do
  [ -n "$slug" ] || continue
  [ -d "widgets/$slug" ] || stale_index+=("$slug")
done < <(grep -oE '^\| `[^`]+`' INDEX.md | sed -E 's/^\| `//; s/\/?`$//')

[ ${#missing_index[@]} -eq 0 ] && [ ${#missing_readme[@]} -eq 0 ] && [ ${#stale_index[@]} -eq 0 ] && exit 0

report=""
add() { [ -n "$report" ] && report="$report"$'\n'; report="${report}$1"; }
[ ${#missing_index[@]} -gt 0 ] && add "not in INDEX.md: ${missing_index[*]}"
[ ${#missing_readme[@]} -gt 0 ] && add "no README.md: ${missing_readme[*]}"
[ ${#stale_index[@]} -gt 0 ] && add "in INDEX.md but no folder: ${stale_index[*]}"

if [ "${1:-}" = "--json" ]; then
  printf '%s' "$report" | jq -Rsc '{systemMessage: ("Widget Lab drift — " + .)}'
else
  printf '%s\n' "$report"
fi
exit 0
