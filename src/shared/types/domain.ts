export type NutriGrade = 'A' | 'B' | 'C' | 'D' | 'E';
export type NovaClass = 1 | 2 | 3 | 4;
export type Goal = 'bulk' | 'cut' | 'maintain' | 'health';
export type BudgetTier = 'low' | 'med' | 'high';
export type ConvenienceTier = 1 | 2 | 3;
export type EvidenceLevel = 'RCT' | 'SR/MA' | 'i';
export type MealContext =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snack'
  | 'sandwich'
  | 'cooking';

export interface ProductNutrients {
  calories_kcal: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  sugar_g: number;
  fiber_g: number;
  sodium_g: number;
  saturated_fat_g: number;
  trans_fat_g: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  image_emoji: string;
  weight_g: number;
  price_rub: number;
  store: string;
  nutrients_per_100g: ProductNutrients;
  nutriscore_grade: NutriGrade;
  nova_class: NovaClass;
  ingredients: string[];
  e_additives: string[];
  convenience_tier: ConvenienceTier;
  use_context: MealContext[];
  tier: 'A' | 'B';
  universal_ref_id: string | null;
}

export interface GateResult {
  gate_passed: boolean;
  gate_tier: 0 | 1 | 2 | 3;
  reasons: string[];
  warnings: string[];
}

export interface ValueScore {
  composite_score: number;
  price_per_protein_g: number;
  price_per_100kcal: number;
  nutriscore_norm: number;
}

export interface ProductDetail extends Product {
  gate: GateResult;
  value: ValueScore;
  evidence: EvidenceLevel;
}

export interface UserProfile {
  id: string;
  goal: Goal;
  weight_kg: number;
  height_cm: number;
  age: number;
  sex: 'M' | 'F';
  activity_level: 'low' | 'med' | 'high';
  weekly_budget_rub: number;
  budget_tier: BudgetTier;
  preferred_stores: string[];
  allergens: string[];
  excluded_ingredients: string[];
  sacred_items: string[];
  priority_nutrients: ('protein' | 'fiber' | 'omega3' | 'iron' | 'calcium')[];
  progression_stage: 1 | 2 | 3 | 4;
  swaps_accepted_week: number;
  created_at: string;
}

export interface BasketTemplateItem {
  universal_product_id: string;
  name: string;
  image_emoji: string;
  weight_g: number;
  est_price_rub: number;
  category: string;
}

export interface BasketTemplate {
  id: string;
  name: string;
  description: string;
  goal: Goal;
  budget_tier: BudgetTier;
  weekly_budget_rub: number;
  daily_protein_g: number;
  daily_calories_kcal: number;
  items: BasketTemplateItem[];
}

export interface ShoppingListItem {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
  checked: boolean;
  is_sacred: boolean;
}

export interface ShoppingList {
  id: string;
  user_id: string;
  period: string;
  items: ShoppingListItem[];
  total_estimated_rub: number;
  total_daily_protein_g: number;
  total_daily_calories_kcal: number;
  swaps_of_week: SwapSuggestion[];
}

export interface SwapSuggestion {
  from_product_id: string;
  to_product_id: string;
  from_name: string;
  to_name: string;
  protein_delta_g: number;
  price_delta_rub: number;
  reason: string;
}

export interface ApiError {
  code: string;
  message: string;
}
