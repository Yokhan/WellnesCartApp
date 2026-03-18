-- Bootstrap basket templates
CREATE TABLE basket_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_name TEXT NOT NULL UNIQUE,
  target_persona TEXT NOT NULL,
  goal_alignment TEXT NOT NULL,
  weekly_budget_rub NUMERIC(8,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE basket_template_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID NOT NULL REFERENCES basket_templates(id) ON DELETE CASCADE,
  universal_product_id UUID NOT NULL REFERENCES universal_products(id),
  quantity NUMERIC(6,2) NOT NULL DEFAULT 1,
  quantity_unit TEXT NOT NULL DEFAULT 'шт'
);

-- Value scores (per user × product × store)
CREATE TABLE value_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  universal_product_id UUID NOT NULL REFERENCES universal_products(id),
  store_id TEXT NOT NULL,
  composite_score NUMERIC(5,4) NOT NULL,
  w_nutriscore NUMERIC(4,3) NOT NULL,
  w_price NUMERIC(4,3) NOT NULL,
  w_deficit NUMERIC(4,3) NOT NULL,
  price_at_computation NUMERIC(8,2),
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, universal_product_id, store_id)
);

-- Shopping lists
CREATE TYPE list_status AS ENUM ('draft', 'active', 'purchased');

CREATE TABLE shopping_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  status list_status NOT NULL DEFAULT 'draft',
  total_cost_rub NUMERIC(8,2) NOT NULL DEFAULT 0,
  total_protein_g NUMERIC(7,2) NOT NULL DEFAULT 0,
  total_calories NUMERIC(9,2) NOT NULL DEFAULT 0,
  template_id UUID REFERENCES basket_templates(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE shopping_list_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
  universal_product_id UUID REFERENCES universal_products(id),
  product_id UUID REFERENCES products(id),
  quantity NUMERIC(6,2) NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'шт',
  price_snapshot_rub NUMERIC(8,2),
  store_id TEXT,
  swap_candidates JSONB NOT NULL DEFAULT '[]',
  is_indulgence BOOLEAN NOT NULL DEFAULT false,
  is_sacred BOOLEAN NOT NULL DEFAULT false,
  source_slot TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User interactions (for future Taste Engine v1.5)
CREATE TYPE interaction_type AS ENUM (
  'accepted_swap', 'rejected_swap', 'removed_from_list',
  'added_manually', 'marked_purchased'
);

CREATE TABLE user_product_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  universal_product_id UUID NOT NULL REFERENCES universal_products(id),
  interaction_type interaction_type NOT NULL,
  context JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lists_user ON shopping_lists(user_id);
CREATE INDEX idx_lists_week ON shopping_lists(week_start_date);
CREATE INDEX idx_list_items_list ON shopping_list_items(list_id);
CREATE INDEX idx_value_scores_user ON value_scores(user_id);
CREATE INDEX idx_interactions_user ON user_product_interactions(user_id);

ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_product_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE value_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lists_own" ON shopping_lists
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "list_items_own" ON shopping_list_items
  FOR ALL USING (
    list_id IN (SELECT id FROM shopping_lists WHERE user_id = auth.uid())
  );
CREATE POLICY "interactions_own" ON user_product_interactions
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "scores_own" ON value_scores
  FOR ALL USING (auth.uid() = user_id);
