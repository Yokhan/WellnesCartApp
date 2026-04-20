import type { BudgetTier, NutriGrade } from '../../shared/types';

export interface ScoreWeights {
  ns: number;
  price: number;
  deficit: number;
}

export const WEIGHTS_BY_TIER: Record<BudgetTier, ScoreWeights> = {
  low: { ns: 0.25, price: 0.55, deficit: 0.20 },
  med: { ns: 0.35, price: 0.35, deficit: 0.30 },
  high: { ns: 0.45, price: 0.15, deficit: 0.40 },
};

export const GRADE_NORM: Record<NutriGrade, number> = {
  A: 1.0, B: 0.75, C: 0.5, D: 0.25, E: 0,
};

export const DEFICIT_NUTRIENT_TARGETS = {
  protein_g_per_100g: 20,
  fiber_g_per_100g: 6,
};
