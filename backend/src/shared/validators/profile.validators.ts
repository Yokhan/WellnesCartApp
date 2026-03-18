import { z } from 'zod';

export const UserProfileSchema = z.object({
  goal: z.enum(['bulk', 'cut', 'maintain']),
  weightKg: z.number().min(30).max(300),
  heightCm: z.number().min(100).max(250),
  activityLevel: z.enum([
    'sedentary',
    'lightly_active',
    'moderately_active',
    'very_active',
    'extra_active',
  ]),
  weeklyBudgetRub: z.number().min(500).max(50000),
  allergens: z.array(z.string()).default([]),
  excludedIngredients: z.array(z.string()).default([]),
  preferredStores: z.array(z.string()).min(1),
  conveniencePreference: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(2),
});
