-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE nutriscore_grade AS ENUM ('A', 'B', 'C', 'D', 'E');
CREATE TYPE nova_group AS ENUM ('1', '2', '3', '4');
CREATE TYPE convenience_tier AS ENUM ('1', '2', '3');
CREATE TYPE use_context AS ENUM (
  'sandwich', 'hot_meal', 'cold_snack', 'breakfast_ready',
  'side_dish', 'protein_source', 'dairy', 'beverage', 'condiment'
);

-- Tier A: universal products (canonical, manually verified)
CREATE TABLE universal_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  canonical_name TEXT NOT NULL,
  brand_canonical TEXT,
  category TEXT NOT NULL,
  convenience_tier convenience_tier NOT NULL DEFAULT '2',
  use_context use_context[] NOT NULL DEFAULT '{}',
  nutriscore_grade nutriscore_grade NOT NULL,
  nutriscore_score INTEGER NOT NULL,
  nova_group nova_group NOT NULL,
  has_trans_fats BOOLEAN NOT NULL DEFAULT false,
  -- Nutrients per 100g
  energy_kj NUMERIC(8,2) NOT NULL DEFAULT 0,
  proteins_g NUMERIC(6,2) NOT NULL DEFAULT 0,
  carbohydrates_g NUMERIC(6,2) NOT NULL DEFAULT 0,
  sugars_g NUMERIC(6,2) NOT NULL DEFAULT 0,
  fat_g NUMERIC(6,2) NOT NULL DEFAULT 0,
  saturated_fat_g NUMERIC(6,2) NOT NULL DEFAULT 0,
  fiber_g NUMERIC(6,2),
  sodium_mg NUMERIC(8,2) NOT NULL DEFAULT 0,
  salt_g NUMERIC(6,2) NOT NULL DEFAULT 0,
  fruits_veg_nuts_pct NUMERIC(5,2) DEFAULT 0,
  serving_size_g NUMERIC(6,2) NOT NULL DEFAULT 100,
  source TEXT NOT NULL DEFAULT 'manual',
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tier B: branded SKUs from store scraping
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  universal_product_id UUID REFERENCES universal_products(id),
  ean TEXT UNIQUE,
  brand_name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  store_id TEXT NOT NULL,
  price_rub NUMERIC(8,2) NOT NULL,
  price_per_kg NUMERIC(8,2),
  availability_status TEXT NOT NULL DEFAULT 'unknown'
    CHECK (availability_status IN ('in_stock','out_of_stock','unknown')),
  convenience_tier convenience_tier NOT NULL DEFAULT '2',
  use_context use_context[] NOT NULL DEFAULT '{}',
  -- Nutrients per 100g
  energy_kj NUMERIC(8,2),
  proteins_g NUMERIC(6,2),
  carbohydrates_g NUMERIC(6,2),
  sugars_g NUMERIC(6,2),
  fat_g NUMERIC(6,2),
  saturated_fat_g NUMERIC(6,2),
  fiber_g NUMERIC(6,2),
  sodium_mg NUMERIC(8,2),
  salt_g NUMERIC(6,2),
  nutriscore_grade nutriscore_grade,
  nova_group nova_group,
  quality_gate_passed BOOLEAN NOT NULL DEFAULT false,
  scraped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Product prices (snapshot)
CREATE TABLE product_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  store_id TEXT NOT NULL,
  price_rub NUMERIC(8,2) NOT NULL,
  is_promo BOOLEAN NOT NULL DEFAULT false,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Data freshness tracking
CREATE TABLE data_freshness (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_type TEXT NOT NULL,
  source_id UUID,
  last_updated_at TIMESTAMPTZ NOT NULL,
  next_update_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'fresh'
    CHECK (status IN ('fresh','stale','updating'))
);

-- Indexes
CREATE INDEX idx_products_store ON products(store_id);
CREATE INDEX idx_products_universal ON products(universal_product_id);
CREATE INDEX idx_products_qg_passed ON products(quality_gate_passed);
CREATE INDEX idx_universal_products_category ON universal_products(category);
CREATE INDEX idx_universal_products_convenience ON universal_products(convenience_tier);
