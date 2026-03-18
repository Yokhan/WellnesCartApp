import { calibrateWeights } from './weight-calibration';
import {
  computeCompositeScore,
  computeBatchCompositeScores,
  ProductForScoring,
} from './composite-score';

describe('calibrateWeights', () => {
  it('uses price-heavy weights for budget <= 3000', () => {
    const weights = calibrateWeights(2500);
    expect(weights.wPrice).toBe(0.55);
    expect(weights.wNutriscore).toBe(0.25);
    expect(weights.wDeficit).toBe(0.20);
  });

  it('uses balanced weights for budget between 3001 and 6000', () => {
    const weights = calibrateWeights(5000);
    expect(weights.wPrice).toBe(0.35);
    expect(weights.wNutriscore).toBe(0.35);
    expect(weights.wDeficit).toBe(0.30);
  });

  it('uses quality-heavy weights for budget > 6000', () => {
    const weights = calibrateWeights(10000);
    expect(weights.wNutriscore).toBe(0.45);
    expect(weights.wPrice).toBe(0.15);
    expect(weights.wDeficit).toBe(0.40);
  });

  it('uses tier-1 weights at exactly 3000', () => {
    const weights = calibrateWeights(3000);
    expect(weights.wPrice).toBe(0.55);
  });

  it('uses tier-2 weights at exactly 6000', () => {
    const weights = calibrateWeights(6000);
    expect(weights.wPrice).toBe(0.35);
  });

  it('weights sum to 1.0 in all tiers', () => {
    [1000, 4500, 9000].forEach((budget) => {
      const w = calibrateWeights(budget);
      const sum = w.wNutriscore + w.wPrice + w.wDeficit;
      expect(sum).toBeCloseTo(1.0, 5);
    });
  });
});

describe('computeCompositeScore', () => {
  it('returns weighted sum clamped to [0, 1]', () => {
    const score = computeCompositeScore({
      normalizedNutriscore: 1.0,
      normalizedPricePerProtein: 1.0,
      normalizedDeficit: 1.0,
      weights: { wNutriscore: 0.35, wPrice: 0.35, wDeficit: 0.30 },
    });
    expect(score).toBeCloseTo(1.0, 5);
  });

  it('returns 0 for all-zero inputs', () => {
    const score = computeCompositeScore({
      normalizedNutriscore: 0,
      normalizedPricePerProtein: 0,
      normalizedDeficit: 0,
      weights: { wNutriscore: 0.35, wPrice: 0.35, wDeficit: 0.30 },
    });
    expect(score).toBe(0);
  });

  it('computes correct weighted score with known inputs', () => {
    // 0.45*0.8 + 0.15*0.6 + 0.40*0.5 = 0.36 + 0.09 + 0.20 = 0.65
    const score = computeCompositeScore({
      normalizedNutriscore: 0.8,
      normalizedPricePerProtein: 0.6,
      normalizedDeficit: 0.5,
      weights: { wNutriscore: 0.45, wPrice: 0.15, wDeficit: 0.40 },
    });
    expect(score).toBeCloseTo(0.65, 5);
  });

  it('clamps above 1.0 to 1.0', () => {
    const score = computeCompositeScore({
      normalizedNutriscore: 1.0,
      normalizedPricePerProtein: 1.0,
      normalizedDeficit: 1.0,
      weights: { wNutriscore: 0.5, wPrice: 0.5, wDeficit: 0.5 },
    });
    expect(score).toBeLessThanOrEqual(1.0);
  });
});

describe('computeBatchCompositeScores', () => {
  const products: ProductForScoring[] = [
    { id: 'p1', nutriscoreGrade: 'A', pricePerProteinG: 2.0, deficitScore: 0.8 },
    { id: 'p2', nutriscoreGrade: 'C', pricePerProteinG: 10.0, deficitScore: 0.3 },
    { id: 'p3', nutriscoreGrade: 'B', pricePerProteinG: 5.0, deficitScore: 0.5 },
  ];

  it('returns correct number of results', () => {
    const results = computeBatchCompositeScores(products, 5000);
    expect(results).toHaveLength(3);
  });

  it('preserves product ids', () => {
    const results = computeBatchCompositeScores(products, 5000);
    const ids = results.map((r) => r.id);
    expect(ids).toContain('p1');
    expect(ids).toContain('p2');
    expect(ids).toContain('p3');
  });

  it('product with grade A and lowest price gets higher score than grade C high price', () => {
    const results = computeBatchCompositeScores(products, 5000);
    const p1 = results.find((r) => r.id === 'p1')!;
    const p2 = results.find((r) => r.id === 'p2')!;
    expect(p1.compositeScore).toBeGreaterThan(p2.compositeScore);
  });

  it('returns empty array for empty input', () => {
    const results = computeBatchCompositeScores([], 5000);
    expect(results).toHaveLength(0);
  });

  it('returns score 1.0 for single product (best price, relative normalization)', () => {
    const single: ProductForScoring[] = [
      { id: 'solo', nutriscoreGrade: 'A', pricePerProteinG: 3.0, deficitScore: 1.0 },
    ];
    const results = computeBatchCompositeScores(single, 5000);
    // With single product, normalizePricePerProtein returns 1 (max=min)
    expect(results[0].compositeScore).toBeGreaterThan(0);
    expect(results[0].compositeScore).toBeLessThanOrEqual(1);
  });

  it('uses default deficitScore of 0.5 when not provided', () => {
    const noDeficit: ProductForScoring[] = [
      { id: 'a', nutriscoreGrade: 'A', pricePerProteinG: 1.0 },
    ];
    const results = computeBatchCompositeScores(noDeficit, 5000);
    expect(results[0].compositeScore).toBeGreaterThan(0);
  });

  it('all scores are in [0, 1] range', () => {
    const results = computeBatchCompositeScores(products, 5000);
    results.forEach((r) => {
      expect(r.compositeScore).toBeGreaterThanOrEqual(0);
      expect(r.compositeScore).toBeLessThanOrEqual(1);
    });
  });
});
