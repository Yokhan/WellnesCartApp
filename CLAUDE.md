# SmartCart PVM

Умный помощник закупки продуктов для фитнес-тренеров и их клиентов. Убирает необходимость думать о еде каждый день — готовый список покупок, который подстраивается под привычки и тихо улучшает их.

## Стек

- **Frontend:** React Native (iOS + Android) / Telegram Mini App (для быстрого старта)
- **Backend:** Python + LLM (GPT-4o / Llama) для scoring и подбора
- **БД:** PostgreSQL + pgvector (векторы для Taste Engine)
- **Хранилище профилей:** Supabase / Firebase
- **Данные о продуктах:** Честный знак + OpenFoodFacts + парсинг каталогов магазинов
- **Цены:** Парсинг / API мобильных приложений Пятёрочки, Перекрёстка, ВкусВилла

## Карта проекта

- `src/features/` — vertical slices, каждый с index.ts
- `src/shared/` — типы, утилиты, валидаторы
- `src/core/` — доменная логика (без IO)
- `docs/` — спецификации, архитектура, ADR, доказательная база
- `templates/` — scaffolding-шаблоны для новых модулей
- `_reference/` — эталонные реализации
- `scripts/` — утилиты (drift detection и др.)

## Три ключевых системы

1. **Quality Gate** — фильтрация товаров по NutriScore-2023, NOVA, трансжирам (docs/BRD.md#RF-02)
2. **Value Score** — экономическая эффективность: NutriScore + ₽/нутриент (docs/BRD.md#RF-03)
3. **Taste Engine** — коллаборативная фильтрация для retention (docs/BRD.md#RF-06)

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

Перед работой определи, что релевантно задаче:

- `docs/BRD.md` — полные бизнес-требования, юзкейсы, user stories
- `docs/DATA_DESIGN.md` — схема PostgreSQL + pgvector (6 доменов)
- `docs/ARCHITECTURE.md` — модули и зависимости, пайплайн трёх систем
- `docs/EVIDENCE_BASE.md` — доказательная база (RCT/SR/MA)
- `docs/DECISIONS.md` — архитектурные решения (ADR)
- `docs/API_CONTRACTS.md` — API контракты
- `_reference/README.md` — эталонные реализации

## Scaffolding

При создании нового модуля — СНАЧАЛА посмотри templates/[тип]/ и используй как каркас.

## DON'T

- Файлы > 250 строк — разбивай
- Нет `any` — используй `unknown` + type guards
- Нет мутаций — возвращай новые объекты
- Нет нутритивных утверждений без указания уровня уверенности ([RCT] / [SR/MA] / [i])
- Свопы только внутри одного convenience_tier и use_context
- Не запрещать пользователю любимые продукты ("Planned Indulgence")

## Compaction

Сохраняй: текущую задачу, изменённые файлы, результаты тестов, найденные проблемы, контекст трёх систем (Quality Gate, Value Score, Taste Engine).
