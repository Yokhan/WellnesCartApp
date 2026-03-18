import { NutriScoreGrade, NovaGroup, ConvenienceTier, UseContext } from './enums';

export interface ProductNutrients {
  energyKj: number;
  proteinsG: number;
  carbohydratesG: number;
  sugarsG: number;
  fatG: number;
  saturatedFatG: number;
  fiberG?: number;
  sodiumMg: number;
  saltG: number;
  fruitsVegNutsPct?: number; // 0-100, for NutriScore calculation
}

export interface UniversalProduct {
  id: string;
  canonicalName: string;
  brandCanonical?: string;
  category: string;
  convenienceTier: ConvenienceTier;
  useContext: UseContext[];
  nutriscoreGrade: NutriScoreGrade;
  nutriscoreScore: number;
  novaGroup: NovaGroup;
  hasTransFats: boolean;
  nutrients: ProductNutrients;
  servingSizeG: number;
  source: string;
  lastVerifiedAt: string;
}

export interface Product {
  id: string;
  universalProductId?: string;
  ean?: string;
  brandName: string;
  productName: string;
  storeId: string;
  priceRub: number;
  pricePerKg?: number;
  availabilityStatus: 'in_stock' | 'out_of_stock' | 'unknown';
  convenienceTier: ConvenienceTier;
  useContext: UseContext[];
  nutrients: ProductNutrients;
  nutriscoreGrade?: NutriScoreGrade;
  novaGroup?: NovaGroup;
  qualityGatePassed: boolean;
}

export interface ProductWithScore extends UniversalProduct {
  priceRub: number;
  pricePerProteinG: number; // рублей за грамм белка
  compositeScore: number; // 0-1
  storeId?: string;
}
