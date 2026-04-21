---
description: "Review health, fitness, and medical recommendations against evidence-based medicine and exercise science. Detects broscience, neuromyths, supplement hype."
---
# Domain Health Review

## How to Use
When reviewing health, fitness, nutrition, or medical advice, check against these evidence-based practices.
This domain is SAFETY-CRITICAL. Bad advice can cause real harm.

**IMPORTANT:** AI should NEVER replace medical diagnosis or treatment.

**Evidence Scale:** A = Cochrane/meta-analysis. B = RCT or high-quality cohort. C = expert consensus/narrative review.

## Anti-Patterns (NEVER recommend)

### Neuromyths
1. **"We only use 10% of our brain"** — Neuroimaging shows all regions are active. EVIDENCE: B
2. **Learning Styles (VAK)** — 189-study SR found no evidence. INSTEAD: multimodal instruction, retrieval practice, spaced repetition. EVIDENCE: A
3. **"Left-brain / Right-brain"** — 1,011-subject fMRI found no lateralization. EVIDENCE: A
4. **Brain Training Games Transfer** — FTC fined Lumosity $2M for false claims. INSTEAD: exercise (BDNF), sleep, learning complex skills. EVIDENCE: A
5. **"Dopamine Detox"** — Dopamine signals prediction error, doesn't deplete. INSTEAD: stimulus control. EVIDENCE: C
6. **Multitasking Effectiveness** — 20-40% efficiency loss per switch (APA). INSTEAD: single-tasking. EVIDENCE: A

### Medical Misconceptions
7. **"Natural = Safe"** — Arsenic is natural; dose makes the poison. INSTEAD: evaluate by evidence. EVIDENCE: B
8. **"Detox" Diets/Products** — No evidence beyond what liver/kidneys already do. EVIDENCE: A
9. **Supplement Megadosing** — Most above RDA show no benefit and can harm. INSTEAD: supplement only documented deficiencies via blood test. EVIDENCE: A
10. **"Spot Reduction" of Fat** — Fat loss is systemic, not local. INSTEAD: overall caloric deficit + resistance training. EVIDENCE: A
11. **Self-Diagnosing via AI** — Diagnostic accuracy only 51-73%. INSTEAD: professional evaluation. EVIDENCE: A
12. **"Stretching Prevents Injury"** — Static stretching before exercise does NOT reduce injury risk. INSTEAD: dynamic warm-up. EVIDENCE: A

### Fitness Myths
13. **"No Pain, No Gain"** — Pain is a warning signal. INSTEAD: distinguish discomfort from pain. EVIDENCE: B
14. **"Cardio Kills Gains"** — Moderate cardio doesn't impair hypertrophy. Interference only at very high volumes. EVIDENCE: A
15. **"30-Minute Anabolic Window"** — Total daily protein matters more than timing. INSTEAD: distribute across 3-5 meals. EVIDENCE: A
16. **"Women Shouldn't Lift Heavy"** — Resistance training reduces osteoporosis, improves metabolic health. EVIDENCE: A
17. **Extreme Caloric Restriction** — VLCDs (<1200 kcal) trigger metabolic adaptation. INSTEAD: 300-500 kcal/day deficit. EVIDENCE: A
18. **"Keto/Carnivore for Everyone"** — No long-term superiority of any specific ratio. INSTEAD: adherence-first approach. EVIDENCE: A
19. **Fasted Cardio for Fat Loss** — No body composition difference. Total daily calories matter. EVIDENCE: A

### Supplement Myths
20. **"Protein Damages Kidneys"** — In healthy individuals, no damage. Concern applies only to pre-existing disease. EVIDENCE: A
21. **BCAAs When Protein Is Adequate** — If 1.6-2.2g/kg met, BCAAs add nothing. EVIDENCE: A
22. **Alkaline Water/Diets** — Body regulates pH; stomach acid neutralizes. No evidence. EVIDENCE: A
23. **Collagen Supplements for Skin** — Digested into amino acids like any protein. INSTEAD: adequate protein + sun protection. EVIDENCE: B

## Best Practices (ALWAYS consider)

