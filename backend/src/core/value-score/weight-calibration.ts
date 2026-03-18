import { BudgetWeights } from '../../shared/types/value-score.types';
import { BUDGET_TIERS } from './value-score.data';

export function calibrateWeights(weeklyBudgetRub: number): BudgetWeights {
  const tier = BUDGET_TIERS.find((t) => weeklyBudgetRub <= t.maxBudget);
  return tier?.weights ?? BUDGET_TIERS[BUDGET_TIERS.length - 1].weights;
}
