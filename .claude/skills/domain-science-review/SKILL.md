---
description: "Review research methodology and decision-making against evidence-based reasoning. Detects p-hacking, cognitive biases, logical fallacies."
---
# Domain Science Review

## How to Use
When reviewing research claims, methodology, or reasoning quality, check against these practices.
This is a META-DOMAIN — critical thinking and decision quality underpin all other domains.

**Evidence Scale:** A = replicated experimental evidence/meta-analyses. B = well-supported by multiple studies. C = theoretical/expert consensus.

## Anti-Patterns (NEVER recommend)

### Statistical & Methodological
1. **P-Hacking** — Testing multiple analyses until p<0.05. INSTEAD: pre-register, Bonferroni correction. EVIDENCE: A
2. **HARKing** — Hypothesizing After Results Known. INSTEAD: separate exploratory vs confirmatory. EVIDENCE: A
3. **Publication Bias** — Only positive results published. INSTEAD: registered reports, publish null results. EVIDENCE: A
4. **Confusing Correlation with Causation** — INSTEAD: RCTs, natural experiments, causal inference (DAGs). EVIDENCE: A
5. **Cherry-Picking Data** — INSTEAD: pre-specify analysis plan, report ALL results. EVIDENCE: A
6. **Survivorship Bias** — Studying only successes. INSTEAD: include failures in analysis. EVIDENCE: A
7. **Ignoring Effect Size** — p-values alone say nothing about practical significance. INSTEAD: Cohen's d, odds ratio. EVIDENCE: A
8. **Goodhart's Law** — Metric as target ceases to measure. INSTEAD: multiple orthogonal metrics. EVIDENCE: B

### Cognitive Biases
9. **Confirmation Bias** — Seeking confirming evidence. FIX: consider-the-opposite; "what would change my mind?" EVIDENCE: A
10. **Anchoring Effect** — Over-relying on first info. FIX: generate own estimate BEFORE seeing anchor. EVIDENCE: A
11. **Availability Heuristic** — Judging by ease of recall. FIX: use actual statistics. EVIDENCE: A
12. **Sunk Cost Fallacy** — Continuing because of past spending. FIX: "If starting fresh, would I choose this?" EVIDENCE: A
13. **Planning Fallacy** — Underestimating time/cost. FIX: reference class forecasting. EVIDENCE: A
14. **Dunning-Kruger** — Least competent overestimate. FIX: calibration training, external feedback. EVIDENCE: A
15. **Groupthink** — Conformity suppressing dissent. FIX: devil's advocate, anonymous input. EVIDENCE: A
16. **Base Rate Neglect** — Ignoring prior probability. FIX: Bayesian reasoning. EVIDENCE: A

### Logical Fallacies
17. **Appeal to Authority** — Evaluate evidence, not credentials. EVIDENCE: B
18. **Appeal to Nature** — Naturalness has zero correlation with safety. EVIDENCE: B
19. **False Dichotomy** — Brainstorm 3+ options before deciding. EVIDENCE: C
20. **Straw Man** — INSTEAD: steelman — strongest version of opposing argument. EVIDENCE: C

## Best Practices (ALWAYS consider)

### Evidence Evaluation
1. **Evidence Hierarchy** — Systematic Review > RCT > Cohort > Case > Expert > Anecdote. EVIDENCE: A
2. **Pre-Registration** — Register hypotheses before data collection. EVIDENCE: A
3. **Effect Size + Confidence Intervals** — Report magnitude and uncertainty. EVIDENCE: A
4. **Replication Weighting** — Weight replicated findings 3-5x over single studies. EVIDENCE: A
5. **Bayesian Reasoning** — Update beliefs proportionally to evidence strength. EVIDENCE: A
6. **Premortem Analysis** — Imagine it failed; work backward to identify causes. EVIDENCE: B

### Critical Thinking
7. **Steelmanning** — Construct strongest opposing argument before rebutting. EVIDENCE: C
8. **Reference Class Forecasting** — Base rates from similar past cases. EVIDENCE: A
9. **Seek Disconfirming Evidence** — Directly counters confirmation bias. EVIDENCE: A
10. **Calibration Training** — Track prediction accuracy over time. EVIDENCE: A
11. **Decision Journal** — Record decisions, reasoning, expected outcomes. EVIDENCE: C
12. **Reversibility Check** — Type 1 (irreversible, care) vs Type 2 (reversible, speed). EVIDENCE: C

### Research
13. **Sensitivity Analysis** — Test if conclusions change under different assumptions. EVIDENCE: A
14. **Specify Boundary Conditions** — State when a finding does and does NOT apply. EVIDENCE: B
15. **Cross-Validation** — Test models on held-out data. EVIDENCE: A

## Cross-Domain Red Flags
- **Premature optimization** — complex systems before understanding needs
- **Cargo cult** — copying without understanding WHY
- **Survivorship bias** — learning only from successes
- **Base rate neglect** — always apply Bayes
- **Planning fallacy** — buffer 50-100%
- **Narrative fallacy** — stories are not evidence

## Common LLM Mistakes
1. Presenting single studies as definitive
2. Fabricating citations
3. False precision ("23.7% improvement")
4. Conflating correlation and causation
5. Overconfidence in reasoning
6. Missing boundary conditions

## Key Sources
- Kahneman. *Thinking, Fast and Slow*
- Ioannidis. "Why Most Published Research Findings Are False" (2005)
- Tetlock. *Superforecasting*
- Tversky & Kahneman. Prospect Theory (1979)
- Open Science Collaboration. "Reproducibility" (2015)
