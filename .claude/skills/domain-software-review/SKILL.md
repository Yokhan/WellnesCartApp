---
description: "Review code and architecture decisions against evidence-based software engineering practices. Detects cargo cult patterns, overengineering, and common anti-patterns."
---
# Domain Software Review

## How to Use
When reviewing code, architecture, or engineering decisions, check against these evidence-based practices.

**Evidence Scale:** A = systematic review/large-scale study. B = seminal work/major study. C = expert consensus.

## Anti-Patterns (NEVER recommend)

### Code Level
1. **Magic Numbers** — Bare numeric literals. INSTEAD: named constants, enums. EVIDENCE: C
2. **Swallowing Exceptions** — Empty catch blocks. INSTEAD: log with stack trace, catch specific. EVIDENCE: B
3. **God Object** — Classes >500 LOC, >10 public methods. INSTEAD: decompose into cohesive units. EVIDENCE: B
4. **Stringly-Typed** — Strings where enums/types should be. INSTEAD: union types, typed constants. EVIDENCE: C
5. **Copy-Paste Programming** — Including from AI output. INSTEAD: understand before integrating. EVIDENCE: B
6. **Premature Optimization** — Before profiling. INSTEAD: profile first, optimize critical 3%. EVIDENCE: B
7. **Deep Nesting** — >3 levels. INSTEAD: early returns, guard clauses, extract functions. EVIDENCE: B
8. **Mutable Global State** — IEEE: increased defect proneness. INSTEAD: explicit dependencies, immutable. EVIDENCE: B
9. **Commented-Out Code** — Version control preserves history. INSTEAD: delete it. EVIDENCE: C
10. **Reinventing Security** — Custom auth/crypto = near-100% vulnerability rate. INSTEAD: established libraries. EVIDENCE: A

### Design Level
11. **Premature Abstraction** — After 1-2 instances. INSTEAD: Rule of Three (Metz). EVIDENCE: C
12. **DRY Obsession** — Eliminating ALL duplication. INSTEAD: DRY applies to knowledge, not syntax. EVIDENCE: C
13. **Inheritance for Code Reuse** — Fragile base class problem. INSTEAD: composition. EVIDENCE: B
14. **Anemic Domain Model** — Data containers with all logic in services. EVIDENCE: C
15. **No Tests Before Refactoring** — No safety net. INSTEAD: write characterization tests first. EVIDENCE: B

### Architecture Level
16. **Premature Microservices** — Fowler: "start with monolith." EVIDENCE: B
17. **Big Ball of Mud** — No discernible architecture. INSTEAD: enforce module boundaries. EVIDENCE: B
18. **Big Bang Rewrite** — INSTEAD: Strangler Fig pattern. EVIDENCE: B
19. **No Observability** — INSTEAD: logs, metrics, traces. EVIDENCE: C
20. **Cargo Cult Architecture** — Copying Netflix at 5 engineers. INSTEAD: simplest that solves actual problems. EVIDENCE: C
21. **Ignoring Technical Debt** — 42% dev time wasted (Stripe). INSTEAD: budget 15-20% for reduction. EVIDENCE: A

## Best Practices (ALWAYS consider)

### Code Level
1. **Meaningful Naming** — 2-4 natural language words. EVIDENCE: B
2. **Small Focused Functions** — <20 lines, single abstraction level. EVIDENCE: B
3. **Fail Fast and Loud** — Clear errors early. EVIDENCE: C
4. **Use the Type System** — Make illegal states unrepresentable. EVIDENCE: C
5. **Immutability by Default** — const/readonly; return new copies. EVIDENCE: B
6. **Guard Clauses** — Edge cases at function top, then happy path. EVIDENCE: B
7. **Consistent Formatting** — Automated formatters in CI. EVIDENCE: C
8. **Dead Code Deletion** — Remove aggressively; git preserves history. EVIDENCE: C

### Design Level
9. **Composition Over Inheritance** — More flexible; avoids fragile base class. EVIDENCE: B
10. **Separation of Concerns** — Logic/data/presentation. EVIDENCE: C
11. **Rule of Three** — Wait for 3 instances before abstracting. EVIDENCE: C
12. **Design for Testability** — Meta-analysis of 27 TDD studies: positive quality effect. EVIDENCE: A
13. **API First Design** — Contract before implementation. EVIDENCE: C
14. **Behavior-Driven Testing** — Test public behavior, not implementation. EVIDENCE: C

### Architecture Level
15. **Monolith First** — Extract services only when scaling demands. EVIDENCE: B
16. **Testing Pyramid** — Many unit, fewer integration, minimal E2E. EVIDENCE: B
17. **CI/CD Pipeline** — Strongest predictor of delivery performance (Accelerate, n=23,000). EVIDENCE: A
18. **Choose Boring Technology** — Proven > shiny. EVIDENCE: C
19. **Vertical Slice Architecture** — Organize by feature, not by layer. EVIDENCE: C
20. **Architecture Decision Records** — Document decisions with context and rationale. EVIDENCE: C

## BUFF EAT Context (Project-Specific)

### Project Rules (override generic when stricter)
- Files < 250 lines (project rule, stricter than generic 500)
- No `any` — use `unknown` + type guards
- No mutations — return new objects
- Import ONLY through index.ts (no deep imports)
- `core/` = pure functions, NO IO (fetch, DB, fs)
- `shared/` depends on nobody
- `features/` depends on `shared/` and `core/`
- Data (*.data.ts) separated from logic (*.processor.ts)
- Tests colocated: `module.test.ts` next to `module.ts`

### Architecture Boundaries
- Quality Gate → Value Score → Taste Engine (sequential pipeline)
- Quality Gate BLOCKS, Value Score SORTS, Taste Engine RE-RANKS (v1.5)
- Swaps processor must filter by allergens + excluded_ingredients
- LP-solver constraints: budget, protein target, calorie range, sacred items

### Stack
- Frontend: Preact + TypeScript + Vite
- Backend (planned): Python + FastAPI + scipy/PuLP
- DB: PostgreSQL 16 + Supabase

See: `docs/ARCHITECTURE.md`, `.claude/rules/architecture.md`, `.claude/rules/code-style.md`

## Common LLM Mistakes
1. Over-recommending design patterns for simple problems
2. Defaulting to microservices
3. Excessive abstraction and interface creation
4. Over-applying SOLID as rigid rules
5. DRY before understanding duplication
6. Popular frameworks over simple solutions

## Key Sources
- Forsgren, Humble, Kim. *Accelerate* (2018) — DORA metrics, n=23,000
- Fowler. *Refactoring* (2018); MonolithFirst, StranglerFig
- Sandi Metz. "The Wrong Abstraction" (2016)
- Knuth. "Structured Programming" (1974)
- Springer TDD meta-analysis (27 studies)
- CISQ Cost of Poor Software Quality report
