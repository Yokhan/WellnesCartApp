---
description: "Review business, startup, and product decisions against evidence-based practices. Detects startup theater, survivorship bias, premature scaling."
---
# Domain Business Review

## How to Use
When reviewing business strategy, product decisions, or growth planning, check against these practices.

**Evidence Scale:** A = peer-reviewed/large-scale study. B = industry report/credible dataset. C = expert consensus.

## Anti-Patterns (NEVER recommend)

### Startup & Product
1. **Scaling Before PMF** — 74% of startups fail from premature scaling (Startup Genome, n=3,200). INSTEAD: 40%+ monthly retention. EVIDENCE: A
2. **Ignoring Unit Economics** — 19% of deaths from unsustainable economics. INSTEAD: track CAC, LTV from day one. EVIDENCE: B
3. **Perfect Launch Syndrome** — "If v1 doesn't embarrass you, launched too late." INSTEAD: core value + iterate. EVIDENCE: C
4. **Cargo Culting Successful Companies** — What works at 10,000 hurts at 10. INSTEAD: stage-appropriate. EVIDENCE: C
5. **Confusing Users With Customers** — Free-to-paid conversion typically 2-5%. INSTEAD: measure paid conversion. EVIDENCE: B
6. **Building Before Selling** — 43% of failures = no market need. INSTEAD: landing pages, pre-sales, concierge MVP. EVIDENCE: A
7. **Ignoring Churn** — 5% churn reduction = 25-95% profit increase. INSTEAD: fix retention before acquisition. EVIDENCE: B
8. **Survivorship Bias in Strategy** — Study failures equally. EVIDENCE: B
9. **Startup Theater** — Pitch decks and conferences without product. INSTEAD: product, customers, revenue. EVIDENCE: C
10. **Sunk Cost Escalation** — "If starting fresh, would I choose this?" If no, cut. EVIDENCE: A

### Growth
11. **Vanity Metrics** — Page views, downloads mask engagement problems. INSTEAD: activation, retention cohorts. EVIDENCE: B
12. **Growth at All Costs** — Creates zombie companies on funding. INSTEAD: growth with improving unit economics. EVIDENCE: B
13. **Single Customer Dependency** — >30% revenue from one = existential risk. INSTEAD: cap at 25%. EVIDENCE: B

## Best Practices (ALWAYS consider)

1. **Validate PMF Before Scaling** — 40%+ monthly retention threshold. EVIDENCE: A
2. **Unit Economics from Day One** — Track CAC, LTV, gross margin. EVIDENCE: B
3. **Weekly Customer Conversations** — Prevents assumption drift. EVIDENCE: B
4. **13-Week Cash Flow Forecast** — Prevents cash crises. EVIDENCE: B
5. **Stage-Appropriate Processes** — Match complexity to team size. EVIDENCE: C
6. **Churn Reduction Before Acquisition** — Fix leaky bucket first. EVIDENCE: B
7. **Data-Driven Pricing** — Most startups underprice. EVIDENCE: B
8. **Founder-Led Sales Until Repeatable** — First 10-20 deals personally. EVIDENCE: B
9. **Disagree-and-Commit** — Balance quality with speed. EVIDENCE: C
10. **Post-Mortem Culture** — Blameless analysis after failures. EVIDENCE: B

## BUFF EAT Context (Project-Specific)

### Business Model
- B2C fitness grocery assistant (trainers + clients)
- Revenue: subscription (trainer seats) + freemium (individual)
- Key metrics: weekly active lists, swap acceptance rate, trainer client retention
- Cold-start: bootstrap baskets (5 templates) [ADR-012]

### PMF Indicators
- 40%+ weekly retention of onboarded users
- 2+ swaps accepted per user per week
- Trainer inviting 3+ clients within first month
- Users adding items to "sacred" list

### Unit Economics Focus
- CAC through trainer channel (B2B2C) vs direct
- LTV driven by habit formation (~59 days median) [EVIDENCE_BASE]
- Price data freshness directly impacts trust and retention

See: `docs/BRD.md` (UC-01 to UC-07), `docs/DECISIONS.md`

## Common LLM Mistakes
1. "Build it and they will come" — most die from no market need
2. "First-mover advantage is critical" — fast followers win more often
3. "Follow the successful company's playbook" — survivorship bias

## Key Sources
- Startup Genome Report (n=3,200)
- CB Insights Post-Mortem Analysis
- Eric Ries. *The Lean Startup*
- Noam Wasserman. *The Founder's Dilemmas*
