import { CompositeScoreInput } from '../../shared/types/value-score.types';
import { calibrateWeights } from './weight-calibration';
import { normalizeNutriScoreGrade, normalizePricePerProtein } from '../../shared/utils/normalize';

export function computeCompositeScore(input: CompositeScoreInput): number {
  const { normalizedNutriscore, normalizedPricePerProtein, normalizedDeficit, weights } = input;
  const score =
    weights.wNutriscore * normalizedNutriscore +
    weights.wPrice * normalizedPricePerProtein +
    weights.wDeficit * normalizedDeficit;
  return Math.max(0, Math.min(1, score));
}

export interface ProductForScoring {
  id: string;
  nutriscoreGrade: string;
  pricePerProteinG: number;
  deficitScore?: number; // 0-1, how well it covers nutritional deficits
}

export function computeBatchCompositeScores(
  products: ProductForScoring[],
  weeklyBudgetRub: number
): Array<{ id: string; compositeScore: number }> {
  if (products.length === 0) return [];

  const weights = calibrateWeights(weeklyBudgetRub);
  const allPricesPerProtein = products.map((p) => p.pricePerProteinG);

  return products.map((p) => ({
    id: p.id,
    compositeScore: computeCompositeScore({
      normalizedNutriscore: normalizeNutriScoreGrade(p.nutriscoreGrade),
      normalizedPricePerProtein: normalizePricePerProtein(p.pricePerProteinG, allPricesPerProtein),
      normalizedDeficit: p.deficitScore ?? 0.5,
      weights,
    }),
  }));
}
