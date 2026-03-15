# SmartCart PVM — Architecture

**Дата:** Март 2026

---

## Высокоуровневая архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                    КЛИЕНТ (Frontend)                        │
│  React Native (iOS/Android) / Telegram Mini App             │
│  ─────────────────────────────────────────────              │
│  Онбординг → Список покупок → Свопы → Детали товара        │
│  Профиль → Настройки → Дашборд тренера (v2)                │
└─────────────────┬───────────────────────────────────────────┘
                  │ REST API / WebSocket (уведомления)
┌─────────────────▼───────────────────────────────────────────┐
│                    BACKEND (Python)                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │ Auth &   │ │ List     │ │ Scoring  │ │ Taste Engine  │  │
│  │ Profile  │ │ Builder  │ │ Pipeline │ │ (CF + SVD)    │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │ Price    │ │ Product  │ │ Quality  │ │ Vision AI     │  │
│  │ Scraper  │ │ Ingester │ │ Gate     │ │ (фото холод.) │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────┘  │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                    ДАННЫЕ                                    │
│  ┌──────────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │ PostgreSQL       │  │ pgvector     │  │ Redis         │ │
│  │ (6 доменов)      │  │ (taste       │  │ (кэш цен,    │ │
│  │                  │  │  vectors)    │  │  сессии)      │ │
│  └──────────────────┘  └──────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                ВНЕШНИЕ ИСТОЧНИКИ                             │
│  ┌────────────┐ ┌────────────────┐ ┌─────────────────────┐  │
│  │ Честный    │ │ OpenFoodFacts  │ │ Парсинг магазинов   │  │
│  │ знак API   │ │ API            │ │ (Пятёрочка,         │  │
│  │            │ │                │ │  Перекрёсток,       │  │
│  │            │ │                │ │  ВкусВилл)          │  │
│  └────────────┘ └────────────────┘ └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Пайплайн трёх систем

Товары проходят через три системы последовательно:

```
Все товары магазина
    ↓
[Quality Gate] → отсекает ~30-40% товаров
    ↓
Прошедшие товары
    ↓
[Value Score] → сортирует по нутри-эффективности для профиля
    ↓
Топ-кандидаты
    ↓
[Taste Engine] → доранжирует по вкусовым предпочтениям
    ↓
Финальный список покупок
```

**Важно:** каждая система блокирует следующую, но не заменяет её:
- Quality Gate убирает плохие товары
- Value Score выбирает эффективные
- Taste Engine делает выбор приятным

Убери любое звено — система либо рекомендует вредное, либо игнорирует вкус, либо предлагает дорогое.

---

## Модули backend

### Auth & Profile
- Регистрация через Telegram OAuth / email
- Хранение профиля питания (user_nutrition_profiles)
- Invite-link для тренеров
- Управление sacred_items и indulgence_items

### Product Ingester
- Импорт товаров из Честного знака API
- Импорт из OpenFoodFacts API
- Маппинг и дедупликация по barcode (EAN-13)
- Обогащение convenience_tier и use_context (LLM-assisted)

### Price Scraper
- Парсинг мобильных API Пятёрочки, Перекрёстка, ВкусВилла
- Обновление каждые ≤24 часа
- Детекция промо/акций
- Кэш в Redis с TTL

### Quality Gate
- Расчёт NutriScore-2023 (алгоритм A-E)
- Определение NOVA-класса (1-4)
- Проверка трансжиров (порог EFSA)
- Проверка эмульгаторов (E466, E471-E475)
- Проверка натрия (>1.5г/100г)
- Хранение результатов в quality_gate_results

### Scoring Pipeline
- Расчёт Value Score под конкретный профиль пользователя
- Блок A: NutriScore (из Quality Gate)
- Блок B: ₽/г белка, ₽/100ккал, ₽/приоритетный нутриент
- Калибровка весов по бюджету пользователя
- Кэширование в value_scores

