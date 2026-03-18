import { ProductWithScore } from '../../shared/types/product.types';
import { SwapCandidate } from '../../shared/types/value-score.types';

const GRADE_ORDER: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1 };

// Top-3 swaps using distinct ranking criteria:
// Rank 1: Best NutriScore grade (A > B > C > D > E)
// Rank 2: Best price per gram of protein (lowest price/protein)
// Rank 3: Best composite score
export function rankSwapCandidates(candidates: ProductWithScore[]): SwapCandidate[] {
  if (candidates.length === 0) return [];

  const byNutriScore = [...candidates].sort(
    (a, b) => (GRADE_ORDER[b.nutriscoreGrade] ?? 0) - (GRADE_ORDER[a.nutriscoreGrade] ?? 0)
  );
  const byPricePerProtein = [...candidates].sort(
    (a, b) => a.pricePerProteinG - b.pricePerProteinG
  );
  const byComposite = [...candidates].sort((a, b) => b.compositeScore - a.compositeScore);

  const seen = new Set<string>();
  const results: SwapCandidate[] = [];

  const addCandidate = (product: ProductWithScore, rank: 1 | 2 | 3) => {
    if (!seen.has(product.id) && results.length < 3) {
      seen.add(product.id);
      results.push({
        productId: product.id,
        canonicalName: product.canonicalName,
        nutriscoreGrade: product.nutriscoreGrade,
        priceRub: product.priceRub,
        pricePerProteinG: product.pricePerProteinG,
        compositeScore: product.compositeScore,
        convenienceTier: product.convenienceTier,
        useContext: product.useContext,
        swapRank: rank,
      });
    }
  };

  if (byNutriScore[0]) addCandidate(byNutriScore[0], 1);
  if (byPricePerProtein[0]) addCandidate(byPricePerProtein[0], 2);
  if (byComposite[0]) addCandidate(byComposite[0], 3);

  return results;
}
