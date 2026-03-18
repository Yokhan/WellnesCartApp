import axios from 'axios';
import { getSupabaseAdminClient } from '../utils/supabase';
import { evaluateQualityGate } from '../core/quality-gate';
import { computeBatchCompositeScores } from '../core/value-score';
import { filterSwapCandidates, rankSwapCandidates } from '../core/swap-engine';
import { getAllProducts } from './product.service';
import { UniversalProduct, ProductWithScore } from '../shared/types/product.types';
import { ShoppingList } from '../shared/types/shopping-list.types';
import env from '../config/env';
import { logger } from '../utils/logger';

interface LPSolverResponse {
  status: string;
  basket: Array<{ product_id: string; quantity: number }>;
  total_cost_rub: number;
  total_protein_g: number;
  total_calories: number;
  infeasibility_reason?: string;
}

interface UserProfile {
  weekly_budget_rub: number;
  target_protein_g: number;
  target_calories: number;
}

interface IndulgenceItem {
  is_sacred: boolean;
  universal_product_id: string | null;
}

async function getUserProfileOrThrow(userId: string): Promise<UserProfile> {
  const supabase = getSupabaseAdminClient();
  const { data: profile } = await supabase
    .from('user_nutrition_profiles')
    .select('weekly_budget_rub, target_protein_g, target_calories')
    .eq('user_id', userId)
    .single();
  if (!profile) throw new Error('User profile not found');
  return profile as UserProfile;
}

async function getIndulgenceItems(userId: string): Promise<IndulgenceItem[]> {
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase
    .from('user_indulgence_items')
    .select('is_sacred, universal_product_id')
    .eq('user_id', userId);
  return (data ?? []) as IndulgenceItem[];
}

function filterByQualityGate(products: UniversalProduct[]): UniversalProduct[] {
  return products.filter((p) => {
    const result = evaluateQualityGate({
      nutriscoreGrade: p.nutriscoreGrade,
      nutriscoreScore: p.nutriscoreScore,
      novaGroup: p.novaGroup,
      hasTransFats: p.hasTransFats,
      sodiumMg: p.nutrients.sodiumMg,
    });
    return result.gatePassed;
  });
}

function buildProductsWithScores(
  products: UniversalProduct[],
  weeklyBudget: number
): ProductWithScore[] {
  const inputs = products.map((p) => ({
    id: p.id,
    nutriscoreGrade: p.nutriscoreGrade,
    pricePerProteinG: p.nutrients.proteinsG > 0 ? 100 / p.nutrients.proteinsG : 999,
    deficitScore: 0.5,
  }));
  const scores = computeBatchCompositeScores(inputs, weeklyBudget);
  const scoreMap = new Map(scores.map((s) => [s.id, s.compositeScore]));

  return products.map((p) => ({
    ...p,
    priceRub: 100,
    pricePerProteinG: p.nutrients.proteinsG > 0 ? 100 / p.nutrients.proteinsG : 999,
    compositeScore: scoreMap.get(p.id) ?? 0.5,
  }));
}

async function callLpSolver(
  productsWithScores: ProductWithScore[],
  profile: UserProfile,
  sacredIds: string[]
): Promise<LPSolverResponse> {
  const payload = {
    products: productsWithScores.map((p) => ({
      id: p.id,
      price_rub: p.priceRub,
      protein_per_serving_g: (p.nutrients.proteinsG * p.servingSizeG) / 100,
      calories_per_serving_g: (p.nutrients.energyKj * 0.239 * p.servingSizeG) / 100,
      composite_score: p.compositeScore,
      max_quantity: 5,
    })),
    constraints: {
      weekly_budget_rub: Number(profile.weekly_budget_rub),
      weekly_protein_target_g: Number(profile.target_protein_g) * 7,
      weekly_calorie_min: Number(profile.target_calories) * 7 * 0.9,
      weekly_calorie_max: Number(profile.target_calories) * 7 * 1.1,
      sacred_product_ids: sacredIds,
    },
  };

  try {
    const response = await axios.post<LPSolverResponse>(
      `${env.LP_SOLVER_URL}/solve`,
      payload,
      { timeout: 35000 }
    );
    return response.data;
  } catch (err) {
    logger.error({ err }, 'LP solver failed');
    throw new Error('Не удалось оптимизировать корзину. Попробуйте позже.');
  }
}

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(now.setDate(diff)).toISOString().split('T')[0];
}

