import { NutriScoreGrade, NovaGroup, GateTier } from './enums';

export interface QualityGateInput {
  nutriscoreGrade: NutriScoreGrade;
  nutriscoreScore: number;
  novaGroup: NovaGroup;
  hasTransFats: boolean;
  sodiumMg: number;
  ingredients?: string[]; // E-numbers and ingredient strings
}

export interface QualityGateResult {
  gatePassed: boolean;
  gateTier: GateTier | null; // null if passed without issues
  blockReason?: string;
  warnings: QualityGateWarning[];
  nutriscoreGrade: NutriScoreGrade;
  novaGroup: NovaGroup;
  transFatFlagged: boolean;
  emulsifierFlagged: boolean;
  sodiumFlagged: boolean;
}

export interface QualityGateWarning {
  code: string;
  message: string;
  tier: GateTier;
}
