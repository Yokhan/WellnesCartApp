# SmartCart PVM — Data Design

**БД:** PostgreSQL 16
**Дата:** Март 2026

---

## Обзор доменов (MVP)

```
[Users] →← [Products] →← [Quality Gate] →← [Value Score] →← [Shopping Lists]
                ↑
      [Universal Products]   [Basket Templates]
```

5 доменов в MVP. Taste Engine (user_taste_vectors, user_clusters) — в v1.5.

---

## Домен 1: Products (товары)

Двухуровневая стратегия: эталонные универсальные продукты + брендовые SKU из парсинга.

```sql
-- Справочник магазинов
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,        -- 'Пятёрочка', 'Перекрёсток', 'ВкусВилл'
    region VARCHAR(100),
    api_type VARCHAR(50)               -- 'parser', 'api', 'manual'
);

-- Tier A: Эталонные универсальные продукты (без дубликатов, полный состав)
-- Заполняется вручную + OpenFoodFacts. Достаточно для MVP без парсинга.
CREATE TABLE universal_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canonical_name VARCHAR(255) NOT NULL, -- 'Куриное филе', 'Гречка', 'Яйца С0'
    category product_category_enum,
    convenience_tier SMALLINT,            -- 1=ready-to-eat, 2=quick-cook, 3=meal-base
    use_context TEXT[],                   -- ['hot_meal','fry_with_egg',...]
    protein_g_per_100g DECIMAL(5,2),
    fat_g_per_100g DECIMAL(5,2),
    carbs_g_per_100g DECIMAL(5,2),
    fiber_g_per_100g DECIMAL(5,2),
    calories_per_100g DECIMAL(6,2),
    nutriscore_grade CHAR(1),             -- A, B, C, D, E
    nova_group SMALLINT,
    notes TEXT,                           -- 'среднее по всем брендам'
    verified_at TIMESTAMPTZ
);

-- Tier B: Брендовые товары из магазинов
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barcode VARCHAR(13) UNIQUE,            -- EAN-13 (может быть NULL для ручных записей)
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    category product_category_enum,
    weight_g INTEGER,                      -- граммов в упаковке
    source VARCHAR(50),                    -- 'open_food_facts' | 'parser' | 'manual'
    universal_product_id UUID REFERENCES universal_products(id), -- ссылка на эталон
    convenience_tier SMALLINT,             -- 1=ready-to-eat, 2=quick-cook, 3=meal-base
    use_context TEXT[],                    -- ['sandwich','fry_with_egg','cold_snack',...]
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Нутрифакты на 100г (для брендовых товаров)
CREATE TABLE product_nutrients (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    nutrient_code VARCHAR(30),             -- 'protein', 'fat', 'carbs', 'fiber', 'calories'
    amount DECIMAL(8,3),
    unit VARCHAR(10),                      -- 'g', 'mg', 'mcg', 'kcal'
    PRIMARY KEY (product_id, nutrient_code)
);

-- Ингредиенты (для Quality Gate)
CREATE TABLE product_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    ingredient VARCHAR(255),
    position INTEGER,                      -- порядок в составе (убывание массовой доли)
    is_allergen BOOLEAN DEFAULT false,
    e_number VARCHAR(10)
);

-- Цены по магазинам
CREATE TABLE product_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    store_id UUID REFERENCES stores(id),
    price_rub DECIMAL(8,2) NOT NULL,
    price_per_100g DECIMAL(6,2) GENERATED ALWAYS AS
        (price_rub / (weight_g::DECIMAL / 100)) STORED,
    is_promo BOOLEAN DEFAULT false,
    promo_price_rub DECIMAL(8,2),
    scraped_at TIMESTAMPTZ DEFAULT now()
);

-- Актуальность данных (аналог 2ГИС: «данные актуальны на ...»)
CREATE TABLE data_freshness (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id),
    data_type VARCHAR(50),                 -- 'prices', 'catalog', 'promotions'
    last_updated_at TIMESTAMPTZ,
    next_update_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'fresh',    -- 'fresh' | 'stale' | 'error'
    error_message TEXT
);

CREATE INDEX idx_product_store ON product_prices(product_id, store_id);
CREATE INDEX idx_scraped_at ON product_prices(scraped_at);
CREATE INDEX idx_products_tier ON products(convenience_tier);
CREATE INDEX idx_products_context ON products USING GIN(use_context);
CREATE INDEX idx_universal_context ON universal_products USING GIN(use_context);
```

---

## Домен 2: Quality Gate

