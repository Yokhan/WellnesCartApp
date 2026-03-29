# SmartCart PVM

Умный помощник закупки продуктов для фитнес-тренеров и их клиентов. Убирает необходимость думать о еде каждый день — готовый список покупок, который подстраивается под привычки и тихо улучшает их.

## Стек

- **Frontend:** React Native (iOS + Android) / Telegram Mini App (для быстрого старта)
- **Backend:** Python + FastAPI. LP-оптимизация через scipy/PuLP.
- **БД:** PostgreSQL 16
- **Хранилище:** Supabase (Auth + Storage)
- **Данные:** OpenFoodFacts + ручное заполнение universal_products + парсинг каталогов магазинов
- **Цены:** Парсинг / API мобильных приложений Пятёрочки, Перекрёстка, ВкусВилла

## Карта проекта

- `src/features/` — vertical slices, каждый с index.ts
- `src/shared/` — типы, утилиты, валидаторы
- `src/core/` — доменная логика (без IO): Quality Gate, Value Score, LP
- `docs/` — спецификации, архитектура, ADR, доказательная база
- `templates/` — scaffolding-шаблоны для новых модулей
- `_reference/` — эталонные реализации
- `scripts/` — утилиты (drift detection и др.)

## Две ключевых системы MVP

1. **Quality Gate** — фильтрация товаров по NutriScore-2023, NOVA, трансжирам (docs/BRD.md#RF-02)
2. **Value Score** — LP-оптимизация корзины + Composite Score для ранжирования свопов (docs/BRD.md#RF-03)

**NOT MVP:** Taste Engine (CF + SVD) → v1.5 | Vision AI (фото холодильника) → v1.5

## Стратегия данных

- **Tier A** (`universal_products`): ~50–80 эталонных позиций, полный состав, без парсинга. Достаточен для MVP.
- **Tier B** (`products`): брендовые SKU из парсинга + авто-QG фильтрация. Расширяется постепенно.

## Команды

- `npm test` / `npm run lint` / `npm run typecheck` / `npm run dev`
- `python -m pytest` (backend)

## Правила

- Импорт ТОЛЬКО через index.ts. Нет прямых импортов из внутренних файлов.
- core/ = чистые функции, нет IO
- Данные (data.ts) отделены от логики (processor.ts)
- Тесты рядом с кодом: module.test.ts
- ВСЕГДА: typecheck + lint + тесты модуля после изменений

## Контекст по запросу

- `docs/BRD.md` — полные бизнес-требования v2, юзкейсы, bootstrap-корзины, math model
- `docs/DATA_DESIGN.md` — схема PostgreSQL (universal_products, basket_templates, indulgence redesign)
- `docs/ARCHITECTURE.md` — модули и зависимости, двухуровневые данные, пайплайн двух систем
- `docs/EVIDENCE_BASE.md` — доказательная база + NutriScore в России
- `docs/DECISIONS.md` — ADR-001 — ADR-014
- `docs/API_CONTRACTS.md` — API контракты
- `_reference/README.md` — эталонные реализации

## Scaffolding

При создании нового модуля — СНАЧАЛА посмотри templates/[тип]/ и используй как каркас.

## DON'T

- Файлы > 250 строк — разбивай
- Нет `any` — используй `unknown` + type guards
- Нет мутаций — возвращай новые объекты
- Нет нутритивных утверждений без уровня уверенности ([RCT] / [SR/MA] / [i])
- Свопы только внутри одного convenience_tier и use_context
- Не запрещать любимые продукты (Planned Indulgence)
- Не смешивать NutriScore и Composite Score в один итоговый score
- Не добавлять Taste Engine в MVP (v1.5)

## Compaction

Сохраняй: текущую задачу, изменённые файлы, результаты тестов, найденные проблемы.
Контекст двух MVP-систем: Quality Gate (NutriScore-2023 + NOVA) → Value Score (LP + Composite Score).


## Template Updates (auto-merged 2026-03-29)

### New Rules
- `.claude/rules/context-first.md`
- `.claude/rules/research-first.md`
- `.claude/rules/plan-first.md`
- `.claude/rules/writing.md`

### New Features
- `PROJECT_SPEC.md` — Auto-generated project spec. Run first session to create.
- Implementer agent has mandatory research + planning phases
- Pipelines (feature/bugfix/security-patch) now include Research step