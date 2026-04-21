# Self-Improvement Loop

## After Every User Correction

When the user corrects your work, classify the type:

| Type | Description | Action |
|------|------------|--------|
| **BUG** | Code error, wrong logic | Log to tasks/lessons.md |
| **KNOWLEDGE_GAP** | Didn't know framework/API/convention | Log to tasks/lessons.md |
| **STYLE** | Code style preference | Note, don't log unless repeated |
| **DESIGN_DISAGREEMENT** | Architectural approach preference | Discuss, log if pattern emerges |
| **MISUNDERSTANDING** | Wrong interpretation of task | Clarify, log root cause |

## Logging Format (tasks/lessons.md)

```markdown
### [DATE] — [SHORT DESCRIPTION]
- **Track**: BUG / KNOWLEDGE / PATTERN / PROCESS
- **Severity**: P0 (blocks work) / P1 (causes rework) / P2 (minor) / P3 (cosmetic)
- **What happened**: [one sentence]
- **Root cause**: [WHY, not WHAT]
- **Prevention**: [specific rule or check to add]
```

## Rule Promotion

When lessons.md accumulates 3+ entries of the same pattern:
1. Extract the underlying principle
2. Add to appropriate `.claude/rules/*.md` or `.claude/library/*.md`
3. Mark original lessons as "promoted to rule"

## Session Handoff

Before ending a session, update `tasks/current.md`:
- Current status of work
- Files modified
- Next steps
- Blockers (if any)
