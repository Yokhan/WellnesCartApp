import { Router } from 'express';
import {
  getIndulgenceItems,
  addIndulgenceItem,
  removeIndulgenceItem,
} from '../controllers/indulgence.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

/**
 * GET /api/v1/indulgence
 * Returns all planned indulgence items for the current user
 */
router.get('/', getIndulgenceItems);

/**
 * POST /api/v1/indulgence
 * Add a new planned indulgence item
 * Body: { universalProductId, servingG, dayOfWeek (0-6), mealContext, isSacred? }
 */
router.post('/', addIndulgenceItem);

/**
 * DELETE /api/v1/indulgence/:id
 * Remove an indulgence item by id
 */
router.delete('/:id', removeIndulgenceItem);

export default router;
