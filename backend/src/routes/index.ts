import { Router } from 'express';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import listsRoutes from './lists.routes';
import productsRoutes from './products.routes';
import swapsRoutes from './swaps.routes';
import indulgenceRoutes from './indulgence.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/products', productsRoutes);
router.use('/shopping-lists', listsRoutes);
// Swaps are nested under shopping lists: /shopping-lists/:id/swaps
router.use('/shopping-lists/:id/swaps', swapsRoutes);
router.use('/indulgence', indulgenceRoutes);

export default router;
