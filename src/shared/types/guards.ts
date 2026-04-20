import type { Goal, NutriGrade, BudgetTier, MealContext } from './domain';

const GOALS: readonly Goal[] = ['bulk', 'cut', 'maintain', 'health'];
const GRADES: readonly NutriGrade[] = ['A', 'B', 'C', 'D', 'E'];
const TIERS: readonly BudgetTier[] = ['low', 'med', 'high'];
const MEAL_CONTEXTS: readonly MealContext[] = [
  'breakfast', 'lunch', 'dinner', 'snack', 'sandwich', 'cooking',
];

export function isGoal(v: unknown): v is Goal {
  return typeof v === 'string' && (GOALS as readonly string[]).includes(v);
}

export function isNutriGrade(v: unknown): v is NutriGrade {
  return typeof v === 'string' && (GRADES as readonly string[]).includes(v);
}

export function isBudgetTier(v: unknown): v is BudgetTier {
  return typeof v === 'string' && (TIERS as readonly string[]).includes(v);
}

export function isMealContext(v: unknown): v is MealContext {
  return typeof v === 'string' && (MEAL_CONTEXTS as readonly string[]).includes(v);
}

export function deriveBudgetTier(weekly_budget_rub: number): BudgetTier {
  if (weekly_budget_rub < 3000) return 'low';
  if (weekly_budget_rub < 6000) return 'med';
  return 'high';
}
