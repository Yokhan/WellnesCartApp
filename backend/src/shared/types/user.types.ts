import { Goal, ActivityLevel, UseContext } from './enums';

export interface UserNutritionProfile {
  id: string;
  userId: string;
  goal: Goal;
  weightKg: number;
  heightCm: number;
  activityLevel: ActivityLevel;
  targetCalories: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatG: number;
  weeklyBudgetRub: number;
  allergens: string[];
  excludedIngredients: string[];
  preferredStores: string[];
  conveniencePreference: number; // 1-3
  progressionStage: 1 | 2 | 3 | 4;
}

export interface UserIndulgenceItem {
  id: string;
  userId: string;
  productId: string;
  servingG: number;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  mealContext: UseContext;
  weeklyCompensationCalories: number;
  isSacred: boolean;
}
