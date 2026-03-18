import { BudgetWeights } from '../../shared/types/value-score.types';

export interface BudgetTier {
  maxBudget: number; // weekly RUB, Infinity for last tier
  weights: BudgetWeights;
}

// From BRD RF-03: budget-adaptive weight calibration
export const BUDGET_TIERS: BudgetTier[] = [
  { maxBudget: 3000, weights: { wNutriscore: 0.25, wPrice: 0.55, wDeficit: 0.20 } },
  { maxBudget: 6000, weights: { wNutriscore: 0.35, wPrice: 0.35, wDeficit: 0.30 } },
  { maxBudget: Infinity, weights: { wNutriscore: 0.45, wPrice: 0.15, wDeficit: 0.40 } },
];
