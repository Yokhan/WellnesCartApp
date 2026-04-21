# Research-First Protocol

## The Rule
Before implementing ANY feature or fix, research the existing codebase and documentation first.

## Research Checklist

### 1. Documentation
- [ ] Read `docs/BRD.md` — find RF (requirement) and UC (use case)
- [ ] Read `docs/DATA_DESIGN.md` — find affected tables
- [ ] Read `docs/ARCHITECTURE.md` — where in the pipeline (Quality Gate → Value Score → Taste Engine)
- [ ] Read `docs/DECISIONS.md` — any relevant ADR?

### 2. Existing Code
- [ ] Search `src/` for existing implementations of similar logic
- [ ] Check `_reference/README.md` for canonical patterns
- [ ] Check `templates/feature/` for scaffolding
- [ ] `git log --oneline -5 -- <affected_files>` for recent changes

### 3. Lessons Learned
- [ ] Check `tasks/lessons.md` for related past mistakes
- [ ] Check domain guards (`.claude/library/domain/buff-eat-guards.md`)

### 4. Risk Classification
- **LOW**: XS/S task, tested path, no shared/ or core/ changes
- **MEDIUM**: M task, touches feature boundaries, moderate blast radius
- **HIGH**: L task, touches core/ or shared/, cross-module impact
- **CRITICAL**: XL task, touches data model, affects all users

## Anti-Patterns
- Jumping to code without reading docs → wrong approach, rework
- Ignoring existing utilities → duplicate code
- Skipping lessons.md → repeating same mistake
- Not checking git history → overwriting in-progress work
