import { Request, Response, NextFunction } from 'express';
import { getSupabaseAdminClient } from '../utils/supabase';
import { sendSuccess, sendError } from '../utils/response';
import { logger } from '../utils/logger';

/**
 * GET /api/v1/indulgence
 * Returns the user's planned indulgence items
 */
export async function getIndulgenceItems(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      sendError(res, 'UNAUTHORIZED', 'Unauthorized', 401);
      return;
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('user_indulgence_items')
      .select(
        'id, universal_product_id, serving_g, day_of_week, meal_context, weekly_compensation_calories, is_sacred, created_at'
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    sendSuccess(res, { items: data ?? [] });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/indulgence
 * Add a new planned indulgence item
 */
export async function addIndulgenceItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      sendError(res, 'UNAUTHORIZED', 'Unauthorized', 401);
      return;
    }

    const body = req.body as Record<string, unknown>;

    const universalProductId =
      typeof body['universalProductId'] === 'string' ? body['universalProductId'] : null;
    const servingG =
      typeof body['servingG'] === 'number' && body['servingG'] > 0 ? body['servingG'] : null;
    const dayOfWeek =
      typeof body['dayOfWeek'] === 'number' &&
      Number.isInteger(body['dayOfWeek']) &&
      body['dayOfWeek'] >= 0 &&
      body['dayOfWeek'] <= 6
        ? body['dayOfWeek']
        : null;
    const mealContext =
      typeof body['mealContext'] === 'string' ? body['mealContext'] : null;
    const isSacred =
      typeof body['isSacred'] === 'boolean' ? body['isSacred'] : false;

    if (!universalProductId || servingG === null || dayOfWeek === null || !mealContext) {
      sendError(
        res,
        'VALIDATION_ERROR',
        'universalProductId, servingG, dayOfWeek (0–6) and mealContext are required',
        400
      );
      return;
    }

    const supabase = getSupabaseAdminClient();

    // Check item count limit — max 10 indulgence items
    const { count } = await supabase
      .from('user_indulgence_items')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    if ((count ?? 0) >= 10) {
      sendError(res, 'LIMIT_EXCEEDED', 'Maximum 10 indulgence items allowed', 422);
      return;
    }

    const { data, error } = await supabase
      .from('user_indulgence_items')
      .insert({
        user_id: userId,
        universal_product_id: universalProductId,
        serving_g: servingG,
        day_of_week: dayOfWeek,
        meal_context: mealContext,
        is_sacred: isSacred,
        weekly_compensation_calories: 0,
      })
      .select('*')
      .single();

    if (error || !data) throw error ?? new Error('Failed to add indulgence item');

    logger.info({ userId, universalProductId }, 'Indulgence item added');
    sendSuccess(res, { item: data }, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/v1/indulgence/:id
 * Remove an indulgence item
 */
export async function removeIndulgenceItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      sendError(res, 'UNAUTHORIZED', 'Unauthorized', 401);
      return;
    }

    const { id } = req.params;
    if (!id) {
      sendError(res, 'VALIDATION_ERROR', 'Indulgence item id is required', 400);
      return;
    }

    const supabase = getSupabaseAdminClient();
    const { error, count } = await supabase
      .from('user_indulgence_items')
      .delete({ count: 'exact' })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    if (count === 0) {
      sendError(res, 'NOT_FOUND', 'Indulgence item not found', 404);
      return;
    }

    logger.info({ userId, id }, 'Indulgence item removed');
    sendSuccess(res, { id, deleted: true });
  } catch (err) {
    next(err);
  }
}
