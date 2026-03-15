# SmartCart PVM — Data Design

**БД:** PostgreSQL + расширение pgvector (для векторов Taste Engine)
**Дата:** Март 2026

---

## Обзор доменов

```
[Users] →← [Products] →← [Quality Gate] →← [Value Score] →← [Taste Engine] →← [Shopping Lists]
```

6 доменов, все связаны через UUID. Value Score — персональный (один и тот же творог даёт разный score тренеру на наборе и тренеру на сушке).

---

## Домен 1: Products (товары)

Ядро системы. Данные стекаются из Честного знака, OpenFoodFacts, каталогов магазинов.

```sql
-- Справочник магазинов
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,        -- 'Пятёрочка', 'Перекрёсток', 'ВкусВилл'
    region VARCHAR(100),
    api_type VARCHAR(50)               -- 'parser', 'api', 'manual'
);

-- Сам товар
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barcode VARCHAR(13) UNIQUE NOT NULL,           -- EAN-13
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    category product_category_enum,                -- молочка, мясо, бакалея ...
    weight_g INTEGER,                              -- граммов в упаковке
    source VARCHAR(50),                            -- 'honest_sign' | 'open_food_facts'
    convenience_tier SMALLINT,                     -- 1=ready-to-eat, 2=quick-cook 5-10мин, 3=meal-base 20+мин
    use_context TEXT[],                            -- ['sandwich','fry_with_egg','cold_snack',...]
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Нутрифакты на 100г
CREATE TABLE product_nutrients (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    nutrient_code VARCHAR(30),                     -- 'protein', 'fat', 'carbs', 'fiber', 'vitamin_d', 'magnesium', 'omega3', 'calories'
    amount DECIMAL(8,3),                           -- количество
    unit VARCHAR(10),                              -- 'g', 'mg', 'mcg', 'kcal'
    PRIMARY KEY (product_id, nutrient_code)
);

-- Ингредиенты (для Quality Gate)
CREATE TABLE product_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    ingredient VARCHAR(255),                       -- 'картофельный крахмал', 'E202', 'сахар'
    position INTEGER,                              -- порядковый номер в составе (важно!)
    is_allergen BOOLEAN DEFAULT false,
    e_number VARCHAR(10)                           -- если E-шник
);

-- Цены по магазинам
CREATE TABLE product_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    store_id UUID REFERENCES stores(id),
    price_rub DECIMAL(8,2) NOT NULL,
    price_per_100g DECIMAL(6,2) GENERATED ALWAYS AS (price_rub / (weight_g::DECIMAL / 100)) STORED,
    is_promo BOOLEAN DEFAULT false,
    promo_price_rub DECIMAL(8,2),                  -- цена по акции (если есть)
    scraped_at TIMESTAMPTZ DEFAULT now()            -- когда последний раз обновлялась цена
);

CREATE INDEX idx_product_store ON product_prices(product_id, store_id);
CREATE INDEX idx_scraped_at ON product_prices(scraped_at);
```

**Почему `position` в ингредиентах важен:** по российскому закону ингредиенты перечисляются в порядке убывания массовой доли. Это информативный факт, но НЕ используется как критерий в Quality Gate (решение ADR-004).

---

## Домен 2: Quality Gate

Результаты проверки хранятся отдельно и не пересчитываются каждый раз — только при обновлении состава товара.

```sql
CREATE TABLE quality_gate_results (
    product_id UUID PRIMARY KEY REFERENCES products(id),
    gate_passed BOOLEAN NOT NULL,
    has_warning BOOLEAN DEFAULT false,

    -- NutriScore-2023
    nutriscore_grade CHAR(1),                      -- A, B, C, D, E
    nutriscore_points INTEGER,

    -- NOVA классификация
    nova_group SMALLINT,                           -- 1, 2, 3, 4

    -- Трансжиры (TIER-1)
    trans_fat_g_per_100g DECIMAL(4,2) DEFAULT 0,
    trans_fat_exceeds_threshold BOOLEAN DEFAULT false,

    -- Эмульгаторы (TIER-2)
    has_emulsifiers BOOLEAN DEFAULT false,          -- E466, E471-E475
    emulsifier_list TEXT[],

    -- Натрий (TIER-2)
    sodium_g_per_100g DECIMAL(4,2) DEFAULT 0,
    sodium_exceeds_threshold BOOLEAN DEFAULT false,

    -- Нитриты (TIER-3, информация)
    has_nitrites BOOLEAN DEFAULT false,             -- E250

    -- Итоговый tier
    gate_tier SMALLINT,                            -- 1=blocked, 2=warning, 3=info, 0=clean

    blocked_reason TEXT,                            -- человекочитаемая причина блока
    evaluated_at TIMESTAMPTZ DEFAULT now()
);

-- Справочник E-шников с уровнем доказательности
CREATE TABLE additives_registry (
    e_number VARCHAR(10) PRIMARY KEY,              -- 'E202'
    name VARCHAR(100),                             -- 'Тартразин'
    evidence_tier SMALLINT CHECK (evidence_tier BETWEEN 1 AND 4),
    -- 1=RCT+механистические, 2=RCT короткие, 3=обсервационные, 4=безопасны
    risk_description TEXT,
    penalty_score DECIMAL(3,1) DEFAULT 0,
    source_reference TEXT,                          -- ссылка на исследование
    notes TEXT
);
```

