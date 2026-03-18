import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

/**
 * GET /api/v1/profile
 */
router.get('/', getProfile);

/**
 * PUT /api/v1/profile
 */
router.put('/', updateProfile);

export default router;
