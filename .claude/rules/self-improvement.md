# Self-Improvement Rules

## lessons.md Protocol

After EVERY user correction or discovered mistake:

1. Open `tasks/lessons.md`
2. Add entry in this format:
   ```
   ### [DATE] — [Brief Title]
   **Error**: What went wrong
   **Root cause**: Why it happened
   **Rule**: Concrete prevention rule
   **Applies to**: [agent/skill/general]
   ```
3. Never skip this step. This is how the system learns.

## At Session Start

1. Read `tasks/lessons.md` — avoid repeating past mistakes
2. Read `tasks/current.md` — continue where last session left off
3. Check `brain/01-daily/` for recent session logs if context needed

## Promotion Cycle

When `tasks/lessons.md` exceeds 50 entries:
- Identify recurring patterns (3+ similar errors)
- Promote to `.claude/rules/project-[topic].md` as permanent rules (ALWAYS create new `project-` prefixed files)
- Extract reusable solutions into `.claude/skills/project-[name]/SKILL.md`
- NEVER modify template rules (files without `project-` prefix) — they are the read-only baseline updated via `/update-template`
- Archive promoted entries (move to `brain/03-knowledge/lessons-archive.md`)
- Use `/weekly` command to trigger this process
- Project rules overlay and complement template rules. Claude Code loads ALL files from `rules/`.

## Anti-Patterns to Track

- Hallucinated APIs or packages → add to lessons with source verification
- Files growing > 250 lines → note which module and why
- Tests skipped before commit → note the context
- Deep imports bypassing index → note the offending path
