---
name: add-feature
description: "Create a new feature module using vertical slice architecture. 9-step workflow: explore → scaffold → implement → test → review → validate. Trigger on 'add feature', 'new module', 'create component'."
---

# Add Feature Skill

9-step workflow based on christianestay/claude-code-base-project.

## Step 0: Naming Conflict Check
Before anything else, verify the feature name is available:
- Check `src/features/` for existing modules with the same name
- Check `src/shared/` and `src/core/` for name conflicts
- If conflict found: suggest an alternative name and stop until user confirms

## Step 0.5: BUFF EAT Research
1. Read `docs/BRD.md` — find RF and UC for this feature
2. Read `docs/DATA_DESIGN.md` — which tables are affected
3. Read `docs/ARCHITECTURE.md` — where in Quality Gate → Value Score → Taste Engine pipeline

## Step 1: Explore Existing Patterns
1. Read `_reference/README.md` — find canonical implementation
2. Read the referenced feature to understand conventions. For each pattern found, note WHY it's structured this way, not just HOW
3. Check `templates/` for applicable scaffolding
4. Read `tasks/lessons.md` — avoid known pitfalls for this type

## Step 2: Understand the Feature
Ask the user:
- What does this feature do?
- What data does it work with?
- External dependencies? (DB, API, third-party)

## Step 3: Regenerate Types (if needed)
- If using generated types (e.g., Supabase, Prisma, OpenAPI) → regenerate first
- Ensure types are fresh before scaffolding

## Step 4: Scaffold
Create vertical slice in `src/features/[name]/`:
```
src/features/[name]/
├── index.*           # Public entry point (ONLY importable file)
├── [name].types.*    # Types and contracts FIRST
├── [name].data.*     # Config, tables, lookup maps
├── [name].service.*  # Pure business logic (no IO)
├── [name].test.*     # Tests colocated
└── [name].adapter.*  # IO layer if needed (DB, API calls)
```

Use template from `templates/` if available. Extract principles from reference implementation. Apply those principles adapted to this feature's specific context and needs.

## Step 5: Implement in Batches
**CRITICAL: Write 3-4 files max per batch, then typecheck.**
1. Batch 1: types + data → typecheck
2. Batch 2: service (pure logic) → typecheck
3. Batch 3: adapter + index (wiring) → typecheck
4. Batch 4: tests → run tests

Never accumulate large amounts of unverified code.

## Step 6: Test
- Minimum: 1 happy path + 1 error path per public function
- Test through the entry point (public API), not internals
- Use factory functions for test data
- Edge cases: empty input, null, boundaries

## Step 7: Self-Review
Before presenting to user, check:
- [ ] Module boundary: only index exports public API
- [ ] No deep imports from other modules
- [ ] core/ code has no IO calls
- [ ] All files < 375 lines
- [ ] Data separated from behavior
- [ ] Types explicit, no `any`

## Step 8: Validate
Run full verification:
```bash
typecheck   # Types correct
lint        # Style clean
test        # Tests pass
```
ALL must pass. Fix issues before proceeding.

## Step 8.5: BUFF EAT Self-Review
- [ ] Files < 250 lines (stricter than template 375)
- [ ] Swaps only within `convenience_tier` + `use_context` [ADR-002]
- [ ] Nutritional claims have evidence level: [RCT] / [SR/MA] / [i]
- [ ] NutriScore and Composite Score NOT mixed [ADR-014]
- [ ] Sacred items not blocked
- [ ] UI text: benefit-first, Russian, neutral tone
- [ ] Tokens from `src/shared/ui/tokens.ts` — no hardcoded values

See: `.claude/library/domain/buff-eat-guards.md`

## Step 9: Finalize
1. Update `docs/ARCHITECTURE.md` if new module added
2. Log architectural decisions to `brain/04-decisions/`
3. Conventional commit: `feat([name]): add [description]`
4. Update `tasks/current.md`
5. If user corrected anything → add to `tasks/lessons.md`
