# Self-Verification Protocol

## Before Presenting ANY Work

### Code Changes
```
[ ] npm run typecheck — 0 errors
[ ] npm run lint — 0 errors
[ ] npm test — all tests pass
[ ] Files < 250 lines (project rule)
[ ] Imports only through index.ts
[ ] core/ has no IO calls
[ ] No `any` — used `unknown` + type guards
[ ] No mutations — returned new objects
```

### Domain-Specific (BUFF EAT)
```
[ ] Swaps only within same convenience_tier + use_context
[ ] Nutritional claims have evidence level [RCT] / [SR/MA] / [i]
[ ] NutriScore and Composite Score NOT mixed into single final score
[ ] No forbidden products (Planned Indulgence respected)
[ ] Sacred items not blocked by Quality Gate
[ ] Neutral tone in UI text (no shaming)
```

### Architecture
```
[ ] shared/ depends on nobody
[ ] core/ depends only on shared/ (no IO)
[ ] features/ depends on shared/ and core/
[ ] Each features/X/ exports only through index.ts
[ ] Data (data.ts) separated from logic (processor.ts)
```

### UI/UX (when applicable)
```
[ ] All colors from C.* tokens (no raw hex)
[ ] All fonts from ff.* tokens
[ ] All spacing from space.* tokens
[ ] Dev server checked visually
[ ] State coverage considered (default, loading, error, empty)
```

## After Verification
If ANY check fails → fix before proceeding. Do NOT present partially verified work.
