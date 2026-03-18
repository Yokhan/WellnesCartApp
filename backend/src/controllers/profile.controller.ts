import { Request, Response, NextFunction } from 'express';
import { getUserProfile, upsertUserProfile, ProfileUpdateInput } from '../services/profile.service';
import { sendSuccess, sendError } from '../utils/response';
import { Goal, ActivityLevel } from '../shared/types/enums';

/**
 * GET /api/v1/profile
 */
export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      sendError(res, 'UNAUTHORIZED', 'Unauthorized', 401);
      return;
    }

    const profile = await getUserProfile(userId);
    sendSuccess(res, { profile });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/v1/profile
 */
export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      sendError(res, 'UNAUTHORIZED', 'Unauthorized', 401);
      return;
    }

    const body = req.body as Record<string, unknown>;

    const updates: ProfileUpdateInput = {
      goal: isValidGoal(body['goal']) ? (body['goal'] as Goal) : undefined,
      weeklyBudgetRub: typeof body['weeklyBudgetRub'] === 'number' ? body['weeklyBudgetRub'] : undefined,
      targetCalories: typeof body['targetCalories'] === 'number' ? body['targetCalories'] : undefined,
      targetProteinG: typeof body['targetProteinG'] === 'number' ? body['targetProteinG'] : undefined,
      targetCarbsG: typeof body['targetCarbsG'] === 'number' ? body['targetCarbsG'] : undefined,
      targetFatG: typeof body['targetFatG'] === 'number' ? body['targetFatG'] : undefined,
      allergens: Array.isArray(body['allergens']) ? (body['allergens'] as string[]) : undefined,
      excludedIngredients: Array.isArray(body['excludedIngredients'])
        ? (body['excludedIngredients'] as string[])
        : undefined,
      preferredStores: Array.isArray(body['preferredStores'])
        ? (body['preferredStores'] as string[])
        : undefined,
      conveniencePreference: isValidTier(body['conveniencePreference'])
        ? (body['conveniencePreference'] as 1 | 2 | 3)
        : undefined,
      weightKg: typeof body['weightKg'] === 'number' ? body['weightKg'] : undefined,
      heightCm: typeof body['heightCm'] === 'number' ? body['heightCm'] : undefined,
      activityLevel: isValidActivityLevel(body['activityLevel'])
        ? (body['activityLevel'] as ActivityLevel)
        : undefined,
    };

    const profile = await upsertUserProfile(userId, updates);
    sendSuccess(res, { profile });
  } catch (err) {
    next(err);
  }
}

function isValidGoal(value: unknown): boolean {
  return value === 'bulk' || value === 'cut' || value === 'maintain';
}

function isValidTier(value: unknown): boolean {
  return value === 1 || value === 2 || value === 3;
}

function isValidActivityLevel(value: unknown): boolean {
  const levels: ActivityLevel[] = [
    'sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active',
  ];
  return typeof value === 'string' && (levels as string[]).includes(value);
}
