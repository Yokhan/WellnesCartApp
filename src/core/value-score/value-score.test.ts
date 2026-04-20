import { describe, it, expect } from 'vitest';
import { computeValueScore, pricePerProteinG, pricePer100Kcal } from './value-score.processor';
import type { Product, UserProfile } from '../../shared/types';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p1', name: 'Куриное филе', brand: null, category: 'meat',
    image_emoji: '🍗', weight_g: 1000, price_rub: 350, store: 'Пятёрочка',
    nutrients_per_100g: {
      calories_kcal: 113, protein_g: 23.6, fat_g: 1.9, carbs_g: 0,
      sugar_g: 0, fiber_g: 0, sodium_g: 0.07,
      saturated_fat_g: 0.5, trans_fat_g: 0,
    },
    nutriscore_grade: 'A', nova_class: 1, ingredients: ['филе куриное'], e_additives: [],
    convenience_tier: 3, use_context: ['cooking'], tier: 'A', universal_ref_id: null,
    ...overrides,
  };
}

function makeProfile(budget_tier: UserProfile['budget_tier'] = 'med'): UserProfile {
  return {
    id: 'u1', goal: 'bulk', weight_kg: 80, height_cm: 180, age: 30, sex: 'M',
    activity_level: 'high', weekly_budget_rub: 4500, budget_tier,
    preferred_stores: ['Пятёрочка'], allergens: [], excluded_ingredients: [],
    sacred_items: [], priority_nutrients: ['protein'],
    progression_stage: 1, swaps_accepted_week: 0, created_at: '2026-04-20T00:00:00Z',
  };
}

describe('pricePerProteinG', () => {
  it('computes ₽ per 1g protein', () => {
    const v = pricePerProteinG(makeProduct());
    expect(v).toBeCloseTo(350 / (10 * 23.6), 2);
  });

  it('returns Infinity for zero protein', () => {
    const v = pricePerProteinG(makeProduct({
      nutrients_per_100g: {
        calories_kcal: 0, protein_g: 0, fat_g: 0, carbs_g: 0,
        sugar_g: 0, fiber_g: 0, sodium_g: 0, saturated_fat_g: 0, trans_fat_g: 0,
      },
    }));
    expect(v).toBe(Number.POSITIVE_INFINITY);
  });
});

describe('pricePer100Kcal', () => {
  it('computes ₽ per 100 kcal', () => {
    const v = pricePer100Kcal(makeProduct());
    expect(v).toBeCloseTo((350 / (10 * 113)) * 100, 2);
  });
});

describe('computeValueScore', () => {
  it('returns composite score between 0 and 1', () => {
    const v = computeValueScore(makeProduct(), makeProfile());
    expect(v.composite_score).toBeGreaterThanOrEqual(0);
    expect(v.composite_score).toBeLessThanOrEqual(1);
  });

  it('low-budget tier weights price more', () => {
    const lowP = computeValueScore(makeProduct({ price_rub: 1500 }), makeProfile('low'));
    const highP = computeValueScore(makeProduct({ price_rub: 1500 }), makeProfile('high'));
    expect(lowP.composite_score).toBeLessThan(highP.composite_score);
  });

  it('NutriScore A scores higher than D at same price', () => {
    const a = computeValueScore(makeProduct({ nutriscore_grade: 'A' }), makeProfile());
    const d = computeValueScore(makeProduct({ nutriscore_grade: 'D' }), makeProfile());
    expect(a.composite_score).toBeGreaterThan(d.composite_score);
  });
});
