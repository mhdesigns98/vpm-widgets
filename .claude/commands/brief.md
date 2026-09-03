---
description: Turn an idea into a half-page BRIEF.md before building a widget. Usage: /brief [one-line idea] — interviews you briefly, then writes the brief into the widget folder so the build starts from agreed requirements instead of discovering them mid-build.
effort: medium
---

Write a project brief BEFORE any code gets written. Play the PM role: pin down the requirements that would otherwise surface as mid-build direction changes.

**Arguments:** $ARGUMENTS

---

## Step 1 — Understand the idea

If `$ARGUMENTS` describes the idea, start from it. Otherwise ask: "What's the idea, in a sentence or two?"

**If an existing `BRIEF.md` is already in the widget folder, read it first, then ask:**
> "Before we update this brief — what have you reconsidered since we last worked on this? What assumptions no longer hold?"
Fold any answers into the brief before proceeding. Skip if this is a fresh widget.

## Step 2 — Interview (one message)

Ask only what isn't already clear from the idea. If the answer is vague, reflect back a concrete interpretation and ask for confirmation rather than re-asking open-ended.

1. **User moment** — who is on the page, why are they there, and what does this widget need to do for them in that specific moment? One concrete scenario ("a donor who just finished reading the story and…").
2. **Done** — what does success look like? Be concrete: "deployed on the impact page," not "looks good."
3. **Out of scope** — what are we explicitly NOT doing in v1? (The scope-creep question — push for at least two real exclusions.)
4. **Deploy target** — WordPress ACF, Brightspot embed, or standalone page? This determines the file format, so `/new-widget` won't ask again.

Audience and content source are usually "VPM site visitors" and "static content, maintained by whoever's driving this" for a widget — infer them from the idea and only ask if it genuinely leaves them open.

## Step 3 — Write BRIEF.md

Write `BRIEF.md` into `widgets/[slug]/`. If the slug/folder doesn't exist yet, ask where it will live, or just hold the brief and let `/new-widget` create the folder and file it. Keep it to half a page:

```markdown
# [Widget Name] — Brief
*Written: [date]*

## Problem / Why
[1–2 sentences]

## User moment
[One concrete scenario: who is on the page, why they're there, what this widget does for them in that moment]

## What done looks like
[concrete, observable success criteria — bullet list]

## Out of scope (v1)
- [exclusion]
- [exclusion]

## Deploy target & constraints
[CMS/platform + the format it implies, e.g. "WordPress ACF → split-file, self-contained, no external deps"]

## Open questions
[anything unresolved — fine to leave items here]
```

## Step 4 — Confirm and hand off

Show the brief, ask for one round of corrections, then finish with:
> Brief saved to `[path]`. Scaffold the build with `/new-widget [name]` — brand tokens load automatically.
