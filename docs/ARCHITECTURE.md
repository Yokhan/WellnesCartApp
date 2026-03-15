# SmartCart PVM — Architecture

**Дата:** Март 2026

---

## Высокоуровневая архитектура (MVP)

```
┌─────────────────────────────────────────────────────────────┐
│                    КЛИЕНТ (Frontend)                        │
│  React Native (iOS/Android) / Telegram Mini App             │
│  ─────────────────────────────────────────────              │
│  Онбординг → Список покупок → Свопы → Детали товара        │
│  Профиль → Настройки → Planned Indulgence                  │
└─────────────────┬───────────────────────────────────────────┘
                  │ REST API / WebSocket (уведомления)
┌─────────────────▼───────────────────────────────────────────┐
│                    BACKEND (Python + FastAPI)                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │ Auth &   │ │ List     │ │ Scoring  │ │ Indulgence    │  │
│  │ Profile  │ │ Builder  │ │ Pipeline │ │ Planner       │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                     │
│  │ Price    │ │ Product  │ │ Quality  │                     │
│  │ Scraper  │ │ Ingester │ │ Gate     │                     │
│  └──────────┘ └──────────┘ └──────────┘                     │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                    ДАННЫЕ                                    │
│  ┌──────────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ PostgreSQL 16     │  │ Redis        │  │ Supabase      │  │
│  │ (6 доменов)       │  │ (кэш цен,    │  │ (Auth +       │  │
│  │                   │  │  сессии)     │  │  Storage)     │  │
│  └──────────────────┘  └──────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                ВНЕШНИЕ ИСТОЧНИКИ                             │
│  ┌────────────────┐ ┌─────────────────────────────────────┐  │
│  │ OpenFoodFacts  │ │ Парсинг магазинов (Пятёрочка,        │  │
│  │ API            │ │  Перекрёсток, ВкусВилл)             │  │
│  └────────────────┘ └─────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**NOT MVP (v1.5+):** Taste Engine (CF + SVD + pgvector), Vision AI

---

## Пайплайн двух систем (MVP)

Товары проходят через два фильтра последовательно:

```
Все товары магазина + universal_products
    ↓
[Quality Gate]
  → отсекает ~30–40% товаров (NutriScore D/E, NOVA4+C, трансжиры)
    ↓
Прошедшие товары
    ↓
[Value Score / LP-оптимизация]
  → LP генерирует корзину: max(composite_score) s.t. бюджет, белок, калории
  → Composite Score ранжирует замены внутри слотов
    ↓
Финальный список покупок + 3–5 свопов на выбор
```

**Важно:** в MVP нет третьего фильтра (Taste Engine). Свопы ранжируются по composite_score. Вкусовые сигналы (user_product_taste) собираются для v1.5.

---

## Двухуровневая стратегия данных

```
[Tier A: universal_products]          [Tier B: products]
  Куриное филе, Гречка, Яйца           Колбаса Петруха 300г
  Творог 5%, Минтай, ...               Йогурт Чудо клубника...
  ─────────────────────                ─────────────────────
  • Вручную + OpenFoodFacts            • Парсинг каталогов
  • Полный верифицированный состав     • Авто-QG фильтрация
  • Нет дубликатов, ~50-80 позиций     • Расширяется постепенно
  • Доступен с первого дня             • Дополняет Tier A
  • Достаточен для MVP                 • Требует парсинг
