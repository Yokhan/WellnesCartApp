import type { Product, UserProfile, ValueScore } from '../../shared/types';
import { WEIGHTS_BY_TIER, GRADE_NORM, DEFICIT_NUTRIENT_TARGETS } from './value-score.data';

const SAFE_EPS = 1e-6;

export function pricePerProteinG(product: Product): number {
  const total_protein_g = (product.weight_g / 100) * product.nutrients_per_100g.protein_g;
  if (total_protein_g < SAFE_EPS) return Number.POSITIVE_INFINITY;
  return product.price_rub / total_protein_g;
}

export function pricePer100Kcal(product: Product): number {
  const total_kcal = (product.weight_g / 100) * product.nutrients_per_100g.calories_kcal;
  if (total_kcal < SAFE_EPS) return Number.POSITIVE_INFINITY;
  return (product.price_rub / total_kcal) * 100;
}

function normInverse(value: number, minInv: number, maxInv: number): number {
  if (!Number.isFinite(value)) return 0;
  const inv = 1 / Math.max(value, SAFE_EPS);
  if (maxInv - minInv < SAFE_EPS) return 0.5;
  return Math.max(0, Math.min(1, (inv - minInv) / (maxInv - minInv)));
}

function deficitScore(p: Product, priority: UserProfile['priority_nutrients']): number {
  if (priority.length === 0) return 0.5;
  let total = 0;
  for (const nutrient of priority) {
    if (nutrient === 'protein') {
      total += Math.min(1, p.nutrients_per_100g.protein_g / DEFICIT_NUTRIENT_TARGETS.protein_g_per_100g);
    } else if (nutrient === 'fiber') {
      total += Math.min(1, p.nutrients_per_100g.fiber_g / DEFICIT_NUTRIENT_TARGETS.fiber_g_per_100g);
    } else {
      total += 0.3;
    }
  }
  return total / priority.length;
}

export interface ScoringContext {
  slot_price_per_protein_min: number;
  slot_price_per_protein_max: number;
}

export function computeValueScore(
  product: Product,
  profile: UserProfile,
  ctx?: ScoringContext,
): ValueScore {
  const weights = WEIGHTS_BY_TIER[profile.budget_tier];
  const ppp = pricePerProteinG(product);
  const pk = pricePer100Kcal(product);
  const ns = GRADE_NORM[product.nutriscore_grade];

  const minInv = ctx ? 1 / Math.max(ctx.slot_price_per_protein_max, SAFE_EPS) : 0;
  const maxInv = ctx ? 1 / Math.max(ctx.slot_price_per_protein_min, SAFE_EPS) : 1;
  const priceNorm = ctx
    ? normInverse(ppp, minInv, maxInv)
    : Math.max(0, 1 - Math.min(1, ppp / 30));

  const def = deficitScore(product, profile.priority_nutrients);

  const composite = weights.ns * ns + weights.price * priceNorm + weights.deficit * def;

  return {
    composite_score: Number(composite.toFixed(4)),
    price_per_protein_g: Number(ppp.toFixed(2)),
    price_per_100kcal: Number(pk.toFixed(2)),
    nutriscore_norm: ns,
  };
}