export async function generateShoppingList(userId: string): Promise<ShoppingList> {
  const supabase = getSupabaseAdminClient();

  const [profile, indulgenceItems, allProducts] = await Promise.all([
    getUserProfileOrThrow(userId),
    getIndulgenceItems(userId),
    getAllProducts(200),
  ]);

  const sacredIds = indulgenceItems
    .filter((i) => i.is_sacred && i.universal_product_id)
    .map((i) => String(i.universal_product_id));

  const passedProducts = filterByQualityGate(allProducts);
  logger.info(`Quality Gate: ${passedProducts.length}/${allProducts.length} products passed`);

  const productsWithScores = buildProductsWithScores(passedProducts, Number(profile.weekly_budget_rub));

  const lpResult = await callLpSolver(productsWithScores, profile, sacredIds);
  if (lpResult.status !== 'optimal') {
    throw new Error(
      lpResult.infeasibility_reason ?? 'Невозможно составить корзину с текущими ограничениями'
    );
  }

  const basketProductIds = new Set(lpResult.basket.map((b) => b.product_id));
  const productMap = new Map(productsWithScores.map((p) => [p.id, p]));

  const items = lpResult.basket.map((basketItem) => {
    const product = productMap.get(basketItem.product_id);
    if (!product) throw new Error(`Product not found: ${basketItem.product_id}`);

    const candidates = filterSwapCandidates({
      sourceConvenienceTier: product.convenienceTier,
      sourceUseContext: product.useContext,
      candidates: productsWithScores,
      excludeIds: Array.from(basketProductIds),
    });
    const swapCandidates = rankSwapCandidates(candidates);

    return {
      id: `item_${product.id}`,
      listId: 'pending',
      universalProductId: product.id,
      canonicalName: product.canonicalName,
      quantity: basketItem.quantity,
      unit: 'шт',
      priceSnapshotRub: product.priceRub,
      swapCandidates,
      isIndulgence: indulgenceItems.some((i) => i.universal_product_id === product.id),
      isSacred: sacredIds.includes(product.id),
    };
  });

  const weekStart = getWeekStart();
  const { data: list, error } = await supabase
    .from('shopping_lists')
    .insert({
      user_id: userId,
      week_start_date: weekStart,
      status: 'active',
      total_cost_rub: lpResult.total_cost_rub,
      total_protein_g: lpResult.total_protein_g,
      total_calories: lpResult.total_calories,
    })
    .select('id')
    .single();

  if (error || !list) throw error ?? new Error('Failed to save list');

  await supabase.from('shopping_list_items').insert(
    items.map((item) => ({
      list_id: list.id,
      universal_product_id: item.universalProductId,
      quantity: item.quantity,
      unit: item.unit,
      price_snapshot_rub: item.priceSnapshotRub,
      swap_candidates: item.swapCandidates,
      is_indulgence: item.isIndulgence,
      is_sacred: item.isSacred,
    }))
  );

  const now = new Date().toISOString();
  return {
    id: list.id,
    userId,
    weekStartDate: weekStart,
    status: 'active',
    totalCostRub: lpResult.total_cost_rub,
    totalProteinG: lpResult.total_protein_g,
    totalCalories: lpResult.total_calories,
    items: items.map((i) => ({ ...i, listId: list.id })),
    createdAt: now,
    updatedAt: now,
  };
}