---

## Домен 3: Users + профили питания

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    telegram_id BIGINT UNIQUE,                     -- если Telegram Mini App
    name VARCHAR(100),
    region VARCHAR(100),                           -- для региональной кластеризации
    role VARCHAR(20) DEFAULT 'client',             -- 'client' | 'trainer'
    trainer_id UUID REFERENCES users(id),          -- привязка к тренеру (если есть)
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_nutrition_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    goal goal_enum,                                -- 'bulk' | 'cut' | 'maintain'
    weight_kg DECIMAL(5,1),
    height_cm SMALLINT,
    age SMALLINT,
    activity_level SMALLINT,                       -- 1-5

    -- Недельные цели (г)
    target_protein_g SMALLINT,
    target_fat_g SMALLINT,
    target_carbs_g SMALLINT,
    target_calories SMALLINT,

    -- Ограничения
    allergens TEXT[],                               -- ['лактоза', 'глютен']
    excluded_ingredients TEXT[],                    -- ['острое', 'E126']

    -- Приоритетные микронутриенты (популяционные дефициты)
    priority_nutrients TEXT[],                      -- ['vitamin_d', 'magnesium', 'omega3']

    -- Бюджет
    weekly_budget_rub INTEGER,
    preferred_stores UUID[],                       -- ссылки на stores.id

    -- Боли из онбординга
    pain_points TEXT[],                            -- ['low_protein', 'expensive', 'lazy_evening']

    -- Привычки по слотам
    breakfast_type VARCHAR(50),                    -- 'sandwich', 'eggs', 'porridge', 'skip'
    sandwich_filling VARCHAR(50),                  -- 'sausage', 'cheese', 'pate', 'fish'
    dinner_type VARCHAR(50),                       -- 'cook', 'semifinished', 'order'

    -- Planned Indulgence
    indulgence_items TEXT[],                       -- ['кофе с выпечкой пт', 'пахлава']
    sacred_items UUID[],                           -- id товаров-«неприкосновенных»

    -- Прогрессивная модель
    progression_stage SMALLINT DEFAULT 1,          -- 1-4
    progression_pace VARCHAR(20) DEFAULT 'normal', -- 'slow' | 'normal' | 'fast'

    updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Домен 4: Value Score

Value Score персональный — один и тот же творог даёт разный score тренеру на наборе и тренеру на сушке. Кэш пересчитывается при изменении профиля или цен.

```sql
CREATE TABLE value_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    store_id UUID REFERENCES stores(id),

    -- Блок A: NutriScore (из quality_gate_results)
    nutriscore_grade CHAR(1),
    nutriscore_score DECIMAL(4,2),

    -- Блок B: Калькулятор
    price_per_protein_g DECIMAL(6,2),              -- ₽ за 1г белка
    price_per_100kcal DECIMAL(6,2),                -- ₽ за 100 ккал
    price_per_priority_nutrient DECIMAL(6,2),      -- ₽ за единицу приоритетного нутриента
    slot_median_price DECIMAL(6,2),                -- медиана ₽/г белка в слоте
    price_vs_median VARCHAR(20),                   -- 'cheaper' | 'average' | 'expensive'

    -- Веса (зависят от бюджета)
    w_nutriscore DECIMAL(3,2),
    w_price DECIMAL(3,2),
    w_deficit DECIMAL(3,2),

    -- Итоговый composite score
    value_score DECIMAL(4,2),

    calculated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, product_id, store_id)
);
```

---

## Домен 5: Taste Engine

Самая сложная часть — нужны и реляционные таблицы для событий, и векторное хранилище для CF.

