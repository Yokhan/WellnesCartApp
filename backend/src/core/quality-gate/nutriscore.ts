import { NutriScoreGrade } from '../../shared/types/enums';
import { ProductNutrients } from '../../shared/types/product.types';
import {
  ENERGY_KJ_POINTS,
  SAT_FAT_POINTS,
  SUGARS_POINTS,
  SODIUM_POINTS,
  FIBER_POINTS,
  PROTEIN_POINTS,
  NUTRISCORE_GRADES,
} from './gate.data';

function getPoints(value: number, table: [number, number][]): number {
  for (const [threshold, points] of table) {
    if (value <= threshold) return points;
  }
  // Exceeds all thresholds — return max points + 1
  return table[table.length - 1][1] + 1;
}

function getFruitsVegPoints(pct: number): number {
  if (pct > 80) return 5;
  if (pct > 60) return 4;
  if (pct > 40) return 2;
  return 0;
}

export interface NutriScoreResult {
  score: number;
  grade: NutriScoreGrade;
  negativePoints: number;
  positivePoints: number;
}

export function computeNutriScore(nutrients: ProductNutrients): NutriScoreResult {
  const energyPts = getPoints(nutrients.energyKj, ENERGY_KJ_POINTS);
  const satFatPts = getPoints(nutrients.saturatedFatG, SAT_FAT_POINTS);
  const sugarsPts = getPoints(nutrients.sugarsG, SUGARS_POINTS);
  const sodiumPts = getPoints(nutrients.sodiumMg, SODIUM_POINTS);
  const negativePoints = energyPts + satFatPts + sugarsPts + sodiumPts;

  const fiberPts = getPoints(nutrients.fiberG ?? 0, FIBER_POINTS);
  const fruitsVegPts = getFruitsVegPoints(nutrients.fruitsVegNutsPct ?? 0);
  let proteinPts = getPoints(nutrients.proteinsG, PROTEIN_POINTS);

  // NutriScore-2023 rule: if negativePoints >= 11, protein NOT subtracted
  // unless fruits/veg/nuts points >= 5
  if (negativePoints >= 11 && fruitsVegPts < 5) {
    proteinPts = 0;
  }
  const positivePoints = fiberPts + fruitsVegPts + proteinPts;

  const score = negativePoints - positivePoints;

  const gradeEntry = NUTRISCORE_GRADES.find((g) => score <= g.maxScore);
  const grade = (gradeEntry?.grade ?? 'E') as NutriScoreGrade;

  return { score, grade, negativePoints, positivePoints };
}
