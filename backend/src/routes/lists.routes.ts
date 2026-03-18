import { Router } from 'express';
import {
  generateList,
  getCurrentList,
  getUserLists,
  updateListItem,
  deleteList,
} from '../controllers/lists.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

/**
 * GET /api/v1/shopping-lists
 * Returns all shopping lists for the current user (paginated)
 * Query params: page, limit
 */
router.get('/', getUserLists);

/**
 * GET /api/v1/shopping-lists/current
 * Returns the active list for the current ISO week
 * Must be declared before /:id to avoid route shadowing
 */
router.get('/current', getCurrentList);

/**
 * POST /api/v1/shopping-lists
 * Generate a new optimised shopping list via LP solver
 */
router.post('/', generateList);

/**
 * PATCH /api/v1/shopping-lists/:id/items/:itemId
 * Update a list item (quantity or isChecked)
 */
router.patch('/:id/items/:itemId', updateListItem);

/**
 * DELETE /api/v1/shopping-lists/:id
 * Soft-delete a shopping list
 */
router.delete('/:id', deleteList);

export default router;
