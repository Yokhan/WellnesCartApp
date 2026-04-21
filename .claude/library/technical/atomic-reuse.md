# Atomic Reuse Protocol — Search Before Create

## The Rule
Before creating ANY new code element (function, component, type, constant), search for an existing one first.

## Search Protocol

### Before creating a function:
1. `Grep` for similar function names in `src/`
2. Check `src/shared/` for utility functions
3. Check `src/core/` for domain logic
4. If found → use or extend. If not → create in appropriate location.

### Before creating a component:
1. Check `src/shared/ui/index.ts` — is there an existing component?
2. Check if an existing component can be extended with props
3. If creating new → add to `src/shared/ui/` and export through `index.ts`

### Before creating a type:
1. Check `src/shared/types/domain.ts` — is it already defined?
2. Check feature-specific `*.types.ts` files
3. If shared across features → `src/shared/types/`
4. If feature-specific → `features/X/X.types.ts`

### Before creating a constant/config:
1. Check `src/shared/ui/tokens.ts` for design tokens
2. Check `src/core/*/data.ts` for domain constants
3. Check feature-specific `*.data.ts` files

## Anti-Patterns
- Duplicating constants across files (e.g., WEIGHTS in two places)
- Creating utility functions that already exist in shared
- Defining types inline when they should be in domain.ts
- Building UI from raw HTML when a component exists

## BUFF EAT Specific Registries
- **UI Components**: `src/shared/ui/index.ts`
- **Design Tokens**: `src/shared/ui/tokens.ts`
- **Domain Types**: `src/shared/types/domain.ts`
- **Type Guards**: `src/shared/types/guards.ts`
- **QG Constants**: `src/core/quality-gate/quality-gate.data.ts`
- **VS Constants**: `src/core/value-score/value-score.data.ts`
