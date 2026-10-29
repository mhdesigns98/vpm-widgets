#!/usr/bin/env bash
# SessionStart hook: bring this Claude Code setup into a cloud (Claude Code on
# the web) session. No-op on your own machine.
#
# Same file works in two places:
#   - this repo: .claude/settings.json points straight at it
#   - any project repo: copy it to <repo>/.claude/hooks/session-start.sh and
#     register it (see cloud/README.md). It clones claude-setup on first run.
#
# Whatever this prints to stdout is added to Claude's context, so install
# chatter goes to stderr and only the instructions themselves go to stdout.
#
# Env knobs (set in the cloud environment's variables):
#   CLAUDE_SETUP_REPO       clone URL (default: github.com/mhdesigns98/claude-setup)
#   CLAUDE_SETUP_CORE_ONLY  1 = skip the vpm/ layer
#   CLAUDE_SETUP_INJECT     0 = don't echo CLAUDE.md + rules into context
set -uo pipefail

[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0

log() { echo "[claude-setup] $*" >&2; }
export GIT_TERMINAL_PROMPT=0   # a failed auth must fail, not wait for input

REPO_URL="${CLAUDE_SETUP_REPO:-https://github.com/mhdesigns98/claude-setup.git}"
PROJECT="${CLAUDE_PROJECT_DIR:-$PWD}"

# Use the checkout we're already in if this *is* claude-setup; otherwise keep
# a clone in $HOME (the container is cached after this hook, so it sticks).
if [ -x "$PROJECT/install.sh" ] && [ -d "$PROJECT/core" ]; then
  SRC="$PROJECT"
else
  SRC="$HOME/.claude-setup"
  # A hung GitHub or DNS lookup must not stall startup. Containers are Linux, so
  # `timeout` is there; without it, run git as before.
  tgit() { if command -v timeout >/dev/null; then timeout 20 git "$@"; else git "$@"; fi; }
  if [ -d "$SRC/.git" ]; then
    tgit -C "$SRC" pull --ff-only -q >&2 || log "pull failed; using cached copy"
  elif ! tgit clone -q --depth 1 "$REPO_URL" "$SRC" >&2; then
    # Never block the session over this. Usual cause: claude-setup isn't one
    # of the repos this session is allowed to reach.
    log "could not clone $REPO_URL; starting without personal config"
    exit 0
  fi
fi

FLAGS=(--cloud)
[ "${CLAUDE_SETUP_CORE_ONLY:-0}" = "1" ] && FLAGS+=(--core-only)

if ! "$SRC/install.sh" "${FLAGS[@]}" >&2; then
  log "install.sh failed; starting without personal config"
  exit 0
fi

# Belt and braces: CLAUDE.md and rules may be read before this hook finishes,
# so hand them over directly too. Skills/commands/agents are files on disk.
if [ "${CLAUDE_SETUP_INJECT:-1}" = "1" ]; then
  DEST="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
  echo "# Personal config (claude-setup, installed by SessionStart hook)"
  echo
  cat "$DEST/CLAUDE.md"
  for f in "$DEST"/rules/*.md; do
    [ -e "$f" ] || continue
    echo
    echo "## Rule: $(basename "$f" .md)"
    echo
    cat "$f"
  done
fi
exit 0
