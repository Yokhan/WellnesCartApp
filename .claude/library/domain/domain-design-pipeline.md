# Design Pipeline — Token-First, Component-First, Compose-First

> Universal design production rules for BUFF EAT.
> Project tokens: `src/shared/ui/tokens.ts`. Components: `src/shared/ui/`.

## Core Principles

### Token-First
NEVER hardcode visual values. Always bind to tokens/variables:
- Colors → `C.*` tokens from `tokens.ts` (never raw hex)
- Typography → `ff.*` font families (never raw font strings)
- Spacing → `space.*` tokens (never raw px)
- Border radius → `space.radius.*` (never raw value)

### Component-First
NEVER build from raw elements when a component exists:
- Search `src/shared/ui/` first
- Use existing components (Card, Tag, Pill, Metric, etc.)
- Only create new when no match exists AND the pattern will be reused

### Composition Over Creation
Build screens by composing existing components:
- Assemble from component imports
- Override props — don't recreate from scratch
- If a component doesn't support what you need → extend it, don't bypass it

## 8-Phase Design Pipeline

Every design/UI task follows this pipeline. No phase may be skipped.

| Phase | Name | What |
|-------|------|------|
| 0 | **CONTEXT** | User journey, design language, device/viewport |
| 1 | **ANALYZE** | 5-lens: Art Direction, UX, UI, Flow, Behavior |
| 2 | **REFERENCE** | Find gold-standard, deep-inspect structure |
| 3 | **BOM** | Bill of Materials — list ALL component instances needed |
| 4 | **DISCOVER** | Query available tokens, styles, components in `src/shared/ui/` |
| 5 | **COMPOSE** | Create from instances, bind all values to tokens |
| 6 | **VALIDATE** | Dev server + visual verification |
| 7 | **ITERATE** | Fix deviations, re-validate |

### Phase 1 Detail: 5-Lens Analysis
1. **Art Direction** — brand guidelines match? Warm editorial tone, serif headings, terracotta accent?
2. **UX** — can user accomplish goal? No dead ends? Clear hierarchy? Cognitive load < 4 chunks?
3. **UI** — all values from tokens? Consistent spacing? Systematic?
4. **Flow** — where from → what they see → where they go?
5. **Behavior** — all states covered? (see State Coverage below)

## State Coverage (mandatory)

Every interactive element must have these states designed:

| State | When |
|-------|------|
| Default | Resting |
| Hover | Mouse over (desktop) |
| Active/Pressed | Being tapped |
| Focus | Keyboard navigation |
| Disabled | Non-interactive |
| Loading | Async in progress |
| Error | Validation / error |
| Empty | No data |

Not all states apply everywhere. But you must DECIDE which apply — not ignore them.

## Self-Audit Gate (after every creation step)

```
[ ] Every color bound to a C.* token? (no raw hex)
[ ] Every text uses ff.serif or ff.sans? (no raw font)
[ ] Every border radius uses space.radius.*?
[ ] Every spacing uses space.gap.* or space.padding.*?
[ ] Every component imported from src/shared/ui/index.ts?
[ ] No fixed sizing where flex is appropriate?
[ ] No placeholder text? (real Russian content or realistic data)
[ ] Dev server checked and visually verified?
```

If ANY fails → fix before moving to next component.

## BUFF EAT Design Tokens

```
Tokens     → C.*, ff.*, space.* (src/shared/ui/tokens.ts)
Atoms      → Tag, Pill, NutriBadge, NOVABadge, DeltaChip, Num
Molecules  → Button, Card, Metric, Callout, InfoTip, EvidenceTag
Organisms  → SwipeRow, ScoreBreakdown, Stepper, BottomNav
Templates  → ListScreen, ProductDetailScreen, OnboardingShell
Screens    → Templates + real data + navigation
```

**Build order**: always Tokens → Screens. Never skip levels.

## Cross-References
- `.claude/library/technical/atomic-reuse.md` — code-side reuse protocol
- `src/shared/ui/index.ts` — all available UI components
- `.claude/library/meta/analysis.md` — "Level 0 analysis is never acceptable" applies to design too
