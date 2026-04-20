import { describe, it, expect } from 'vitest';
import { evalGate } from './quality-gate.processor';
import type { Product } from '../../shared/types';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 't1', name: 'Test', brand: null, category: 'test',
    image_emoji: '🥣', weight_g: 100, price_rub: 100, store: 'Test',
    nutrients_per_100g: {
      calories_kcal: 100, protein_g: 10, fat_g: 5, carbs_g: 10,
      sugar_g: 2, fiber_g: 2, sodium_g: 0.3,
      saturated_fat_g: 1, trans_fat_g: 0,
    },
    nutriscore_grade: 'B', nova_class: 1, ingredients: [], e_additives: [],
    convenience_tier: 2, use_context: ['cooking'],
    tier: 'A', universal_ref_id: null,
    ...overrides,
  };
}

describe('evalGate', () => {
  it('passes a clean Tier-A product', () => {
    const r = evalGate(makeProduct());
    expect(r.gate_passed).toBe(true);
    expect(r.gate_tier).toBe(0);
  });

  it('blocks on NutriScore D', () => {
    const r = evalGate(makeProduct({ nutriscore_grade: 'D' }));
    expect(r.gate_passed).toBe(false);
    expect(r.reasons[0]).toContain('D');
  });

  it('blocks on trans-fat > 1g/100g', () => {
    const r = evalGate(makeProduct({
      nutrients_per_100g: {
        calories_kcal: 100, protein_g: 10, fat_g: 5, carbs_g: 10,
        sugar_g: 2, fiber_g: 2, sodium_g: 0.3,
        saturated_fat_g: 1, trans_fat_g: 1.5,
      },
    }));
    expect(r.gate_passed).toBe(false);
  });

  it('warns on emulsifier E471', () => {
    const r = evalGate(makeProduct({ e_additives: ['E471'] }));
    expect(r.gate_passed).toBe(true);
    expect(r.warnings.some((w) => w.includes('Эмульгаторы'))).toBe(true);
    expect(r.gate_tier).toBe(2);
  });

  it('warns with tier 3 on two warnings', () => {
    const r = evalGate(makeProduct({
      e_additives: ['E471'],
      nutrients_per_100g: {
        calories_kcal: 100, protein_g: 10, fat_g: 5, carbs_g: 10,
        sugar_g: 2, fiber_g: 2, sodium_g: 1.8,
        saturated_fat_g: 1, trans_fat_g: 0.7,
      },
    }));
    expect(r.gate_passed).toBe(true);
    expect(r.gate_tier).toBe(3);
  });

  it('blocks on NOVA-4 + D grade', () => {
    const r = evalGate(makeProduct({ nova_class: 4, nutriscore_grade: 'D' }));
    expect(r.gate_passed).toBe(false);
  });
});
