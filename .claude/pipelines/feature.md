# Pipeline: Feature

Full lifecycle for adding a new feature to BUFF EAT.

## Steps

### 1. RESEARCH | GATE: none
- **Input**: feature description, linked issue/RF/UC
- **Actions**:
  - Read `docs/BRD.md` — find relevant RF and UC
  - Read `docs/DATA_DESIGN.md` — find affected tables
  - Read `docs/ARCHITECTURE.md` — pipeline position (Quality Gate → Value Score → Taste Engine)
  - Read all affected files + their imports and tests
  - Check `tasks/lessons.md` for related past mistakes
  - Check `_reference/README.md` for canonical implementations
  - Search for existing utilities (Grep/Glob) before planning new ones
- **Output**: research summary — existing patterns, affected files, risks, reusable code
- **Classify**: risk level (LOW/MEDIUM/HIGH/CRITICAL)

### 1.5. BRAINSTORM | GATE: risk_threshold
- **Trigger**: MEDIUM+ risk (recommended for HIGH, mandatory for CRITICAL)
- **Actions**:
  - Enumerate 3+ approaches with trade-off analysis
  - Select recommended approach with justification
  - Document rejected approaches with reasons
- **Output**: brainstorm summary
- **Skip**: LOW risk XS/S tasks

### 2. PLAN | GATE: user_approval for L+ tasks
- **Input**: research findings + brainstorm
- **Output**: written plan including:
  - Goal (1 sentence)
  - Complexity estimate (size, file count, line estimate)
  - File architecture (directory tree with purpose per file)
  - Implementation order with dependencies
  - File size check (nothing > 250 lines)
  - Risks and mitigations
  - Test scenarios (happy path, edge cases, errors)
- **Quality gate**: must pass Planning Quality Gate (see `.claude/library/process/plan-first.md`)

### 3. IMPLEMENT | GATE: typecheck per batch
- **Input**: approved plan
- **Batch protocol** (3-4 files max per batch):
  1. Batch 1: types + data → typecheck
  2. Batch 2: service/processor (pure logic) → typecheck
  3. Batch 3: adapter + index (wiring) → typecheck
  4. Batch 4: tests → run tests

### 4. TEST | GATE: tests_pass
- **Input**: changed files list
- **Minimum**: 1 happy path + 1 error path per public function
- **Edge cases**: empty input, null, boundaries
- **Domain**: allergen filtering, convenience_tier matching, budget constraints

### 5. REVIEW | GATE: self-review pass
- **Self-review checklist** (see `.claude/library/process/self-verification.md`):
  - Code quality (< 250 lines, no any, no mutations, imports through index.ts)
  - Domain correctness (swaps within tier, evidence levels, no forbidden patterns)
  - Architecture (core/ pure, dependencies correct)
- **Domain lenses** (run applicable):
  - Health Review — nutritional claims, evidence levels
  - Software Review — code patterns, architecture
  - Design Review — UX, cognitive load, state coverage
  - Communication Review — UI text, benefit-first messaging

### 6. COMMIT | GATE: none
- **Format**: `feat(scope): description`
- **Pre-commit**: typecheck + lint + tests all pass
- **Post-commit**: update `tasks/current.md`
- **Lessons**: if user corrected anything → add to `tasks/lessons.md`
