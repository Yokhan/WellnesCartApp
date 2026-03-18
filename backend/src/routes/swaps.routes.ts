import { Router } from 'express';
import { getListSwaps, acceptSwap, rejectSwap } from '../controllers/swaps.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true });

router.use(authenticate);

/**
 * GET /api/v1/shopping-lists/:id/swaps
 * Returns available swap candidates for every item in the list
 */
router.get('/', getListSwaps);

/**
 * POST /api/v1/shopping-lists/:id/swaps
 * Accept a swap: replace an item with a suggested alternative
 * Body: { itemId: string, newProductId: string }
 */
router.post('/', acceptSwap);

/**
 * DELETE /api/v1/shopping-lists/:id/swaps/:swapId
 * Reject a swap candidate so it is no longer suggested
 * Body: { itemId: string }
 */
router.delete('/:swapId', rejectSwap);

export default router;
