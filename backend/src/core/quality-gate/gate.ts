import { NutriScoreGrade } from '../../shared/types/enums';
import {
  QualityGateInput,
  QualityGateResult,
  QualityGateWarning,
} from '../../shared/types/quality-gate.types';
import { SODIUM_WARNING_MG_PER_100G } from './gate.data';
import { detectEmulsifiers } from './nova';

const LOW_NUTRISCORE_GRADES: NutriScoreGrade[] = ['C', 'D', 'E'];

function buildResult(
  gatePassed: boolean,
  gateTier: 1 | 2 | 3 | null,
  blockReason: string | undefined,
  warnings: QualityGateWarning[],
  input: QualityGateInput,
  transFatFlagged: boolean,
  emulsifierFlagged: boolean,
  sodiumFlagged = false
): QualityGateResult {
  return {
    gatePassed,
    gateTier: gatePassed && warnings.length === 0 ? null : gateTier,
    blockReason,
    warnings,
    nutriscoreGrade: input.nutriscoreGrade,
    novaGroup: input.novaGroup,
    transFatFlagged,
    emulsifierFlagged,
    sodiumFlagged,
  };
}

export function evaluateQualityGate(input: QualityGateInput): QualityGateResult {
  const warnings: QualityGateWarning[] = [];

  // --- TIER-1 BLOCKS ---

  // Block 1: NutriScore D or E
  if (input.nutriscoreGrade === 'D' || input.nutriscoreGrade === 'E') {
    return buildResult(
      false,
      1,
      `NutriScore ${input.nutriscoreGrade} — продукт заблокирован Quality Gate`,
      warnings,
      input,
      false,
      false
    );
  }

  // Block 2: NOVA 4 AND NutriScore C or below
  if (input.novaGroup === 4 && LOW_NUTRISCORE_GRADES.includes(input.nutriscoreGrade)) {
    return buildResult(
      false,
      1,
      `NOVA 4 + NutriScore ${input.nutriscoreGrade} — ультра-обработанный продукт с низким NutriScore`,
      warnings,
      input,
      false,
      false
    );
  }

  // Block 3: Trans fats present
  if (input.hasTransFats) {
    return buildResult(
      false,
      1,
      'Промышленные трансжиры — превышен допустимый порог EFSA',
      warnings,
      input,
      true,
      false
    );
  }

  // --- TIER-2 WARNINGS ---

  // Warn 1: NOVA 4 with good NutriScore (A or B)
  if (input.novaGroup === 4) {
    warnings.push({
      code: 'NOVA4_GOOD_NUTRISCORE',
      message: 'Ультра-обработанный продукт (NOVA 4), несмотря на хороший NutriScore',
      tier: 2,
    });
  }

  // Warn 2: Emulsifiers detected
  const detectedEmulsifiers = detectEmulsifiers(input.ingredients ?? []);
  const emulsifierFlagged = detectedEmulsifiers.length > 0;
  if (emulsifierFlagged) {
    warnings.push({
      code: 'EMULSIFIERS',
      message: `Содержит эмульгаторы: ${detectedEmulsifiers.join(', ')}`,
      tier: 2,
    });
  }

  // Warn 3: High sodium
  const sodiumFlagged = input.sodiumMg > SODIUM_WARNING_MG_PER_100G;
  if (sodiumFlagged) {
    warnings.push({
      code: 'HIGH_SODIUM',
      message: `Высокое содержание соли: ${(input.sodiumMg / 1000).toFixed(2)}г/100г (порог 1.5г)`,
      tier: 2,
    });
  }

  return buildResult(
    true,
    warnings.length > 0 ? 2 : null,
    undefined,
    warnings,
    input,
    false,
    emulsifierFlagged,
    sodiumFlagged
  );
}