### List Builder
- Генерация недельного списка покупок
- Подбор свопов внутри функциональных слотов (convenience_tier + use_context)
- Учёт Planned Indulgence
- Учёт прогрессивного этапа (1/2/3/4)
- Снапшоты цен и scores

### Taste Engine
- Сбор событий (user_product_interactions)
- Агрегация taste_weight (user_product_taste)
- Гибридный алгоритм: SVD + content-based + NutriScore re-ranking
- Кластеризация пользователей (user_clusters)
- Обновление векторов (user_taste_vectors) — батч раз в час
- Холодный старт: 0-10 → только Value Score; 10-50 → item-based CF; 50+ → полный гибрид

### Vision AI (RF-10)
- Распознавание товаров на фото холодильника/шкафа
- Fine-tuned YOLOv8 / LLM Vision на российских продуктах
- Маппинг распознанного к products.barcode
- Confidence threshold <70% → подтверждение пользователем

---

## BCT-матрица (Behaviour Change Techniques)

Техники изменения поведения, встроенные в продукт (только с доказательной базой из SR/RCT):

| BCT | Реализация в продукте | Доказанность |
|-----|----------------------|-------------|
| Goal setting | Профиль: цель, бюджет, норма белка | SR + NICE guidelines [RCT] |
| Self-monitoring | Виджет белок/жиры/углеводы за неделю | Сильнейший BCT в dietary apps [RS] |
| Behaviour substitution | «Замени X на Y, +15г белка» | SR по BCT effectiveness |
| Action planning | Список готов заранее, в воскресенье | Decision fatigue review |
| Habit formation | Еженедельная пересборка в одно время | SR по habit formation [SR/MA] |
| Feedback on behaviour | «На этой неделе ты добрал на 40г больше» | SR по BCT effectiveness [RCT] |
| Planned indulgence | Любимые продукты учтены в плане | SR по food choice barriers |
| Graded task assignment | Темп изменений настраивается пользователем | SR по dietary interventions |

---

## Зависимости модулей

```
shared/ ← core/ ← features/ ← adapters/UI
```

- `shared/` — типы, валидаторы, утилиты. Не зависит ни от кого.
- `core/` — доменная логика (Quality Gate, Value Score, Taste Engine алгоритмы). Зависит только от shared/. Нет IO.
- `features/` — vertical slices (auth, list, scoring, taste). Зависит от shared/ и core/.

---

## Фоновые процессы

| Процесс | Расписание | Действие |
|---------|-----------|----------|
| Price Scraper | Каждые 12–24 часа | Обновление цен из магазинов |
| List Generator | Пятница вечер / воскресенье | Генерация списков на неделю |
| Taste Vector Update | Каждый час | Пересчёт user_taste_vectors |
| Quality Gate Refresh | При обновлении product_nutrients | Пересчёт quality_gate_results |
| Value Score Refresh | При изменении профиля или цен | Пересчёт value_scores |
| Promo Detector | Каждые 6 часов | Поиск акций в каталогах |

---

## Технологический стек (детали)

| Слой | Технология | Почему |
|------|-----------|--------|
| Frontend | React Native / Expo | Кроссплатформенность, hot reload |
| Frontend (MVP) | Telegram Mini App | Быстрый старт без установки |
| Backend API | Python + FastAPI | Async, типы, OpenAPI |
| ML/Scoring | Python + scikit-learn | SVD, кластеризация |
| LLM | GPT-4o / Llama (self-hosted) | Классификация convenience_tier, use_context |
| БД | PostgreSQL 16 | Реляционная модель, сложные JOIN |
| Векторы | pgvector | ANN-поиск, не отдельный сервис |
| Кэш | Redis | Цены, сессии, rate limiting |
| Хранилище | Supabase | Auth + Storage + Realtime |
| Vision | YOLOv8 / LLM Vision | Распознавание товаров на фото |
| CI/CD | GitHub Actions | Typecheck + lint + test gates |
