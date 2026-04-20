import type {
  Product, ProductDetail, UserProfile, ShoppingList, ShoppingListItem,
  BasketTemplate, SwapSuggestion, ApiError,
} from '../shared/types';
import { deriveBudgetTier } from '../shared/types';
import type { OnboardingDraft } from '../shared/state';
import { evalGate } from '../core/quality-gate';
import { computeValueScore } from '../core/value-score';
import { pickBootstrapBasket } from '../core/lp-solver';
import { rankSwaps } from '../core/swaps';
import productsJson from './fixtures/universal-products.json';
import basketsJson from './fixtures/baskets.json';

const API_DELAY_MS = 150;
const PRODUCTS: Product[] = productsJson as unknown as Product[];
const BASKETS: BasketTemplate[] = basketsJson as unknown as BasketTemplate[];

function delay<T>(v: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(clone(v)), API_DELAY_MS));
}

function clone<T>(v: T): T {
  if (typeof structuredClone === 'function') return structuredClone(v);
  return JSON.parse(JSON.stringify(v)) as T;
}

function fail(code: string, message: string): ApiError {
  return { code, message };
}

function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

function makeDetail(p: Product, profile: UserProfile | null): ProductDetail {
  const gate = evalGate(p);
  const value = profile
    ? computeValueScore(p, profile)
    : { composite_score: 0, price_per_protein_g: 0, price_per_100kcal: 0, nutriscore_norm: 0 };
  return { ...p, gate, value, evidence: 'SR/MA' };
}

export function getBootstrapBaskets(): Promise<BasketTemplate[]> {
  return delay(BASKETS);
}

export function getUniversalProducts(): Promise<Product[]> {
  return delay(PRODUCTS);
}

export function getProductById(id: string, profile: UserProfile | null = null): Promise<ProductDetail> {
  const p = findProduct(id);
  if (!p) return Promise.reject(fail('NOT_FOUND', `Товар ${id} не найден`));
  return delay(makeDetail(p, profile));
}

export function getProductSwaps(productId: string, profile: UserProfile): Promise<ProductDetail[]> {
  const current = findProduct(productId);
  if (!current) return Promise.reject(fail('NOT_FOUND', `Товар ${productId} не найден`));
  const ranked = rankSwaps(PRODUCTS, current, profile, 3);
  return delay(ranked);
}

const CONVENIENCE_LABELS: Record<number, string> = {
  1: 'Готовое',
  2: 'Быстрое (5 мин)',
  3: 'Для готовки',
};

function itemFromProduct(p: Product, profile: UserProfile): ShoppingListItem {
  const gate = evalGate(p);
  const value = computeValueScore(p, profile);
  return {
    id: `li-${p.id}`,
    product_id: p.id,
    product: p,
    quantity: 1,
    checked: false,
    is_sacred: profile.sacred_items.includes(p.id),
    gate,
    value,
  };
}

function buildListFromBasket(basket: BasketTemplate, profile: UserProfile): ShoppingList {
  const items: ShoppingListItem[] = [];
  for (const bi of basket.items) {
    const p = findProduct(bi.universal_product_id);
    if (!p) continue;
    items.push(itemFromProduct(p, profile));
  }
  const total = items.reduce((sum, it) => sum + it.product.price_rub * it.quantity, 0);

  const swaps_of_week: SwapSuggestion[] = items.slice(0, 8).flatMap((it) => {
    const alt = rankSwaps(PRODUCTS, it.product, profile, 1)[0];
    if (!alt) return [];
    const fromScore = computeValueScore(it.product, profile).composite_score;
    const toScore = alt.value.composite_score;
    if (toScore - fromScore < 0.05) return [];
    const reasons: string[] = [];
    if (alt.nutriscore_grade < it.product.nutriscore_grade) {
      reasons.push(`NutriScore ${alt.nutriscore_grade} vs ${it.product.nutriscore_grade}`);
    }
    if (alt.price_rub < it.product.price_rub) {
      reasons.push(`−${Math.round(it.product.price_rub - alt.price_rub)} ₽`);
    }
    if (alt.nova_class < it.product.nova_class) {
      reasons.push(`NOVA ${alt.nova_class} vs ${it.product.nova_class}`);
    }
    if (alt.nutrients_per_100g.protein_g > it.product.nutrients_per_100g.protein_g) {
      reasons.push('Больше белка');
    }
    if (reasons.length === 0) reasons.push('Лучше общая оценка');
    return [{
      from_product_id: it.product.id,
      to_product_id: alt.id,
      from_name: it.product.name,
      to_name: alt.name,
      protein_delta_g: Number((alt.nutrients_per_100g.protein_g - it.product.nutrients_per_100g.protein_g).toFixed(1)),
      price_delta_rub: Number((alt.price_rub - it.product.price_rub).toFixed(0)),
      reason: reasons[0] ?? 'Лучше общая оценка',
      reasons,
      score_delta: Number((toScore - fromScore).toFixed(2)),
      from_score: Number(fromScore.toFixed(2)),
      to_score: Number(toScore.toFixed(2)),
      convenience_label: CONVENIENCE_LABELS[it.product.convenience_tier] ?? '',
    }];
  }).slice(0, 5);

  return {
    id: `list-${Date.now()}`,
    user_id: profile.id,
    period: periodLabelForThisWeek(),
    items,
    total_estimated_rub: Number(total.toFixed(0)),
    total_daily_protein_g: basket.daily_protein_g,
    total_daily_calories_kcal: basket.daily_calories_kcal,
    swaps_of_week,
  };
}

