---
description: "Review product, UX, and visual design decisions against evidence-based design practices. Detects dark patterns, feature bloat, accessibility issues, cognitive overload."
---
# Domain Design Review

## How to Use
When reviewing product, UX, or visual design decisions, check against these evidence-based practices.

**Evidence Scale:** A = systematic review/large-scale study. B = seminal work/major study. C = expert consensus.

## Anti-Patterns (NEVER recommend)

### Product & UX
1. **Feature Factory** — Measuring success by features shipped. INSTEAD: outcome-driven development. EVIDENCE: B
2. **Dark Patterns** — 97% of top EU sites use deceptive UI (EC 2022). INSTEAD: transparent opt-ins. EVIDENCE: A
3. **Accessibility Overlays** — Only 2.4% effective. INSTEAD: semantic HTML, ARIA, keyboard nav. EVIDENCE: A
4. **A/B Testing Cargo Cult** — Peeking inflates false positives from 5% to 26%. INSTEAD: pre-register, calculate sample size. EVIDENCE: A
5. **Building What Users Literally Request** — Users can't articulate solutions. INSTEAD: Jobs-to-be-Done. EVIDENCE: B
6. **Ignoring Cognitive Load** — Cowan limit: 4+/-1 chunks. Hick's Law: more options = slower decisions. EVIDENCE: A
7. **Ignoring Fitts's Law** — Apple HIG minimum: 44x44px touch targets. EVIDENCE: A
8. **Mandatory Account Before Value** — Each friction point loses 3-8%. INSTEAD: value-first. EVIDENCE: B
9. **Onboarding Information Dump** — 90% churn if no value in first week. INSTEAD: progressive disclosure. EVIDENCE: B
10. **Feature Bloat** — Cognitive load increases; maintenance exponential. INSTEAD: audit, sunset, "one in, one out." EVIDENCE: B
11. **Say-Do Gap Blindness** — Users rate products highly while struggling. INSTEAD: behavioral analytics. EVIDENCE: A

### Visual Design
12. **Using 4+ Fonts** — Creates visual chaos, resets cognitive processing ~20%. INSTEAD: max 2-3. EVIDENCE: B
13. **Ignoring Whitespace** — Whitespace increases comprehension up to 20%. EVIDENCE: A
14. **Poor Contrast** — WCAG requires 4.5:1 minimum. ~300M people with color deficiency. EVIDENCE: A
15. **Inconsistent Visual Language** — Users cannot build mental models. INSTEAD: design tokens. EVIDENCE: B
16. **Pure Black on Pure White** — Excessive luminance causes eye strain. INSTEAD: near-black on off-white. EVIDENCE: B

## Best Practices (ALWAYS consider)

### Product & UX
1. **Continuous Discovery** — Weekly customer interviews. EVIDENCE: B
2. **5-User Iterative Testing** — ~85% of major problems per round. EVIDENCE: B
3. **Accessible-First Design** — From first sprint. Retrofitting costs 10x. EVIDENCE: A
4. **Cognitive Load Management** — Limit to 3-5 actionable items per screen. EVIDENCE: A
5. **Value-First, Account-Second** — Doubles free-to-paid conversion. EVIDENCE: B
6. **Performance as UX** — 53% abandon at >3s load. Each second costs ~7% conversions. EVIDENCE: A
7. **Error-State-First Design** — Design errors before happy path. EVIDENCE: C
8. **Subtractive Design** — Remove until only essential remains. EVIDENCE: B
9. **Progressive Disclosure** — Essential first; complexity as needed. EVIDENCE: B

### Visual Design
10. **Visual Hierarchy** — Size, weight, color, position guide attention. EVIDENCE: A
11. **Whitespace as Design Element** — Increases comprehension up to 20%. EVIDENCE: A
12. **Design Tokens** — Semantic variables for consistency at scale. EVIDENCE: C
13. **60-30-10 Color Rule** — 60% dominant, 30% secondary, 10% accent. EVIDENCE: B
14. **Limit Line Length (50-75 chars)** — Fastest reading speed. EVIDENCE: A

## 5-Lens Analysis (apply to every UI task)
1. **Art Direction** — Brand guidelines match? Tone, mood, identity?
2. **UX** — Can user accomplish goal? No dead ends? Clear hierarchy?
3. **UI** — All values from tokens? Consistent spacing? Systematic?
4. **Flow** — Where from → what they see → where they go?
5. **Behavior** — All states covered? (Default, Loading, Error, Empty, Disabled)

## BUFF EAT Context (Project-Specific)

### Design System
- Warm editorial aesthetic: cream (#FAF8F4), serif headings (Playfair Display), terracotta accent (#A0522D)
- Tokens in `src/shared/ui/tokens.ts`, components in `src/shared/ui/`
- Inline styles (no Tailwind) — token-bound values only

### 5-Lens for BUFF EAT
1. **Art Direction**: Warm, editorial, approachable. NOT clinical/medical. NOT aggressive fitness bro.
2. **UX**: Swap decision in < 10 seconds? Cognitive load < 4 chunks.
3. **UI**: All tokens? Serif/sans hierarchy? Touch targets 44x44px minimum.
4. **Flow**: Onboarding → List → Swap → Product detail → Back. No dead ends.
5. **Behavior**: Loading for API. Empty for no swaps. Error for failures.

### Key UX Principles
- Neutral tone — never shame for food choices
- "Why before What" — explain reasons for swaps
- Benefit-first messaging — user outcomes, not scores
- Evidence transparency — [RCT]/[SR/MA]/[i] visible but not overwhelming
- Progressive disclosure — don't dump all nutrition data at once

### Anti-Patterns Specific to Fitness Apps
- Information overload (all macros + micros + scores at once)
- Guilt-tripping UI ("unhealthy choice!")
- Gamification of health metrics
- Mandatory signup before seeing list value

See: `.claude/library/domain/domain-design-pipeline.md`, `src/shared/ui/tokens.ts`

## Common LLM Mistakes
1. "Always use mobile-first" — context-first; analytics dashboards need desktop-first
2. "5 users is always enough" — only for qualitative; quantitative needs ~40
3. "More features = more value" — feature bloat; best products do LESS better
4. "Add AI/personalization to improve UX" — thin-data recommendations are worse than none

## Key Sources
- Nielsen Norman Group research corpus
- Teresa Torres. *Continuous Discovery Habits*
- Celia Hodent. *The Gamer's Brain*
- WebAIM Million report; WCAG 2.1
