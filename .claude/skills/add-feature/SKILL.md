---
description: "Добавление новой фичи в BUFF EAT — 9-step workflow с доменными линзами"
---

# Добавление новой фичи

## Step 0: Naming Conflict Check
Перед созданием ЛЮБОГО файла/функции/типа:
1. `grep -r "ИмяФункции" src/` — нет ли конфликта имён?
2. `grep -r "ИмяТипа" src/` — нет ли дублирования типов?
3. Проверь `src/shared/` — нет ли похожей утилиты?
Подробности: `.claude/library/technical/atomic-reuse.md`

## Step 1: Research
1. Прочитай `docs/BRD.md` — найди RF и UC для этой фичи
2. Прочитай `docs/DATA_DESIGN.md` — какие таблицы затронуты
3. Прочитай `docs/ARCHITECTURE.md` — где в пайплайне Quality Gate → Value Score → Taste Engine
4. Прочитай `tasks/lessons.md` — есть ли уроки по похожим задачам?
Подробности: `.claude/library/process/research-first.md`

## Step 2: Reference
Прочитай `_reference/README.md` — найди каноническую реализацию похожего паттерна.

## Step 3: Plan (для задач M+)
Для нетривиальных задач — составь план перед кодом.
Подробности: `.claude/library/process/plan-first.md`

## Step 4: Scaffold
Используй шаблон из `templates/feature/`:
- `index.ts` — единственный публичный вход
- `*.service.ts` — логика
- `*.types.ts` — типы
- `*.test.ts` — тесты рядом с кодом

## Step 5: Implement
- Каждые 3-4 файла → `npm run typecheck` (batch typecheck)
- Если typecheck падает — фиксить сразу, не накапливать

## Step 6: Test
- Тесты рядом с кодом: `module.test.ts`
- `npm run typecheck && npm run lint && npm test`

## Step 7: Self-Review (доменные линзы)

### Software Lens
- [ ] Файл < 250 строк
- [ ] Импорт только через index.ts
- [ ] core/ — нет IO
- [ ] Нет magic numbers, God Objects, deep nesting
- [ ] Immutability — новые объекты, нет мутаций

### Health Lens (если затрагивает данные/свопы)
- [ ] Нутритивные утверждения с [RCT] / [SR/MA] / [i]
- [ ] Свопы только внутри convenience_tier + use_context
- [ ] NutriScore и Composite Score не смешаны
- [ ] Sacred items не блокируются

### Design Lens (если затрагивает UI)
- [ ] 5-Lens: Art Direction / UX / UI / Flow / Behavior
- [ ] Cognitive load < 4 chunks
- [ ] Нейтральный тон
- [ ] Все состояния покрыты

### Communication Lens (если затрагивает тексты)
- [ ] Benefit-first messaging
- [ ] Русский язык для user-facing
- [ ] Evidence tags на утверждениях

Подробности: `.claude/library/process/self-verification.md`

## Step 8: Commit
- Осмысленное сообщение коммита (не "fix" или "update")
- `typecheck + lint + тесты` прошли

## Step 9: Learn
При получении коррекции от пользователя — записать в `tasks/lessons.md`.
Подробности: `.claude/library/process/self-improvement.md`
