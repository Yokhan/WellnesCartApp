import { ConvenienceTier, UseContext } from './enums';

export interface BudgetWeights {
  wNutriscore: number;
  wPrice: number;
  wDeficit: number;
}

export interface CompositeScoreInput {
  normalizedNutriscore: number; // 0-1, higher = better
  normalizedPricePerProtein: number; // 0-1, higher = better (inverse of price)
  normalizedDeficit: number; // 0-1, how well it covers deficit nutrients
  weights: BudgetWeights;
}

export interface SwapCandidate {
  productId: string;
  canonicalName: string;
  nutriscoreGrade: string;
  priceRub: number;
  pricePerProteinG: number;
  compositeScore: number;
  convenienceTier: ConvenienceTier;
  useContext: UseContext[];
  swapRank: 1 | 2 | 3; // 1=best nutriscore, 2=best price/protein, 3=best composite
}