```sql
-- Все взаимодействия пользователя с товарами (сырые события)
CREATE TABLE user_product_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    event_type interaction_enum,                   -- 'add_to_list' | 'bought' | 'remove' | 'repeat_buy' | 'like' | 'dislike' | 'ignore'
    event_weight DECIMAL(3,1),                     -- вес события (+0.3, +1.5, -0.5...)
    list_id UUID,                                  -- к какому списку относится
    rejection_reason VARCHAR(50),                  -- 'taste' | 'price' | 'packaging' | 'other' (если remove/dislike)
    occurred_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_user_product ON user_product_interactions(user_id, product_id);
CREATE INDEX idx_occurred ON user_product_interactions(occurred_at);

-- Агрегированный taste score (сумма всех событий по паре user×product)
CREATE TABLE user_product_taste (
    user_id UUID REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    taste_weight DECIMAL(6,3) DEFAULT 0,           -- накопленная сумма весов
    interaction_count INTEGER DEFAULT 0,
    last_interaction TIMESTAMPTZ,
    PRIMARY KEY (user_id, product_id)
);

-- Вектор вкусового профиля пользователя (для pgvector)
-- Обновляется батчем раз в час
CREATE TABLE user_taste_vectors (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    embedding vector(512),                         -- вектор всех взаимодействий
    cluster_id UUID REFERENCES user_clusters(id),
    vector_updated_at TIMESTAMPTZ
);

-- Кластеры пользователей (для контекстной CF)
CREATE TABLE user_clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal goal_enum,                                -- 'bulk' | 'cut' | 'maintain'
    budget_tier SMALLINT,                          -- 1=низкий, 2=средний, 3=высокий
    region VARCHAR(100),
    dietary_flags TEXT[],                           -- ['no_lactose', 'no_gluten']
    centroid vector(512)                           -- центроид кластера для быстрого поиска
);
```

**Почему vector(512) а не хранить просто матрицу:** косинусное сходство на raw-матрице работает медленно при росте базы. pgvector даёт ANN (приближённые ближайшие соседи) поиск за миллисекунды даже на миллионах пользователей.

---

## Домен 6: Shopping Lists

```sql
CREATE TABLE shopping_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(100),                             -- 'Неделя 10–16 марта'
    status list_status_enum,                       -- 'draft' | 'active' | 'purchased'
    total_estimated_rub DECIMAL(8,2),
    total_protein_g DECIMAL(6,1),
    total_fat_g DECIMAL(6,1),
    total_carbs_g DECIMAL(6,1),
    total_calories INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE shopping_list_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    store_id UUID REFERENCES stores(id),
    quantity SMALLINT DEFAULT 1,
    is_checked BOOLEAN DEFAULT false,

    -- Снапшот score на момент добавления (цены меняются!)
    snapshot_nutriscore CHAR(1),
    snapshot_value_score DECIMAL(4,2),
    snapshot_price_rub DECIMAL(8,2),
    snapshot_taste_score DECIMAL(4,2),

    -- Метаданные
    added_by add_reason_enum,                      -- 'auto' | 'manual' | 'recommendation' | 'swap'
    is_sacred BOOLEAN DEFAULT false,               -- неприкосновенный товар
    swap_from_product_id UUID REFERENCES products(id),  -- если это замена — откуда
    position SMALLINT                              -- порядок в списке
);
```

**Зачем снапшоты:** цены в магазинах меняются каждый день. Если пользователь открыл список через 3 дня, он должен видеть актуальные цены, но при этом помнить почему товар был выбран. Снапшот = «было так, когда добавляли», рядом показываем «сейчас стоит столько».

---

## Перечисления (ENUM)

```sql
CREATE TYPE product_category_enum AS ENUM (
    'dairy', 'meat', 'fish', 'poultry', 'eggs',
    'grains', 'bread', 'vegetables', 'fruits',
    'nuts', 'oils', 'beverages', 'snacks',
    'frozen', 'canned', 'condiments', 'other'
);

CREATE TYPE goal_enum AS ENUM ('bulk', 'cut', 'maintain');

CREATE TYPE list_status_enum AS ENUM ('draft', 'active', 'purchased');

CREATE TYPE interaction_enum AS ENUM (
    'add_to_list', 'bought', 'repeat_buy',
    'remove', 'like', 'dislike', 'ignore'
);

CREATE TYPE add_reason_enum AS ENUM ('auto', 'manual', 'recommendation', 'swap');
```

---

## Ключевой SQL: подбор замены внутри слота

```sql
-- Найти замены для товара внутри того же функционального слота
SELECT p.*
FROM products p
JOIN quality_gate_results q ON q.product_id = p.id
WHERE q.gate_passed = true
  AND p.convenience_tier = $current_product_tier        -- тот же уровень удобства
  AND p.use_context && $current_product_contexts        -- хотя бы один контекст совпадает
  AND p.id != $current_product_id
ORDER BY value_score DESC
LIMIT 3;
```

Без условия `convenience_tier` и `use_context` система будет предлагать «гениальные» замены типа «вот тебе кило сырой грудки вместо нарезки».

---

## Индексы

```sql
-- Быстрый поиск товаров по слоту
CREATE INDEX idx_products_tier ON products(convenience_tier);
CREATE INDEX idx_products_context ON products USING GIN(use_context);

-- Быстрый поиск цен по магазину и товару
CREATE INDEX idx_prices_product_store ON product_prices(product_id, store_id);

-- Быстрый поиск взаимодействий пользователя
CREATE INDEX idx_interactions_user ON user_product_interactions(user_id, product_id);

-- ANN-поиск похожих пользователей (pgvector)
CREATE INDEX idx_taste_vectors ON user_taste_vectors USING ivfflat (embedding vector_cosine_ops);
```