```

На холодном старте LP работает только на Tier A. Tier B добавляется по мере парсинга.

---

## Модули backend

### Auth & Profile
- Регистрация через Telegram OAuth / email
- Хранение профиля (user_nutrition_profiles)
- Invite-link для тренеров
- Управление sacred_items

### Product Ingester
- Импорт из OpenFoodFacts API
- Ручное заполнение universal_products
- Маппинг и дедупликация по barcode (EAN-13)
- Разметка convenience_tier и use_context (LLM-assisted → ручная корректировка)

### Price Scraper
- Парсинг мобильных API Пятёрочки, Перекрёстка, ВкусВилла
- Обновление ≤24 часа
- Детекция промо/акций
- Кэш в Redis с TTL
- Обновление data_freshness при каждом цикле

### Quality Gate
- Расчёт NutriScore-2023 (алгоритм A-E)
- NOVA-класс (1-4)
- Проверка трансжиров (порог EFSA)
- Проверка эмульгаторов (E466, E471-E475)
- Проверка натрия (>1.5г/100г)
- Хранение в quality_gate_results

### Scoring Pipeline
- **LP-оптимизация корзины:** scipy.optimize.linprog / PuLP
  - Objective: maximize Σ(composite_score × x)
  - Constraints: бюджет, белок, калории, sacred_items
- **Composite Score для слотов:** w_nutriscore × NS + w_price × (1/₽_protein) + w_deficit × deficit_nutrient
- Веса калибруются по бюджету пользователя (ADR-009)
- Кэш в value_scores

### List Builder
- Запуск LP для генерации корзины
- Формирование 3–5 свопов из лучших composite_score в каждом слоте
- Учёт Planned Indulgence (недельная компенсация)
- Учёт progression_stage (1/2/3/4)
- Снапшоты цен в shopping_list_items

### Indulgence Planner
- Читает user_indulgence_items
- Считает недельный калорийный бюджет с учётом индульгенций
- Перераспределяет компенсацию по неделе (не дню)
- Передаёт скорректированные цели в LP

---

## v1.5: Taste Engine (NOT MVP)

```
Задокументировано для будущей реализации.

Алгоритм: гибридный SVD + content-based + NutriScore re-ranking
Данные: user_product_interactions (уже собираем в MVP)
Новые таблицы: user_taste_vectors (vector(512)), user_clusters
Холодный старт: 0-10 → только Value Score; 10-50 → item-based CF; 50+ → полный гибрид
```

---

## BCT-матрица (Behaviour Change Techniques)

| BCT | Реализация | Доказанность |
|-----|-----------|-------------|
| Goal setting | Профиль: цель, бюджет, норма белка | SR + NICE guidelines [RCT] |
| Self-monitoring | Виджет белок/жиры/углеводы за неделю | [RS, 12+ RCT] |
| Behaviour substitution | «Замени X на Y, +15г белка» | SR по BCT effectiveness |
| Action planning | Список готов заранее, в воскресенье | Decision fatigue review |
| Habit formation | Еженедельная пересборка в одно время | [SR/MA] |
| Feedback on behaviour | «На этой неделе ты добрал на 40г больше» | [RCT] |
| Planned indulgence | Любимые продукты учтены в плане | SR |
| Graded task assignment | Темп изменений настраивается пользователем | SR |

---

## Зависимости модулей

```
shared/ ← core/ ← features/ ← adapters/UI
```

- `shared/` — типы, валидаторы, утилиты. Не зависит ни от кого.
- `core/` — доменная логика (Quality Gate, Value Score, LP алгоритмы). Нет IO.
- `features/` — vertical slices (auth, list, scoring). Зависит от shared/ и core/.

---

## Фоновые процессы

| Процесс | Расписание | Действие |
|---------|-----------|----------|
| Price Scraper | Каждые 12–24 часа | Обновление цен + data_freshness |
| List Generator | Воскресенье вечер | Генерация списков на неделю |
| Quality Gate Refresh | При обновлении product_nutrients | Пересчёт quality_gate_results |
| Value Score Refresh | При изменении профиля или цен | Пересчёт composite_score |
| Promo Detector | Каждые 6 часов | Поиск акций в каталогах |
| Staleness Checker | Каждый час | Обновление data_freshness.status |

---

## Технологический стек

| Слой | Технология | Почему |
|------|-----------|--------|
| Frontend | React Native / Expo | Кроссплатформенность |
| Frontend (MVP) | Telegram Mini App | Быстрый старт без установки |
| Backend API | Python + FastAPI | Async, типы, OpenAPI |
| LP-оптимизация | scipy / PuLP | Линейное программирование |
| Разметка tier/context | LLM (GPT-4o / Llama) | Классификация convenience_tier |
| БД | PostgreSQL 16 | Реляционная модель |
| Кэш | Redis | Цены, сессии, rate limiting |
| Хранилище | Supabase | Auth + Storage |
| CI/CD | GitHub Actions | Typecheck + lint + test gates |
| v1.5: ML/Vectors | pgvector + scikit-learn | SVD, ANN-поиск |