```sql
CREATE TABLE quality_gate_results (
    product_id UUID PRIMARY KEY REFERENCES products(id),
    gate_passed BOOLEAN NOT NULL,
    has_warning BOOLEAN DEFAULT false,

    -- NutriScore-2023
    nutriscore_grade CHAR(1),              -- A, B, C, D, E
    nutriscore_points INTEGER,

    -- NOVA классификация
    nova_group SMALLINT,                   -- 1, 2, 3, 4

    -- Трансжиры (TIER-1)
    trans_fat_g_per_100g DECIMAL(4,2) DEFAULT 0,
    trans_fat_exceeds_threshold BOOLEAN DEFAULT false,

    -- Эмульгаторы (TIER-2)
    has_emulsifiers BOOLEAN DEFAULT false,
    emulsifier_list TEXT[],

    -- Натрий (TIER-2)
    sodium_g_per_100g DECIMAL(4,2) DEFAULT 0,
    sodium_exceeds_threshold BOOLEAN DEFAULT false,

    -- Нитриты (TIER-3, информация)
    has_nitrites BOOLEAN DEFAULT false,

    -- Итоговый tier
    gate_tier SMALLINT,                    -- 1=blocked, 2=warning, 3=info, 0=clean
    blocked_reason TEXT,
    evaluated_at TIMESTAMPTZ DEFAULT now()
);

-- Справочник E-шников с уровнем доказательности
CREATE TABLE additives_registry (
    e_number VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100),
    evidence_tier SMALLINT CHECK (evidence_tier BETWEEN 1 AND 4),
    risk_description TEXT,
    penalty_score DECIMAL(3,1) DEFAULT 0,
    source_reference TEXT,
    notes TEXT
);
```

---

## Домен 3: Users + профили питания

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    telegram_id BIGINT UNIQUE,
    name VARCHAR(100),
    region VARCHAR(100),
    role VARCHAR(20) DEFAULT 'client',     -- 'client' | 'trainer'
    trainer_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_nutrition_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    goal goal_enum,                        -- 'bulk' | 'cut' | 'maintain'
    weight_kg DECIMAL(5,1),
    height_cm SMALLINT,
    age SMALLINT,
    activity_level SMALLINT,               -- 1-5

    -- Недельные цели (г)
    target_protein_g SMALLINT,
    target_fat_g SMALLINT,
    target_carbs_g SMALLINT,
    target_calories SMALLINT,

    -- Ограничения
    allergens TEXT[],                       -- ['лактоза', 'глютен']
    excluded_ingredients TEXT[],

    -- Популяционные дефициты (с дисклеймером)
    priority_nutrients TEXT[],              -- ['vitamin_d', 'magnesium', 'omega3']

    -- Бюджет
    weekly_budget_rub INTEGER,
    preferred_stores UUID[],

    -- Боли из онбординга
    pain_points TEXT[],

    -- Привычки по слотам
    breakfast_type VARCHAR(50),
    sandwich_filling VARCHAR(50),
    dinner_type VARCHAR(50),

    -- Стартовый шаблон корзины
    basket_template_id UUID REFERENCES basket_templates(id),

    -- Прогрессивная модель
    progression_stage SMALLINT DEFAULT 1,  -- 1-4
    progression_pace VARCHAR(20) DEFAULT 'normal',

    updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Домен 3b: Planned Indulgence (отдельная таблица)

Ранее хранилась как TEXT[] в profil. Теперь полноценная таблица с product_id и meal_context.

```sql
CREATE TABLE user_indulgence_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),  -- если есть в базе
    free_text VARCHAR(255),                    -- если продукта нет в базе ('пахлава домашняя')
    serving_g INTEGER,                         -- порция в граммах
    calories_estimate INTEGER,                 -- ккал на порцию
    day_of_week SMALLINT[],                    -- 1=Пн, 5=Пт, 7=Вс
    meal_context VARCHAR(50),                  -- 'breakfast', 'lunch', 'cafe_break', 'evening'
    compensation_strategy VARCHAR(20) DEFAULT 'weekly', -- 'weekly' | 'daily'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- «Неприкосновенные» товары (никогда не убираем из списка)
CREATE TABLE user_sacred_items (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    universal_product_id UUID REFERENCES universal_products(id),
    added_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, product_id)
);
```

---

## Домен 4: Bootstrap-шаблоны корзин

```sql
CREATE TABLE basket_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,           -- 'Качок на наборе'
    description TEXT,
    target_goal goal_enum,                -- 'bulk' | 'cut' | 'maintain'
    budget_tier SMALLINT,                 -- 1=жёсткий, 2=средний, 3=комфортный, 4=премиум
    estimated_weekly_rub INTEGER,
    estimated_protein_g_per_day INTEGER,
    estimated_calories_per_day INTEGER,
    persona_description TEXT,             -- 'Мужчина 25-35 лет, набор, Пятёрочка'
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE basket_template_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES basket_templates(id) ON DELETE CASCADE,
    universal_product_id UUID REFERENCES universal_products(id),
    quantity_per_week DECIMAL(5,2),       -- кг или штук
    unit VARCHAR(20),                     -- 'кг', 'шт', 'уп'
    priority SMALLINT DEFAULT 1           -- порядок в списке
);
```

---

## Домен 5: Value Score

