# Conflict Resolution Rules

## Merge Conflicts

When encountering merge conflicts:
1. Analyze BOTH versions — understand the intent behind each change
2. Choose the version that matches the task's intent
3. If uncertain — do NOT guess. Create a note in `tasks/current.md` and ask the user
4. Never silently drop changes from either side

## Competing Instructions

When CLAUDE.md, rules, skills, or docs give conflicting guidance:
- **Hooks** (settings.json) take highest priority — they are deterministic
- **Rules** (.claude/rules/) take second priority
- **CLAUDE.md** takes third priority
- **Skills/docs** provide guidance, not mandates
- If still unclear — follow the most restrictive interpretation

## Uncertain Decisions

When the correct approach is unclear:
1. State the uncertainty explicitly in your response
2. Present options with trade-offs (max 3 options)
3. Recommend one with reasoning
4. Wait for user input before proceeding on architectural decisions
5. For minor decisions: choose the most conservative option and note it

## Circuit Breaker

If you find yourself:
- Editing the same file > 3 times for production code, > 5 times for test/config files → STOP. Re-read the requirements.
- Getting the same test failure > 3 times → STOP. Log the issue to `tasks/lessons.md` and ask for help.
- Unsure about a destructive operation → ALWAYS ask first.
