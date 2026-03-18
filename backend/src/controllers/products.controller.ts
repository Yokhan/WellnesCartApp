import { Request, Response, NextFunction } from 'express';
import { searchProducts, getProductById, getAllProducts } from '../services/product.service';
import { evaluateQualityGate } from '../core/quality-gate';
import { filterSwapCandidates, rankSwapCandidates } from '../core/swap-engine';
import { sendSuccess, sendError } from '../utils/response';

/**
 * GET /api/v1/products/search?q=...
 */
export async function searchProductsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const q = typeof req.query['q'] === 'string' ? req.query['q'] : '';
    const products = await searchProducts(q);
    sendSuccess(res, { products });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/products/:id
 */
export async function getProductHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    if (!id) {
      sendError(res, 'VALIDATION_ERROR', 'Product id is required', 400);
      return;
    }

    const product = await getProductById(id);
    if (!product) {
      sendError(res, 'NOT_FOUND', 'Product not found', 404);
      return;
    }

    const qualityGate = evaluateQualityGate({
      nutriscoreGrade: product.nutriscoreGrade,
      nutriscoreScore: product.nutriscoreScore,
      novaGroup: product.novaGroup,
      hasTransFats: product.hasTransFats,
      sodiumMg: product.nutrients.sodiumMg,
    });

    sendSuccess(res, { product, qualityGate });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/products/:id/alternatives
 */
export async function getAlternativesHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    if (!id) {
      sendError(res, 'VALIDATION_ERROR', 'Product id is required', 400);
      return;
    }

    const source = await getProductById(id);
    if (!source) {
      sendError(res, 'NOT_FOUND', 'Product not found', 404);
      return;
    }

    const allProducts = await getAllProducts();
    const withScores = allProducts.map((p) => ({
      ...p,
      priceRub: 100,
      pricePerProteinG: p.nutrients.proteinsG > 0 ? 100 / p.nutrients.proteinsG : 999,
      compositeScore: 0.5,
    }));

    const candidates = filterSwapCandidates({
      sourceConvenienceTier: source.convenienceTier,
      sourceUseContext: source.useContext,
      candidates: withScores,
      excludeIds: [id],
    });

    const ranked = rankSwapCandidates(candidates);
    sendSuccess(res, { alternatives: ranked });
  } catch (err) {
    next(err);
  }
}
