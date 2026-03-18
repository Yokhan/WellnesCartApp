---
name: coverage
description: "Analyze test coverage, find untested code paths, generate tests for gaps. Trigger on keywords: coverage, untested, test gaps."
---

# Test Coverage Analysis Skill

Find untested code and generate tests for critical gaps.

## Process

### Phase 1: Run Coverage
Detect stack and run appropriate coverage tool:
- **Node.js**: `npx vitest --coverage` or `npx jest --coverage`
- **Python**: `pytest --cov=src --cov-report=term-missing`
- **Rust**: `cargo tarpaulin`
- **Go**: `go test -coverprofile=coverage.out ./...`

### Phase 2: Analyze Gaps
1. Parse coverage report
2. Identify modules below threshold by layer:
   - `core/` — 90% minimum
   - `features/` — 80% minimum
   - `adapters/` — 60% minimum (IO is hard to unit test)
   - `shared/` utilities — 95% minimum
3. Report each layer separately
4. Prioritize by:
   - Business criticality (core/ > features/ > shared/)
   - Complexity (more branches = higher priority)
   - Recent changes (recently modified = higher priority)

### Phase 3: Generate Tests
For each critical gap, launch test-engineer agent to:
1. Read the untested source file
2. Identify untested paths (branches, error handlers)
3. Generate tests following project patterns
4. Run new tests → verify they pass
5. Verify coverage improved

### Phase 4: Report
```
## Coverage Report — [date]

### Overall: [X]%

### Below Threshold (< 80%)
| Module | Coverage | Critical Paths Missing |
|--------|----------|----------------------|

### Tests Generated: [count]
### Coverage Delta: [before]% → [after]%
```

Save report to `brain/03-knowledge/coverage-YYYY-MM-DD.md`
