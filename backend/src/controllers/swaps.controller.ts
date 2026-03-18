import { Request, Response, NextFunction } from 'express';
import { getSupabaseAdminClient } from '../utils/supabase';
import { filterSwapCandidates, rankSwapCandidates } from '../core/swap-engine';
import { getProductById, getAllProducts } from '../services/product.service';
import { sendSuccess, sendError } from '../utils/response';
import { logger } from '../utils/logger';

/**
 * GET /api/v1/shopping-lists/:id/swaps
 * Returns available swaps for all items in a shopping list
 */
export async function getListSwaps(
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
    const { data: list, error } = await supabase
      .from('shopping_lists')
      .select('id, user_id, shopping_list_items(id, universal_product_id, swap_candidates)')
      .eq('id', listId)
      .eq('user_id', userId)
      .single();

    if (error || !list) {
      sendError(res, 'NOT_FOUND', 'Shopping list not found', 404);
      return;
    }

    const items = (list as Record<string, unknown>)['shopping_list_items'] as Array<
      Record<string, unknown>
    >;
    const swaps = (items ?? []).map((item) => ({
      itemId: item['id'],
      universalProductId: item['universal_product_id'],
      swapCandidates: item['swap_candidates'] ?? [],
    }));

    sendSuccess(res, { swaps });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/shopping-lists/:id/swaps
 * Accept a swap: replace one product in the list with a swap candidate
 */
export async function acceptSwap(
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
    const body = req.body as Record<string, unknown>;
    const itemId = typeof body['itemId'] === 'string' ? body['itemId'] : null;
    const newProductId = typeof body['newProductId'] === 'string' ? body['newProductId'] : null;

    if (!listId || !itemId || !newProductId) {
      sendError(res, 'VALIDATION_ERROR', 'listId, itemId and newProductId are required', 400);
      return;
    }

    const supabase = getSupabaseAdminClient();

    // Verify list ownership
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

    const newProduct = await getProductById(newProductId);
    if (!newProduct) {
      sendError(res, 'NOT_FOUND', 'Swap product not found', 404);
      return;
    }

    // Build new swap candidates for the replacement product
    const allProducts = await getAllProducts();
    const withScores = allProducts.map((p) => ({
      ...p,
      priceRub: 100,
      pricePerProteinG: p.nutrients.proteinsG > 0 ? 100 / p.nutrients.proteinsG : 999,
      compositeScore: 0.5,
    }));

    const candidates = filterSwapCandidates({
      sourceConvenienceTier: newProduct.convenienceTier,
      sourceUseContext: newProduct.useContext,
      candidates: withScores,
      excludeIds: [newProductId],
    });
    const newSwapCandidates = rankSwapCandidates(candidates);

    const { error: updateError } = await supabase
      .from('shopping_list_items')
      .update({
        universal_product_id: newProductId,
        swap_candidates: newSwapCandidates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId)
      .eq('list_id', listId);

    if (updateError) throw updateError;

    logger.info({ userId, listId, itemId, newProductId }, 'Swap accepted');
    sendSuccess(res, { itemId, newProductId, swapCandidates: newSwapCandidates });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/v1/shopping-lists/:id/swaps/:swapId
 * Reject a specific swap candidate (removes it from the item's swap_candidates)
 */
export async function rejectSwap(
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

    const { id: listId, swapId } = req.params;
    const body = req.body as Record<string, unknown>;
    const itemId = typeof body['itemId'] === 'string' ? body['itemId'] : null;

    if (!listId || !swapId || !itemId) {
      sendError(res, 'VALIDATION_ERROR', 'listId, swapId and itemId are required', 400);
      return;
    }

    const supabase = getSupabaseAdminClient();

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

    const { data: item } = await supabase
      .from('shopping_list_items')
      .select('swap_candidates')
      .eq('id', itemId)
      .eq('list_id', listId)
      .single();

    if (!item) {
      sendError(res, 'NOT_FOUND', 'List item not found', 404);
      return;
    }

    const currentCandidates = Array.isArray(
      (item as Record<string, unknown>)['swap_candidates']
    )
      ? ((item as Record<string, unknown>)['swap_candidates'] as Array<Record<string, unknown>>)
      : [];

    const filtered = currentCandidates.filter((c) => c['id'] !== swapId);

    const { error: updateError } = await supabase
      .from('shopping_list_items')
      .update({ swap_candidates: filtered, updated_at: new Date().toISOString() })
      .eq('id', itemId)
      .eq('list_id', listId);

    if (updateError) throw updateError;

    logger.info({ userId, listId, itemId, swapId }, 'Swap rejected');
    sendSuccess(res, { itemId, swapId, removed: true });
  } catch (err) {
    next(err);
  }
}
