---
description: Alias for /new-widget import mode. Usage: /save-component [file.html] — files a component built in this conversation into the Widget Lab. All logic lives in /new-widget.
effort: low
---

This is an alias. All logic lives in `/new-widget` — it was a wrapper that only differed by "I already have the file," and keeping the two in sync was the whole cost.

**Run `.claude/commands/new-widget.md` in import mode** (its Step 0), treating `$ARGUMENTS` as the source file path. Do not re-derive any of its logic here; there is deliberately none in this file.

**Arguments:** $ARGUMENTS

Mention once in your report that `/new-widget --from <file>` is the current form, so the alias can eventually go away. Don't belabor it.