```sql
CREATE TABLE value_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    store_id UUID REFERENCES stores(id),

    -- Блок A: NutriScore
    nutriscore_grade CHAR(1),
    nutriscore_score DECIMAL(4,2),        -- нормализованный 0-1

    -- Блок B: Калькулятор
    price_per_protein_g DECIMAL(6,2),
    price_per_100kcal DECIMAL(6,2),
    price_per_priority_nutrient DECIMAL(6,2),
    slot_median_price DECIMAL(6,2),
    price_vs_median VARCHAR(20),          -- 'cheaper' | 'average' | 'expensive'

    -- Веса (зависят от бюджета)
    w_nutriscore DECIMAL(3,2),
    w_price DECIMAL(3,2),
    w_deficit DECIMAL(3,2),

    -- Итоговый composite score
    composite_score DECIMAL(4,2),

    calculated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, product_id, store_id)
);
```

---

## Домен 6: Взаимодействия + Shopping Lists

```sql
-- Взаимодействия (сигналы для будущего Taste Engine в v1.5)
CREATE TABLE user_product_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    event_type interaction_enum,
    event_weight DECIMAL(3,1),
    list_id UUID,
    rejection_reason VARCHAR(50),
    occurred_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_user_product ON user_product_interactions(user_id, product_id);

-- Агрегированный вкусовой сигнал (для v1.5 Taste Engine)
CREATE TABLE user_product_taste (
    user_id UUID REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    taste_weight DECIMAL(6,3) DEFAULT 0,
    interaction_count INTEGER DEFAULT 0,
    last_interaction TIMESTAMPTZ,
    PRIMARY KEY (user_id, product_id)
);

CREATE TABLE shopping_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(100),
    status list_status_enum,
    total_estimated_rub DECIMAL(8,2),
    total_protein_g DECIMAL(6,1),
    total_fat_g DECIMAL(6,1),
    total_carbs_g DECIMAL(6,1),
    total_calories INTEGER,
    prices_fresh_as_of TIMESTAMPTZ,       -- дата актуальности цен (для офлайн-плашки)
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE shopping_list_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    universal_product_id UUID REFERENCES universal_products(id), -- если из Tier A
    store_id UUID REFERENCES stores(id),
    quantity SMALLINT DEFAULT 1,
    is_checked BOOLEAN DEFAULT false,

    -- Снапшот на момент добавления (цены меняются!)
    snapshot_nutriscore CHAR(1),
    snapshot_composite_score DECIMAL(4,2),
    snapshot_price_rub DECIMAL(8,2),

    -- Метаданные
    added_by add_reason_enum,
    is_sacred BOOLEAN DEFAULT false,
    swap_from_product_id UUID REFERENCES products(id),
    position SMALLINT
);
```

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

## v1.5 (NOT MVP): Taste Engine таблицы

```sql
-- Эти таблицы НЕ создаются в MVP. Помечены для v1.5.

-- CREATE TABLE user_taste_vectors (
--     user_id UUID PRIMARY KEY REFERENCES users(id),
--     embedding vector(512),
--     cluster_id UUID,
--     vector_updated_at TIMESTAMPTZ
-- );

-- CREATE TABLE user_clusters (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     goal goal_enum,
--     budget_tier SMALLINT,
--     region VARCHAR(100),
--     dietary_flags TEXT[],
--     centroid vector(512)
-- );
```

---

## Ключевой SQL: подбор замены внутри слота

```sql
-- Найти замены внутри функционального слота
-- Работает как для products (Tier B), так и для universal_products (Tier A)
SELECT p.*, vs.composite_score, qg.nutriscore_grade
FROM products p
JOIN quality_gate_results qg ON qg.product_id = p.id
JOIN value_scores vs ON vs.product_id = p.id AND vs.user_id = $user_id
WHERE qg.gate_passed = true
  AND p.convenience_tier = $current_tier
  AND p.use_context && $current_contexts     -- GIN index
  AND p.id != $current_product_id
  AND NOT ($current_product_id = ANY(
    SELECT product_id FROM user_product_taste
    WHERE user_id = $user_id AND taste_weight < -0.5
  ))
ORDER BY vs.composite_score DESC
LIMIT 3;
```

---

## LP-оптимизация: входные данные

```sql
-- Данные для LP: все товары с нутрифактами и ценами
SELECT
    p.id,
    pp.price_rub,
    pn_prot.amount AS protein_g,
    pn_cal.amount AS calories,
    vs.composite_score
FROM products p
JOIN product_prices pp ON pp.product_id = p.id AND pp.store_id = ANY($store_ids)
JOIN product_nutrients pn_prot ON pn_prot.product_id = p.id AND pn_prot.nutrient_code = 'protein'
JOIN product_nutrients pn_cal ON pn_cal.product_id = p.id AND pn_cal.nutrient_code = 'calories'
JOIN quality_gate_results qg ON qg.product_id = p.id AND qg.gate_passed = true
JOIN value_scores vs ON vs.product_id = p.id AND vs.user_id = $user_id
WHERE p.category != ALL($excluded_categories);
-- Результат передаётся в scipy.optimize.linprog или PuLP
```
