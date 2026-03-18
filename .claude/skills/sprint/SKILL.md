---
name: sprint
description: "Autonomous work loop with circuit breaker. Trigger on /sprint command or when user says 'work autonomously', 'auto mode', 'sprint'."
---

# Sprint Skill — Autonomous Work Loop

Combines Ralph Loop (frankbria/ralph-claude-code) + Agentic Sprint (damienlaine/agentic-sprint).
Agent works autonomously through a task list with safety mechanisms.

## Setup
1. Read `tasks/current.md` for task list
2. If no tasks defined → ask user what to work on
3. Prioritize: Critical > High > Medium > Low

## Main Loop

```
FOR each task in priority order:
  1. PLAN   — evaluate scope, create mini-plan (< 30 changes)
  2. BUILD  — implement in batches (3-4 files → typecheck)
  3. TEST   — run relevant tests
  4. COMMIT — conventional commit if tests pass
  5. LOG    — update tasks/current.md, log to brain/01-daily/
  6. NEXT   — pick next task
```

## Exit Conditions (BOTH required — dual-condition gate)
1. `completion_indicators >= 2`:
   - Tests pass for the task
   - Task marked done in current.md
2. AND `EXIT_SIGNAL = true`:
   - All tasks in current.md are done
   - OR user sends stop signal
   - OR circuit breaker triggered

## Circuit Breaker (CRITICAL SAFETY)

| Condition | Action |
|-----------|--------|
| 3 consecutive no-progress loops | STOP. Log to lessons.md |
| 5 same-error loops | STOP. Log error pattern |
| Rate limit: 100 tool calls this sprint | STOP. Save state |
| Test failures > 3 for same test | STOP. Need human input |
| File edited > 5 times same sprint | WARNING. > 10 = STOP |
| Wall-clock time > 60 minutes | STOP. Save state, report progress (configurable via SPRINT_TIMEOUT env var) |

## Sprint Resume
If sprint is interrupted, save state to `tasks/sprint-state.md`:
- Current task and progress
- Completed tasks list
- Pending tasks list
- Circuit breaker counters

At next sprint start: if `tasks/sprint-state.md` exists and is < 24 hours old, offer to resume.

## On Any Stop
1. Save full state to `tasks/current.md`:
   - What was in progress
   - What was completed
   - Where it stopped and why
   - Next steps for human/next session
2. Log sprint summary to `brain/01-daily/sprint-YYYY-MM-DD.md`
3. Add any errors to `tasks/lessons.md`

## Logging
- Every task start → log to brain/01-daily/
- Every completion → update tasks/current.md
- Every error → tasks/lessons.md
- Sprint summary → brain/01-daily/sprint-YYYY-MM-DD.md

## Constraints
- Max task scope: 30 related changes (Working Memory Cliff)
- Larger tasks → decompose into subtasks before starting
- If uncertain about a decision → log to `tasks/current.md` as blocker, skip to next task
- NEVER force-push, delete data, or make irreversible changes in autonomous mode
