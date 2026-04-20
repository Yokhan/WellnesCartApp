import { describe, it, expect } from 'vitest';
import { rankSwaps } from './swaps.processor';
import type { Product, UserProfile } from '../../shared/types';

const baseNutrients = {
  calories_kcal: 100, protein_g: 15, fat_g: 3, carbs_g: 5,
  sugar_g: 1, fiber_g: 2, sodium_g: 0.3,
  saturated_fat_g: 1, trans_fat_g: 0,
};

function prod(overrides: Partial<Product>): Product {
  return {
    id: 'x', name: 'x', brand: null, category: 'meat',
    image_emoji: '🥩', weight_g: 500, price_rub: 200, store: 'Test',
    nutrients_per_100g: baseNutrients,
    nutriscore_grade: 'B', nova_class: 1, ingredients: [], e_additives: [],
    convenience_tier: 2, use_context: ['cooking'],
    tier: 'A', universal_ref_id: null,
    ...overrides,
  };
}

const profile: UserProfile = {
  id: 'u', goal: 'bulk', weight_kg: 80, height_cm: 180, age: 30, sex: 'M',
  activity_level: 'high', weekly_budget_rub: 4500, budget_tier: 'med',
  preferred_stores: [], allergens: [], excluded_ingredients: [],
  sacred_items: [], priority_nutrients: ['protein'],
  progression_stage: 1, swaps_accepted_week: 0, created_at: '2026-04-20T00:00:00Z',
};

describe('rankSwaps', () => {
  const current = prod({ id: 'current', name: 'Колбаса', convenience_tier: 1, use_context: ['sandwich'] });

  it('filters out different convenience_tier', () => {
    const r = rankSwaps([
      prod({ id: 'raw-chicken', convenience_tier: 3, use_context: ['cooking'] }),
    ], current, profile);
    expect(r).toHaveLength(0);
  });

  it('keeps same tier and overlapping context', () => {
    const r = rankSwaps([
      prod({ id: 'turkey', convenience_tier: 1, use_context: ['sandwich'], nutriscore_grade: 'A' }),
    ], current, profile);
    expect(r).toHaveLength(1);
    expect(r[0]?.id).toBe('turkey');
  });

  it('excludes current product from results', () => {
    const r = rankSwaps([current, prod({ id: 'other', convenience_tier: 1, use_context: ['sandwich'] })],
      current, profile);
    expect(r.find((p) => p.id === 'current')).toBeUndefined();
  });

  it('excludes gate-blocked products', () => {
    const r = rankSwaps([
      prod({ id: 'junk', convenience_tier: 1, use_context: ['sandwich'], nutriscore_grade: 'E' }),
    ], current, profile);
    expect(r).toHaveLength(0);
  });

  it('sorts by composite_score descending', () => {
    const r = rankSwaps([
      prod({ id: 'b', convenience_tier: 1, use_context: ['sandwich'], nutriscore_grade: 'B', price_rub: 300 }),
      prod({ id: 'a', convenience_tier: 1, use_context: ['sandwich'], nutriscore_grade: 'A', price_rub: 250 }),
    ], current, profile);
    expect(r[0]?.id).toBe('a');
  });

  it('limits to 3 by default', () => {
    const candidates = Array.from({ length: 5 }, (_, i) =>
      prod({ id: `c${i}`, convenience_tier: 1, use_context: ['sandwich'] })
    );
    const r = rankSwaps(candidates, current, profile);
    expect(r.length).toBeLessThanOrEqual(3);
  });
});
