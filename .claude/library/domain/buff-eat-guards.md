# BUFF EAT Domain Guards

> Project-specific rules derived from docs/BRD.md + docs/EVIDENCE_BASE.md.
> These override generic domain guards when in conflict.

## Нутритивная корректность (SAFETY-CRITICAL)

### Evidence Levels (обязательны для КАЖДОГО нутритивного утверждения)
- **[RCT]** — рандомизированное контролируемое исследование
- **[SR/MA]** — систематический обзор / мета-анализ
- **[i]** — механистические данные / expert consensus / observational

### Системы оценки
- **NutriScore-2023** — единственная валидированная FOP-система (RCT n=21,159, OR=29.0). Используется как primary quality metric. [ADR-001]
- **NOVA** — 45 meta-analyses, ассоциативные данные (НЕ RCT). Дополнительный индикатор ультра-обработки.
- **Нельзя** смешивать NutriScore и Composite Score в один итоговый score [ADR-014]
- **NutriScore в России** — несмотря на отсутствие официального статуса, доверие выше Роспотребнадзора [ADR-008]

### Composite Score (Value Score)
- Block A: NutriScore normalized (0-1)
- Block B: ₽/g protein, ₽/100 kcal, ₽/priority nutrient
- Weights варьируются по budget_tier (low → price dominant, high → quality dominant)
- Priority nutrients зависят от goal (bulk/cut/maintain)

## Продуктовая логика

### Свопы (RF-04, ADR-002)
- ТОЛЬКО внутри одного `convenience_tier` (1/2/3) И пересекающегося `use_context`
- Никогда не предлагать meal_base вместо ready_to_eat
- Top-3 альтернативы: #1 best NutriScore, #2 best ₽/target nutrient, #3 best composite
- Фильтровать по allergens и excluded_ingredients пользователя

### Planned Indulgence (RF-07, ADR-013)
- WEEKLY compensation (не daily)
- Нейтральный тон UI — не стыдить за выбор
- Sacred items НЕ блокировать Quality Gate, только показывать warning
- Не запрещать любимые продукты

### Progressive Model (RF-05, ADR-003)
- 4 этапа с явными триггерами перехода
- Stage 1 → 2: 2+ свопа куплены 2+ раза
- Stage 2 → 3: пользователь нажал "хочу больше"
- Stage 3 → 4: пользователь включил автопилот
- Нет принудительного перехода, нет push-давления

### Bootstrap Baskets (RF-09, ADR-012)
- 5 шаблонов как cold-start стратегия
- Выбор по goal_match + budget_fit + store_overlap
- НЕ LP-оптимизация на пустых данных

## Quality Gate (RF-02)

### TIER-1 (Blocking)
- NutriScore D или E → блок
- NOVA-4 + NutriScore C или ниже → блок (одновременно!)
- Трансжиры > EFSA threshold → блок
- Натрий > threshold → блок

### TIER-2 (Warning)
- NOVA-4 + NutriScore B/C → предупреждение
- Эмульгаторы → предупреждение
- Натрий > 1.5g/100g → предупреждение

### TIER-3 (Info)
- Нитрит натрия → информация

### Sacred Items
- НЕ блокировать Quality Gate для sacred items
- Показывать warning с объяснением рисков
- Пользователь решает сам

## UI/UX правила

- Нейтральный тон — не стыдить, не давить, не манипулировать
- Evidence tags ([RCT] / [SR/MA] / [i]) на КАЖДОМ нутритивном утверждении
- "Почему" перед "Что" — объяснять ПРИЧИНЫ замен, не только результат
- Benefit-first messaging для каждого свопа (маркетинговая линза)
- Прозрачность оценки — показывать breakdown composite score
- "Цена актуальна на [дата]" — data freshness indicator

## Два уровня данных (ADR-007)
- **Tier A** (`universal_products`): 50-80 эталонных позиций, полный состав, без парсинга. Достаточен для MVP.
- **Tier B** (`products`): брендовые SKU из парсинга + авто-QG фильтрация. Расширяется постепенно.

## NOT MVP
- Taste Engine (CF + SVD) → v1.5 [ADR-010]
- Vision AI (фото холодильника) → v1.5 [ADR-011]
