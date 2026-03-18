import { getSupabaseAdminClient } from '../utils/supabase';
import { UserNutritionProfile } from '../shared/types/user.types';
import { Goal, ActivityLevel } from '../shared/types/enums';

export async function getUserProfile(userId: string): Promise<UserNutritionProfile | null> {
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase
    .from('user_nutrition_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!data) return null;
  return mapRowToProfile(data, userId);
}

export interface ProfileUpdateInput {
  goal?: Goal;
  weeklyBudgetRub?: number;
  targetCalories?: number;
  targetProteinG?: number;
  targetCarbsG?: number;
  targetFatG?: number;
  allergens?: string[];
  excludedIngredients?: string[];
  preferredStores?: string[];
  conveniencePreference?: 1 | 2 | 3;
  weightKg?: number;
  heightCm?: number;
  activityLevel?: ActivityLevel;
}

export async function upsertUserProfile(
  userId: string,
  updates: ProfileUpdateInput
): Promise<UserNutritionProfile> {
  const supabase = getSupabaseAdminClient();

  const targetCalories = updates.targetCalories ?? computeDefaultCalories(updates.goal);
  const targetProteinG = updates.targetProteinG ?? computeDefaultProtein(updates.goal);

  const { data, error } = await supabase
    .from('user_nutrition_profiles')
    .upsert(
      {
        user_id: userId,
        goal: updates.goal ?? 'maintain',
        weekly_budget_rub: updates.weeklyBudgetRub ?? 4000,
        target_calories: targetCalories,
        target_protein_g: targetProteinG,
        target_carbs_g: updates.targetCarbsG ?? null,
        target_fat_g: updates.targetFatG ?? null,
        weight_kg: updates.weightKg ?? null,
        height_cm: updates.heightCm ?? null,
        activity_level: updates.activityLevel ?? 'moderately_active',
        allergens: updates.allergens ?? [],
        excluded_ingredients: updates.excludedIngredients ?? [],
        preferred_stores: updates.preferredStores ?? [],
        convenience_preference: updates.conveniencePreference ?? 2,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select('*')
    .single();

  if (error || !data) throw error ?? new Error('Failed to upsert profile');
  return mapRowToProfile(data, userId);
}

function computeDefaultCalories(goal?: string): number {
  if (goal === 'bulk') return 2800;
  if (goal === 'cut') return 1800;
  return 2200;
}

function computeDefaultProtein(goal?: string): number {
  if (goal === 'bulk') return 200;
  if (goal === 'cut') return 160;
  return 140;
}

function mapRowToProfile(row: Record<string, unknown>, userId: string): UserNutritionProfile {
  return {
    id: String(row['id']),
    userId,
    goal: String(row['goal']) as Goal,
    weightKg: Number(row['weight_kg']) || 0,
    heightCm: Number(row['height_cm']) || 0,
    activityLevel: String(row['activity_level']) as ActivityLevel,
    targetCalories: Number(row['target_calories']),
    targetProteinG: Number(row['target_protein_g']),
    targetCarbsG: Number(row['target_carbs_g']) || 0,
    targetFatG: Number(row['target_fat_g']) || 0,
    weeklyBudgetRub: Number(row['weekly_budget_rub']),
    allergens: (row['allergens'] as string[]) ?? [],
    excludedIngredients: (row['excluded_ingredients'] as string[]) ?? [],
    preferredStores: (row['preferred_stores'] as string[]) ?? [],
    conveniencePreference: Number(row['convenience_preference']) as 1 | 2 | 3,
    progressionStage: Number(row['progression_stage']) as 1 | 2 | 3 | 4,
  };
}
