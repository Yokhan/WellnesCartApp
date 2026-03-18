# Architecture Rules

## Module Boundaries
- Every module has a single public entry point (index.ts / __init__.py / mod.rs / main.go)
- Import ONLY through the entry point. No deep imports into internal files.
- If you need something from a module, it must be exported from its entry point.
- Extract to `shared/` ONLY when used by ≥3 modules. Until then, duplication is acceptable. Premature abstraction is worse than duplication.

## Dependency Direction
- `shared/` depends on nothing
- `core/` depends only on `shared/`. NO IO (fetch, DB, filesystem, network).
- `features/` depends on `shared/` and `core/`
- `adapters/` / UI depends on `features/`
- Never create circular dependencies.

## File Size
- Maximum 250 lines per file. This is a cognitive limit for AI agents, not just style.
- If a file grows beyond 250 lines, split it by responsibility.

## Module Structure (Vertical Slices)
Each feature is a self-contained module with all layers:
```
features/auth/
  ├── index.ts          # Public API (only this is importable)
  ├── auth.service.ts   # Business logic
  ├── auth.types.ts     # Types/contracts
  ├── auth.test.ts      # Tests (colocated)
  └── auth.data.ts      # Config/tables (Data-Oriented Design)
```

## Adapters Layer
- `adapters/[name].adapter.*` handles all IO: API calls, DB queries, filesystem operations.
- Adapters depend on `features/` types and interfaces only — never on services directly.
- Adapters are the ONLY layer allowed to perform IO. All other layers must be IO-free.

## Data-Oriented Design
- `data.*` — configurations, tables, lookup maps (easy to change)
- `processor.*` / `service.*` — pure functions: (input, config) => output (stable)
- `types.*` — contracts and interfaces
