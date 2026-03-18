---
name: debug
description: "Systematic debugging approach: reproduce, isolate, fix, verify, document"
---

# Debug Skill

## Systematic Debugging Process

### 1. Reproduce
- Get exact steps to reproduce the bug
- Identify: input, expected output, actual output
- Find the minimal reproduction case

### 2. Isolate
- Trace the execution path from input to error
- Use CodeGraphContext (if available) to find callers/callees
- Narrow down to the specific module/function
- Check recent changes: `git log --oneline -20` and `git diff`

### 3. Hypothesize
- Form a specific hypothesis about the cause
- Look for common patterns:
  - Off-by-one errors
  - Null/undefined handling
  - Async race conditions
  - Type coercion issues
  - Stale cache/state
  - Missing error handling

### 4. Fix
- Make the minimal change that fixes the issue
- Don't refactor unrelated code in the same change
- Prefer fixing the root cause over symptoms

### 5. Verify
- Write a test that reproduces the original bug (it should fail without the fix)
- Apply the fix — test passes
- Run full test suite — no regressions
- Run typecheck and linter

### 5b. Regression Check
After fixing the immediate module, also run integration tests:
- `npm test -- --testPathPattern=integration` (Node)
- `pytest tests/integration/` (Python)
- `go test ./tests/integration/...` (Go)
If integration tests fail, the fix may have introduced a regression — investigate before committing.

### 6. Document
- Log the bug and fix in `brain/03-knowledge/` for future reference
- If this is a pattern that could recur, consider:
  - Adding a rule to `.claude/rules/`
  - Adding a test to prevent regression
  - Adding a type constraint to prevent at compile time

### 7. Commit
Use `fix: description` commit message.
Reference the issue if there is one.
