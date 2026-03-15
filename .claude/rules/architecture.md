# Архитектурные правила

## Границы модулей
- `shared/` не зависит ни от кого
- `core/` зависит только от `shared/`. Нет IO (fetch, DB, fs).
- `features/` зависит от `shared/` и `core/`
- Каждый `features/X/` экспортирует только через `index.ts`

## Vertical Slices
- Каждая фича — автономный модуль со всеми слоями
- Структура: `service.ts`, `types.ts`, `test.ts`, `index.ts`

## Data-Oriented Design
- `data.ts` — конфигурации, таблицы (легко менять)
- `processor.ts` — чистая функция (input, config) => output (стабильно)
- `types.ts` — контракты

## Три системы
- Quality Gate → Value Score → Taste Engine — последовательный пайплайн
- Quality Gate блокирует, Value Score сортирует, Taste Engine доранжирует
- Taste Engine НЕ влияет на Quality Gate

## Свопы
- Замены ТОЛЬКО внутри одного `convenience_tier` и `use_context`
- Никогда не предлагать meal_base вместо ready_to_eat