function periodLabelForThisWeek(): string {
  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) => `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
  return `${fmt(now)} — ${fmt(end)}`;
}

export function submitOnboarding(draft: OnboardingDraft): Promise<{ profile: UserProfile; list: ShoppingList }> {
  const goal = draft.goal ?? 'maintain';
  const profile: UserProfile = {
    id: `u-${Date.now()}`,
    goal,
    weight_kg: 75, height_cm: 178, age: 30, sex: 'M', activity_level: 'med',
    weekly_budget_rub: draft.weekly_budget_rub,
    budget_tier: deriveBudgetTier(draft.weekly_budget_rub),
    preferred_stores: draft.preferred_stores.length > 0 ? draft.preferred_stores : ['Пятёрочка'],
    allergens: draft.allergens,
    excluded_ingredients: draft.excluded_ingredients,
    sacred_items: [],
    priority_nutrients: goal === 'bulk' || goal === 'cut' ? ['protein'] : ['protein', 'fiber'],
    progression_stage: 1,
    swaps_accepted_week: 0,
    created_at: new Date().toISOString(),
  };
  const basket = pickBootstrapBasket(BASKETS, profile);
  const list = buildListFromBasket(basket, profile);
  return delay({ profile, list });
}

export function regenerateList(profile: UserProfile): Promise<ShoppingList> {
  const basket = pickBootstrapBasket(BASKETS, profile);
  return delay(buildListFromBasket(basket, profile));
}

export function updateProfile(current: UserProfile, patch: Partial<UserProfile>): Promise<UserProfile> {
  const next: UserProfile = {
    ...current,
    ...patch,
    budget_tier: patch.weekly_budget_rub !== undefined
      ? deriveBudgetTier(patch.weekly_budget_rub)
      : current.budget_tier,
  };
  return delay(next);
}

export function applySwap(
  list: ShoppingList,
  fromProductId: string,
  toProductId: string,
): Promise<ShoppingList> {
  const target = findProduct(toProductId);
  if (!target) return Promise.reject(fail('NOT_FOUND', `Товар ${toProductId} не найден`));
  const nextItems = list.items.map((it) => {
    if (it.product_id !== fromProductId) return it;
    if (it.is_sacred) return it;
    return { ...it, product_id: target.id, product: target };
  });
  const total = nextItems.reduce((sum, it) => sum + it.product.price_rub * it.quantity, 0);
  const swaps_of_week = list.swaps_of_week.filter((s) => s.from_product_id !== fromProductId);
  return delay({ ...list, items: nextItems, total_estimated_rub: Number(total.toFixed(0)), swaps_of_week });
}

export function toggleItem(list: ShoppingList, itemId: string): Promise<ShoppingList> {
  const nextItems = list.items.map((it) =>
    it.id === itemId ? { ...it, checked: !it.checked } : it,
  );
  return delay({ ...list, items: nextItems });
}

export function removeItem(list: ShoppingList, itemId: string): Promise<ShoppingList> {
  const item = list.items.find((it) => it.id === itemId);
  if (item?.is_sacred) return Promise.reject(fail('SACRED', 'Нельзя удалять sacred-товар'));
  const nextItems = list.items.filter((it) => it.id !== itemId);
  const total = nextItems.reduce((sum, it) => sum + it.product.price_rub * it.quantity, 0);
  return delay({ ...list, items: nextItems, total_estimated_rub: Number(total.toFixed(0)) });
}

export const api = {
  getBootstrapBaskets,
  getUniversalProducts,
  getProductById,
  getProductSwaps,
  submitOnboarding,
  regenerateList,
  updateProfile,
  applySwap,
  toggleItem,
  removeItem,
};
export type ApiClient = typeof api;