### Exercise
1. **Progressive Overload** — Gradually increase stimulus. Fundamental principle of adaptation. EVIDENCE: A
2. **Resistance Training 2-4x/Week** — All major muscle groups weekly. EVIDENCE: A
3. **150+ Minutes Moderate Cardio/Week** — Reduces all-cause mortality 30-40%. EVIDENCE: A
4. **Sleep 7-9 Hours** — Foundational for cognition, recovery, hormones. EVIDENCE: A
5. **Protein 1.6-2.2g/kg** — Distributed across 3-5 meals daily. EVIDENCE: A
6. **Dynamic Warm-Up** — Movement-based, not static stretching. EVIDENCE: A
7. **Moderate Caloric Deficit** — 300-500 kcal/day for fat loss. EVIDENCE: A
8. **Compound Movements** — Squat, hinge, press, pull, carry patterns. EVIDENCE: B

### Nutrition
9. **Whole Foods Priority** — Minimize ultra-processed food. EVIDENCE: A
10. **Adequate Fiber (25-35g/day)** — From diverse plant sources. EVIDENCE: A
11. **Hydrate to Thirst** — Monitor urine color. EVIDENCE: B
12. **Limit Added Sugar** — <25g/day women, <36g/day men. EVIDENCE: A
13. **Supplement Only Documented Deficiencies** — Blood test first. Exception: vitamin D northern climates. EVIDENCE: A
14. **Creatine Monohydrate (3-5g/day)** — Hundreds of studies confirm safety and efficacy. EVIDENCE: A
15. **Omega-3 (250-500mg EPA+DHA)** — Most Western diets deficient. EVIDENCE: A
16. **Vitamin D in Northern Climates** — 1000-2000 IU/day. EVIDENCE: A
17. **Mediterranean Dietary Pattern** — Reduces CVD, cognitive decline, mortality. EVIDENCE: A

### Mental Health
18. **Exercise for Mental Health** — As effective as medication for mild-moderate depression. EVIDENCE: A
19. **Evidence-Based Therapy** — CBT, DBT matched to condition. EVIDENCE: A
20. **Sleep Hygiene** — Consistent schedule, dark/cool room. EVIDENCE: A

## BUFF EAT Context (Project-Specific)

This app is a fitness grocery shopping assistant. Health review is CRITICAL here.

### Always Enforce
- NutriScore-2023 as primary quality metric (RCT n=21,159, OR=29.0) [ADR-001]
- NOVA classification as ultra-processing indicator (45 meta-analyses, associative) [ADR-001]
- Evidence levels on ALL nutritional claims: [RCT] / [SR/MA] / [i]
- Protein 1.6-2.2g/kg for active individuals (meta-analysis optimal range)
- Moderate caloric deficit 300-500 kcal/day for fat loss (preserves lean mass)
- Planned Indulgence = weekly compensation, not daily [ADR-013]

### Never Allow
- Mixing NutriScore and Composite Score into one final score [ADR-014]
- Blocking user's favorite products without explanation (Planned Indulgence)
- Recommending supplements without documented deficiency
- Making definitive dietary declarations without adherence caveat
- Taste Engine influence on Quality Gate (separate systems) [ADR-005]

### Project-Specific Rules
- Swaps ONLY within same convenience_tier AND overlapping use_context [ADR-002]
- Progressive model: 4 stages with explicit triggers, no forced transitions [ADR-003]
- Bootstrap baskets for cold-start, NOT LP-optimization on empty data [ADR-012]
- Population-based deficiency warnings for northern latitudes: Vitamin D, Mg, Iodine (with disclaimers)

See: `docs/BRD.md`, `docs/EVIDENCE_BASE.md`, `.claude/library/domain/buff-eat-guards.md`

## Common LLM Mistakes
1. Recommending supplements without caveats
2. Repeating neuromyths ("10% brain", "learning styles")
3. Presenting single studies as definitive
4. Oversimplifying mental health
5. Generic fitness advice without context
6. Definitive dietary declarations
7. Confusing correlation with causation in nutrition studies

## Key Sources
- Cochrane Library systematic reviews
- WHO guidelines (physical activity, nutrition)
- Schoenfeld meta-analyses (protein timing, resistance training)
- ACSM position stands
- Moncrieff et al. (2022) serotonin hypothesis review
