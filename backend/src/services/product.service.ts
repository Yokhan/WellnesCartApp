import { getSupabaseAdminClient } from '../utils/supabase';
import { UniversalProduct } from '../shared/types/product.types';
import { NutriScoreGrade, NovaGroup, ConvenienceTier, UseContext } from '../shared/types/enums';

export async function searchProducts(query: string, limit = 20): Promise<UniversalProduct[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('universal_products')
    .select('*')
    .ilike('canonical_name', `%${query}%`)
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(mapRowToProduct);
}

export async function getProductById(id: string): Promise<UniversalProduct | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('universal_products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return mapRowToProduct(data);
}

export async function getAllProducts(limit = 200): Promise<UniversalProduct[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('universal_products')
    .select('*')
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(mapRowToProduct);
}

export function mapRowToProduct(row: Record<string, unknown>): UniversalProduct {
  return {
    id: String(row['id']),
    canonicalName: String(row['canonical_name']),
    brandCanonical: row['brand_canonical'] ? String(row['brand_canonical']) : undefined,
    category: String(row['category']),
    convenienceTier: Number(row['convenience_tier']) as ConvenienceTier,
    useContext: (row['use_context'] as UseContext[]) ?? [],
    nutriscoreGrade: String(row['nutriscore_grade']) as NutriScoreGrade,
    nutriscoreScore: Number(row['nutriscore_score']),
    novaGroup: Number(row['nova_group']) as NovaGroup,
    hasTransFats: Boolean(row['has_trans_fats']),
    nutrients: {
      energyKj: Number(row['energy_kj']),
      proteinsG: Number(row['proteins_g']),
      carbohydratesG: Number(row['carbohydrates_g']),
      sugarsG: Number(row['sugars_g']),
      fatG: Number(row['fat_g']),
      saturatedFatG: Number(row['saturated_fat_g']),
      fiberG: row['fiber_g'] != null ? Number(row['fiber_g']) : undefined,
      sodiumMg: Number(row['sodium_mg']),
      saltG: Number(row['salt_g']),
      fruitsVegNutsPct: row['fruits_veg_nuts_pct'] != null
        ? Number(row['fruits_veg_nuts_pct'])
        : undefined,
    },
    servingSizeG: Number(row['serving_size_g']),
    source: String(row['source']),
    lastVerifiedAt: String(row['last_verified_at']),
  };
}
