-- Quality gate results cache
CREATE TABLE quality_gate_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  universal_product_id UUID REFERENCES universal_products(id) ON DELETE CASCADE,
  gate_tier INTEGER CHECK (gate_tier IN (1, 2, 3)),
  gate_passed BOOLEAN NOT NULL,
  block_reason TEXT,
  warnings JSONB NOT NULL DEFAULT '[]',
  nutriscore_grade nutriscore_grade,
  nova_group nova_group,
  trans_fat_flagged BOOLEAN NOT NULL DEFAULT false,
  emulsifier_flagged BOOLEAN NOT NULL DEFAULT false,
  sodium_flagged BOOLEAN NOT NULL DEFAULT false,
  evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT check_product_ref CHECK (
    (product_id IS NOT NULL AND universal_product_id IS NULL)
    OR (product_id IS NULL AND universal_product_id IS NOT NULL)
  )
);

CREATE INDEX idx_qg_product ON quality_gate_results(product_id);
CREATE INDEX idx_qg_universal ON quality_gate_results(universal_product_id);
CREATE INDEX idx_qg_passed ON quality_gate_results(gate_passed);
