import { Router } from 'express';
import {
  searchProductsHandler,
  getProductHandler,
  getAlternativesHandler,
} from '../controllers/products.controller';

const router = Router();

/**
 * GET /api/v1/products/search?q=...
 */
router.get('/search', searchProductsHandler);

/**
 * GET /api/v1/products/:id/alternatives
 * Must be before /:id to avoid route shadowing
 */
router.get('/:id/alternatives', getAlternativesHandler);

/**
 * GET /api/v1/products/:id
 */
router.get('/:id', getProductHandler);

export default router;
