import { Request, Response, NextFunction } from 'express';
import { generateShoppingList } from '../services/list-builder.service';
import { getSupabaseAdminClient } from '../utils/supabase';
import { sendSuccess, sendError } from '../utils/response';
import { logger } from '../utils/logger';

/**
 * POST /api/v1/shopping-lists
 * Generate a new optimised shopping list for the authenticated user
 */
export async function generateList(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      sendError(res, 'UNAUTHORIZED', 'Unauthorized', 401);
      return;
    }

    logger.info({ userId }, 'Generating shopping list');
    const list = await generateShoppingList(userId);
    sendSuccess(res, { list }, 201);
  } catch (err) {
    if (err instanceof Error && err.message.includes('profile not found')) {
      sendError(res, 'NOT_FOUND', err.message, 404);
      return;
    }
    if (err instanceof Error && err.message.includes('оптимизировать')) {
      sendError(res, 'SERVICE_UNAVAILABLE', err.message, 503);
      return;
    }
    next(err);
  }
}

/**
 * GET /api/v1/shopping-lists/current
 * Returns the active list for the current ISO week
 */
export async function getCurrentList(
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
      .from('shopping_lists')
      .select('*, shopping_list_items(*)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    sendSuccess(res, { list: data ?? null });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/shopping-lists
 * Returns all shopping lists for the authenticated user (paginated)
 */
export async function getUserLists(
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

    const pageRaw = typeof req.query['page'] === 'string' ? parseInt(req.query['page'], 10) : 1;
    const limitRaw =
      typeof req.query['limit'] === 'string' ? parseInt(req.query['limit'], 10) : 20;
    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
    const limit = Number.isFinite(limitRaw) && limitRaw > 0 && limitRaw <= 100 ? limitRaw : 20;
    const offset = (page - 1) * limit;

    const supabase = getSupabaseAdminClient();
    const { data, error, count } = await supabase
      .from('shopping_lists')
      .select('id, week_start_date, status, total_cost_rub, total_protein_g, total_calories, created_at', {
        count: 'exact',
      })
      .eq('user_id', userId)
      .neq('status', 'deleted')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    sendSuccess(res, {
      lists: data ?? [],
      pagination: { page, limit, total: count ?? 0 },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/v1/shopping-lists/:id/items/:itemId
 * Update a specific item (quantity or checked status)
 */
export async function updateListItem(
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

    const { id: listId, itemId } = req.params;
    if (!listId || !itemId) {
      sendError(res, 'VALIDATION_ERROR', 'listId and itemId are required', 400);
      return;
    }

    const body = req.body as Record<string, unknown>;
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (typeof body['quantity'] === 'number' && body['quantity'] > 0) {
      updates['quantity'] = Math.floor(body['quantity'] as number);
    }
    if (typeof body['isChecked'] === 'boolean') {
      updates['is_checked'] = body['isChecked'];
    }

    if (Object.keys(updates).length === 1) {
      sendError(res, 'VALIDATION_ERROR', 'At least one of quantity or isChecked is required', 400);
      return;
    }

    const supabase = getSupabaseAdminClient();

    // Verify list belongs to user
    const { data: list } = await supabase
      .from('shopping_lists')
      .select('id')
      .eq('id', listId)
      .eq('user_id', userId)
      .single();

    if (!list) {
      sendError(res, 'NOT_FOUND', 'Shopping list not found', 404);
      return;
    }

    const { data: item, error } = await supabase
      .from('shopping_list_items')
      .update(updates)
      .eq('id', itemId)
      .eq('list_id', listId)
      .select('*')
      .single();

    if (error || !item) {
      sendError(res, 'NOT_FOUND', 'List item not found', 404);
      return;
    }

    sendSuccess(res, { item });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/v1/shopping-lists/:id
 * Soft-delete a shopping list (sets status = 'deleted')
 */
export async function deleteList(
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

    const { id: listId } = req.params;
    if (!listId) {
      sendError(res, 'VALIDATION_ERROR', 'List id is required', 400);
      return;
    }

    const supabase = getSupabaseAdminClient();
    const { error, data } = await supabase
      .from('shopping_lists')
      .update({ status: 'deleted', updated_at: new Date().toISOString() })
      .eq('id', listId)
      .eq('user_id', userId)
      .neq('status', 'deleted')
      .select('id');

    if (error) throw error;

    if (!data || data.length === 0) {
      sendError(res, 'NOT_FOUND', 'Shopping list not found', 404);
      return;
    }

    logger.info({ userId, listId }, 'Shopping list soft-deleted');
    sendSuccess(res, { id: listId, deleted: true });
  } catch (err) {
    next(err);
  }
}
