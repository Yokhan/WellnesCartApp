# Эталонные реализации

Эти модули — канонические примеры паттернов проекта. При создании нового модуля используй их как образец для структуры, именования и стиля.

| Паттерн | Эталон | Описание |
|---------|--------|----------|
| Quality Gate | src/core/quality-gate/ | NutriScore-2023 + NOVA + трансжиры |
| Value Score | src/core/value-score/ | Блок A (NutriScore) + Блок B (калькулятор) |
| Swap Engine | src/core/swap-engine/ | Подбор замен внутри convenience_tier + use_context |
| Taste Engine | src/features/taste-engine/ | SVD + content-based + NutriScore re-ranking |
| List Builder | src/features/list-builder/ | Генерация недельного списка покупок |

> **Примечание:** эталоны будут созданы при реализации первых модулей. Этот файл обновляется по мере развития проекта.
