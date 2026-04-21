# Plan-First Protocol — Architecture Before Code

## The Rule
For every task S+ size, produce a written plan with file structure and complexity estimate BEFORE writing any code.

Coding without a plan = bloated files, wrong structure, rework.

## When Planning is Mandatory

| Task Size | Planning Required | Detail Level |
|-----------|------------------|--------------|
| **XS** | No | Just do it |
| **S** | Brief | 3-5 lines: what files, what changes |
| **M** | Standard | Full plan (see template below) |
| **L** | Detailed | Full plan + user approval before coding |
| **XL** | Decompose first | Break into M-tasks, plan each one |

## Plan Template (M+ tasks)

```markdown
## Plan

### Goal
[1 sentence: what this achieves for the user]

### Complexity Estimate
- Size: [XS/S/M/L/XL]
- Files to create: [count]
- Files to modify: [count]
- Estimated lines: [range]
- Risk: [LOW/MEDIUM/HIGH/CRITICAL]

### File Architecture
[Directory tree of files to create/modify with purpose of each]

### Implementation Order
1. [First file/step — why first]
2. [Second — depends on #1 because...]

### Risks & Mitigations
- [Risk 1] → [Mitigation]

### Plan B (mandatory for M+ tasks)
If the primary approach fails at step [N], the fallback is: [...]
```

## Planning Quality Gate (M+ tasks)

| # | Criterion | Fail Signal |
|---|-----------|-------------|
| 1 | **Goal clarity** | Need 2+ sentences = don't understand yet |
| 2 | **Scope boundary** | "And maybe some others" = fail |
| 3 | **Dependency map** | No blast-radius for MEDIUM+ risk = fail |
| 4 | **Test scenarios** | "Will add tests" without specifics = fail |
| 5 | **Risk classification** | Missing risk level = fail |
| 6 | **Size confidence** | "Should be quick" = fail |
| 7 | **Reversibility** | Irreversible without rollback plan = fail |
| 8 | **Plan B exists** | "We'll figure it out" = fail |
| 9 | **No premature code** | Code snippets in plan = premature |

9/9 = proceed. 7-8/9 = proceed with noted gaps. <7/9 = refine.

## BUFF EAT Specific
- Check `docs/BRD.md` for RF and UC requirements
- Check `docs/DATA_DESIGN.md` for affected tables
- Check `docs/ARCHITECTURE.md` for pipeline position
- Check `_reference/README.md` for canonical implementations
- All files < 250 lines (project rule, stricter than template's 375)
