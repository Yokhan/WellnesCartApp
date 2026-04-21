# Pipeline: Bugfix

Lifecycle for fixing bugs in BUFF EAT.

## Steps

### 1. REPRODUCE
- **Actions**:
  - Understand the reported behavior vs expected behavior
  - Reproduce the bug (dev server, test, or manual steps)
  - If cannot reproduce → ask for more details, do NOT guess
- **Output**: confirmed reproduction steps

### 2. ROOT CAUSE ANALYSIS
- **Actions**:
  - Trace the code path from trigger to symptom
  - Apply "Three Whys" — ask WHY three times to reach root cause
  - Check if this is a SYMPTOM of a deeper issue
  - Check `tasks/lessons.md` — has this pattern occurred before?
- **Output**: root cause identified with file + line reference
- **Red flag**: if same type of bug fixed 3+ times → fix the feedback loop, not the symptom

### 3. FIX
- **Scope**: fix root cause, not symptom
- **Minimal**: change only what's needed, no surrounding cleanup
- **Batch**: typecheck after each changed file
- **Tests**: add test that FAILS without fix, PASSES with fix

### 4. VERIFY
- **Actions**:
  - `npm run typecheck` — 0 errors
  - `npm run lint` — 0 errors
  - `npm test` — all tests pass (including new test)
  - Manual verification if UI-related
- **Domain check**: does the fix respect BUFF EAT guards?
  - Swaps within convenience_tier + use_context?
  - Evidence levels present?
  - Sacred items not blocked?

### 5. COMMIT
- **Format**: `fix(scope): description of what was wrong`
- **Include**: root cause in commit body
- **Post-commit**: update `tasks/current.md`
- **Lessons**: add root cause to `tasks/lessons.md` if pattern is new
