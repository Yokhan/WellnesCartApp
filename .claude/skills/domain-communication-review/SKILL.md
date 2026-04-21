---
description: "Review text, marketing copy, and communications against evidence-based writing and marketing practices. Detects SEO garbage, manipulation, corporate speak. Key for UI text and swap descriptions."
---
# Domain Communication Review

## How to Use
When reviewing written content, marketing copy, UI text, or any text intended to persuade or inform.
Covers writing craft, marketing strategy, and sales methodology.

**Evidence Scale:** A = large-scale empirical study. B = seminal work/major study. C = expert consensus.

## Anti-Patterns (NEVER recommend)

### Writing
1. **SEO Gaming** — Keyword stuffing, AI-generated mass content. Google March 2024 update demoted 45% of low-value sites. EVIDENCE: A
2. **Wall of Text** — F-pattern: 60-80% of text skipped. INSTEAD: short paragraphs, headers, bullets. EVIDENCE: A
3. **Passive Voice Overuse** — Adds ~20-30% more words, reduces clarity. INSTEAD: active voice default. EVIDENCE: B
4. **Jargon and Buzzwords** — Creates exclusion. INSTEAD: plain language, 8th-grade reading level. EVIDENCE: B
5. **Burying the Lede** — Key info hidden late. INSTEAD: inverted pyramid, important first. EVIDENCE: B
6. **Clickbait Headlines** — Destroys trust, increases bounce. INSTEAD: accurate, compelling. EVIDENCE: B
7. **Hedging Everything** — "Perhaps, it might be argued..." INSTEAD: direct claims with evidence. EVIDENCE: B
8. **Vague Quantifiers** — "Many, several, significant." INSTEAD: specific numbers. EVIDENCE: B
9. **Nominalizations** — "Implementation" instead of "implement." INSTEAD: use the verb form. EVIDENCE: B
10. **Inconsistent Terminology** — "Users" then "customers" then "clients." INSTEAD: one term per concept. EVIDENCE: B

### Marketing
11. **Vanity Metric Obsession** — Impressions have near-zero revenue correlation. INSTEAD: CAC, CLV, conversion, ROAS. EVIDENCE: A
12. **Feature-Led Messaging** — Customers buy outcomes. INSTEAD: benefit-first, feature as proof. EVIDENCE: B
13. **Dark Patterns in Marketing** — Hidden fees, fake urgency. INSTEAD: transparent pricing. EVIDENCE: A
14. **Fake Social Proof** — FTC fines escalating. INSTEAD: genuine testimonials. EVIDENCE: A
15. **Brand Awareness Without Activation** — Binet & Field: brand + activation (60/40 split). EVIDENCE: A
16. **Ignoring Mental Availability** — Sharp: growth from reaching light buyers. INSTEAD: broad distinctive reach. EVIDENCE: A
17. **Over-Segmentation** — Sharp: brands grow through broad reach, not micro-targeting. EVIDENCE: A
18. **Manipulation Disguised as Persuasion** — Hidden motives = permanent trust destruction. EVIDENCE: A

### Sales
19. **Feature Dumping** — Listing every feature. INSTEAD: SPIN Selling questions first. EVIDENCE: A
20. **Closing Tricks** — Negatively correlated with success in complex sales (Rackham, 35,000 calls). EVIDENCE: A
21. **Monologue Pitches** — Top performers ask 11-14 questions; 40/60 talk/listen ratio. EVIDENCE: A

## Best Practices (ALWAYS consider)

### Writing
1. **Inverted Pyramid** — Most important first. EVIDENCE: B
2. **Active Voice Default** — Clearer, more direct, more engaging. EVIDENCE: B
3. **One Idea Per Paragraph** — 2-3 sentences max for web/mobile. EVIDENCE: A
4. **Specific Over Vague** — "23% in 6 months" beats "significantly improved." EVIDENCE: B
5. **Readability (Flesch-Kincaid 6-8)** — Even experts prefer clear writing. EVIDENCE: B
6. **Visual Hierarchy** — Headers, bullets, bold for key points. 79% scan vs read. EVIDENCE: A
7. **Edit Ruthlessly** — Cut 20-30% on every pass. EVIDENCE: C
8. **Plain Language** — Increases comprehension 30-50% across all education levels. EVIDENCE: A
9. **Clear Call to Action** — One per content piece. EVIDENCE: B
10. **Ilyakhov Specificity** — Replace every vague claim with specific evidence. EVIDENCE: B

### Marketing
11. **60/40 Brand/Activation** — Binet & Field IPA Databank: optimizes long-term growth. EVIDENCE: A
12. **Distinctive Brand Assets** — Ehrenberg-Bass: distinctiveness > differentiation. EVIDENCE: A
13. **Broad Reach** — Sharp: growth from penetration, not loyalty. EVIDENCE: A
14. **Benefit-First Messaging** — User outcomes first, features as proof. EVIDENCE: B
15. **Buyer Journey Mapping** — Right message at right stage. EVIDENCE: B
16. **Category Entry Points** — Ehrenberg-Bass: link to more entry points = faster growth. EVIDENCE: A
17. **Genuine Social Proof** — Most powerful persuasion when authentic (Cialdini). EVIDENCE: A

## BUFF EAT Context (Project-Specific)

### UI Copy Principles
- **Russian language**: all user-facing text in Russian
- **Neutral tone**: never shame for food choices ("Ты выбрал нездоровое!" = FORBIDDEN)
- **Benefit-first**: "больше белка за те же деньги" not "NutriScore A vs C"
- **Specificity**: "на 12г больше белка" not "значительно больше белка"
- **Evidence transparency**: [RCT]/[SR/MA]/[i] visible but concise

### Swap Reason Messaging
- Lead with user benefit: "Дешевле на 45₽ при том же белке"
- Support with evidence: "NutriScore A vs C [SR/MA]"
- Never use fear: "Этот продукт вреден!" = WRONG
- Use curiosity: "Есть вариант с лучшим составом" = RIGHT

### Marketing Lens for In-App Content
- 60/40 brand/activation applies to in-app messaging
- Distinctive brand assets: editorial warm tone, serif headings, terracotta accent
- Category entry points: "не знаю что купить", "не добираю белок", "дорого"
- Benefit-first messaging throughout swap descriptions and product cards

### Readability
- Target: simple Russian, 8th-grade equivalent
- Short sentences (max 15-20 words)
- Active voice default
- Avoid jargon: "нутриент-скор" → "оценка качества"

See: `docs/BRD.md` (RF-08 disclaimers), `.claude/library/domain/buff-eat-guards.md`

## Common LLM Mistakes
1. Generating SEO-optimized garbage
2. Corporate speak defaults — delete "leverage", "synergize"
3. Feature-first product descriptions
4. Ignoring Byron Sharp's evidence
5. "Content marketing" as universal solution
6. Recommending closing techniques (negatively correlated with complex sale success)

## Key Sources
- Byron Sharp. *How Brands Grow* (Ehrenberg-Bass)
- Binet & Field. *The Long and the Short of It* (IPA Databank, 1,000+ campaigns)
- Neil Rackham. *SPIN Selling* (35,000 calls, 12 years)
- Cialdini. *Influence*
- NNG scanning behavior research
- Gong.io sales analytics
