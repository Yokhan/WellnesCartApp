# Domain Guards — Evidence-Based Anti-Patterns (Condensed)

> Full details: `.claude/skills/domain-*/SKILL.md`
> Evidence hierarchy: A (meta-analysis) > B (RCT) > C (consensus). Lower = INSUFFICIENT for recommendations.

## Health & Fitness (SAFETY-CRITICAL — evidence enforcement mandatory)
**NEVER**: "10% brain" myth, learning styles, detox diets, spot reduction, "no pain no gain", megadose vitamins, stretching prevents injury, cardio-only fat loss, BCAAs when protein adequate, alkaline water/diets
**ALWAYS**: sleep 7-9h, 150min/week exercise, progressive overload, protein 1.6-2.2g/kg, active recovery, Mediterranean pattern, fiber 25-35g/day, creatine 3-5g/day, vitamin D in northern climates
**RULE**: Every health recommendation MUST cite evidence level [RCT] / [SR/MA] / [i] + source. No level = do NOT recommend.

## Software Development
**NEVER**: magic numbers, swallowing exceptions, god objects, premature optimization, copy-paste code, stringly-typed, cargo cult architecture, no tests before refactor, reinventing crypto, mutable global state
**ALWAYS**: YAGNI, strangler fig migration, immutability default, fail fast, vertical slices, trunk-based dev, dependency inversion at boundaries, observability triad, meaningful naming, small focused functions

## Business & Finance
**NEVER**: scaling before PMF, ignoring unit economics, timing the market, hiring too fast, single channel dependency, building before validating, revenue = profit confusion
**ALWAYS**: validate before building, retain > acquire, index fund core, 18+ months runway, fire fast hire slow, pricing on value, 13-week cash flow forecast

## Design (UX/UI/Game)
**NEVER**: feature factory, dark patterns, accessibility overlays, A/B cargo cult, tutorial info dump, 4+ fonts, pixel-perfect obsession, mandatory account before value, ignoring cognitive load
**ALWAYS**: continuous discovery, 5-user testing, accessible-first, flow channel, core loop first, performance as UX, subtractive design, error-state-first, visual hierarchy via contrast/space

## Marketing & Sales
**NEVER**: vanity metrics, content without distribution, SEO gaming, spray-and-pray outreach, discounting to close, fake urgency, feature-led messaging, fake social proof
**ALWAYS**: mental availability + physical availability, 60/40 brand/performance (Binet & Field), SPIN selling, benefit-first messaging, buyer journey mapping, genuine social proof

## Science & Reasoning
**NEVER**: p-hacking, HARKing, publication bias, correlation=causation, cherry-picking, small sample overgeneralization, single study as definitive
**ALWAYS**: pre-registration, effect sizes over p-values, replication weighting, Bayesian reasoning, steelmanning, falsifiability, confidence intervals

## Cross-Domain Red Flags
- **Premature optimization** — complex systems before understanding needs
- **Cargo cult** — copying without understanding WHY; do those conditions exist here?
- **Survivorship bias** — learning only from successes
- **One-size-fits-all** — every practice has boundary conditions
- **Sunk cost escalation** — "If starting fresh, would I choose this?" If no, cut now
- **Authority over evidence** — evaluate claims by data quality, not source prestige
- **Base rate neglect** — always apply Bayes before interpreting evidence
- **Planning fallacy** — use reference class forecasting; buffer 50-100%
