import { filterSwapCandidates } from './swap-filter';
import { rankSwapCandidates } from './swap-ranker';
import { ProductWithScore } from '../../shared/types/product.types';

function makeProduct(overrides: Partial<ProductWithScore> & { id: string }): ProductWithScore {
  return {
    id: overrides.id,
    canonicalName: overrides.canonicalName ?? `Product ${overrides.id}`,
    brandCanonical: undefined,
    category: 'protein',
    convenienceTier: overrides.convenienceTier ?? 2,
    useContext: overrides.useContext ?? ['hot_meal'],
    nutriscoreGrade: overrides.nutriscoreGrade ?? 'B',
    nutriscoreScore: overrides.nutriscoreScore ?? 2,
    novaGroup: overrides.novaGroup ?? 1,
    hasTransFats: false,
    nutrients: {
      energyKj: 500,
      proteinsG: 20,
      carbohydratesG: 5,
      sugarsG: 1,
      fatG: 5,
      saturatedFatG: 1,
      sodiumMg: 100,
      saltG: 0.25,
    },
    servingSizeG: 100,
    source: 'manual',
    lastVerifiedAt: '2026-01-01',
    priceRub: overrides.priceRub ?? 100,
    pricePerProteinG: overrides.pricePerProteinG ?? 5,
    compositeScore: overrides.compositeScore ?? 0.6,
    storeId: overrides.storeId,
  };
}

describe('filterSwapCandidates', () => {
  const candidates = [
    makeProduct({ id: 'p1', convenienceTier: 2, useContext: ['hot_meal'] }),
    makeProduct({ id: 'p2', convenienceTier: 2, useContext: ['cold_snack'] }),
    makeProduct({ id: 'p3', convenienceTier: 1, useContext: ['hot_meal'] }), // wrong tier
    makeProduct({ id: 'p4', convenienceTier: 2, useContext: ['hot_meal', 'side_dish'] }),
    makeProduct({ id: 'p5', convenienceTier: 3, useContext: ['sandwich'] }), // wrong tier
  ];

  it('filters by convenience tier', () => {
    const result = filterSwapCandidates({
      sourceConvenienceTier: 2,
      sourceUseContext: ['hot_meal'],
      candidates,
    });
    result.forEach((p) => expect(p.convenienceTier).toBe(2));
    expect(result.find((p) => p.id === 'p3')).toBeUndefined();
    expect(result.find((p) => p.id === 'p5')).toBeUndefined();
  });

  it('filters by use context — at least one shared context required', () => {
    const result = filterSwapCandidates({
      sourceConvenienceTier: 2,
      sourceUseContext: ['hot_meal'],
      candidates,
    });
    // p2 only has cold_snack — should be excluded
    expect(result.find((p) => p.id === 'p2')).toBeUndefined();
    expect(result.find((p) => p.id === 'p1')).toBeDefined();
    expect(result.find((p) => p.id === 'p4')).toBeDefined();
  });

  it('excludes products in excludeIds', () => {
    const result = filterSwapCandidates({
      sourceConvenienceTier: 2,
      sourceUseContext: ['hot_meal'],
      candidates,
      excludeIds: ['p1'],
    });
    expect(result.find((p) => p.id === 'p1')).toBeUndefined();
  });

  it('returns empty array when no candidates match', () => {
    const result = filterSwapCandidates({
      sourceConvenienceTier: 3,
      sourceUseContext: ['beverage'],
      candidates,
    });
    expect(result).toHaveLength(0);
  });

  it('returns multiple candidates sharing any use_context', () => {
    const result = filterSwapCandidates({
      sourceConvenienceTier: 2,
      sourceUseContext: ['side_dish'],
      candidates,
    });
    expect(result.find((p) => p.id === 'p4')).toBeDefined();
  });
});

describe('rankSwapCandidates', () => {
  const candidates = [
    makeProduct({ id: 'best-nutri', nutriscoreGrade: 'A', pricePerProteinG: 8, compositeScore: 0.7 }),
    makeProduct({ id: 'best-price', nutriscoreGrade: 'C', pricePerProteinG: 2, compositeScore: 0.5 }),
    makeProduct({ id: 'best-composite', nutriscoreGrade: 'B', pricePerProteinG: 5, compositeScore: 0.9 }),
  ];

  it('returns up to 3 candidates', () => {
    const result = rankSwapCandidates(candidates);
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it('rank 1 is the best NutriScore candidate', () => {
    const result = rankSwapCandidates(candidates);
    const rank1 = result.find((r) => r.swapRank === 1);
    expect(rank1?.productId).toBe('best-nutri');
  });

  it('rank 2 is best price/protein (when not already ranked)', () => {
    const result = rankSwapCandidates(candidates);
    const rank2 = result.find((r) => r.swapRank === 2);
    expect(rank2?.productId).toBe('best-price');
  });

  it('rank 3 is best composite score (when not already ranked)', () => {
    const result = rankSwapCandidates(candidates);
    const rank3 = result.find((r) => r.swapRank === 3);
    expect(rank3?.productId).toBe('best-composite');
  });

  it('returns empty array for empty candidates', () => {
    const result = rankSwapCandidates([]);
    expect(result).toHaveLength(0);
  });

  it('deduplicates — each product appears at most once', () => {
    const result = rankSwapCandidates(candidates);
    const ids = result.map((r) => r.productId);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('works with single candidate', () => {
    const single = [makeProduct({ id: 'solo', nutriscoreGrade: 'A', pricePerProteinG: 3, compositeScore: 0.8 })];
    const result = rankSwapCandidates(single);
    expect(result.length).toBe(1);
    expect(result[0].swapRank).toBe(1);
  });

  it('includes product fields in swap candidate', () => {
    const result = rankSwapCandidates(candidates);
    const rank1 = result.find((r) => r.swapRank === 1)!;
    expect(rank1.nutriscoreGrade).toBe('A');
    expect(rank1.priceRub).toBeDefined();
    expect(rank1.compositeScore).toBeDefined();
  });
});
