-- Users table (maps to Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  telegram_id BIGINT UNIQUE,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enums
CREATE TYPE user_goal AS ENUM ('bulk', 'cut', 'maintain');
CREATE TYPE activity_level AS ENUM (
  'sedentary','lightly_active','moderately_active','very_active','extra_active'
);

-- User nutrition profiles
CREATE TABLE user_nutrition_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  goal user_goal NOT NULL DEFAULT 'maintain',
  weight_kg NUMERIC(5,2),
  height_cm NUMERIC(5,2),
  activity_level activity_level DEFAULT 'moderately_active',
  target_calories NUMERIC(7,2) NOT NULL DEFAULT 2000,
  target_protein_g NUMERIC(6,2) NOT NULL DEFAULT 150,
  target_carbs_g NUMERIC(6,2),
  target_fat_g NUMERIC(6,2),
  weekly_budget_rub NUMERIC(8,2) NOT NULL DEFAULT 4000,
  allergens TEXT[] NOT NULL DEFAULT '{}',
  excluded_ingredients TEXT[] NOT NULL DEFAULT '{}',
  preferred_stores TEXT[] NOT NULL DEFAULT '{}',
  convenience_preference INTEGER NOT NULL DEFAULT 2
    CHECK (convenience_preference IN (1,2,3)),
  progression_stage INTEGER NOT NULL DEFAULT 1
    CHECK (progression_stage IN (1,2,3,4)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Planned indulgence items (sacred foods)
CREATE TABLE user_indulgence_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  universal_product_id UUID REFERENCES universal_products(id),
  custom_name TEXT,
  serving_g NUMERIC(6,2) NOT NULL DEFAULT 100,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  meal_context use_context,
  weekly_compensation_calories NUMERIC(7,2) NOT NULL DEFAULT 0,
  is_sacred BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_indulgence_user ON user_indulgence_items(user_id);
CREATE INDEX idx_profile_user ON user_nutrition_profiles(user_id);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_nutrition_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_indulgence_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "profiles_own" ON user_nutrition_profiles
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "indulgence_own" ON user_indulgence_items
  FOR ALL USING (auth.uid() = user_id);
