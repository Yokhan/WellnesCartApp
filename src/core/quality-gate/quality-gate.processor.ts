import type { Product, GateResult } from '../../shared/types';
import {
  EMULSIFIER_E_NUMBERS,
  TRANS_FAT_BLOCK_G_PER_100G,
  TRANS_FAT_WARN_G_PER_100G,
  SODIUM_BLOCK_G_PER_100G,
  SODIUM_WARN_G_PER_100G,
  BLOCK_GRADES,
  WARN_GRADES,
} from './quality-gate.data';

export function evalGate(p: Product): GateResult {
  const reasons: string[] = [];
  const warnings: string[] = [];

  if (BLOCK_GRADES.includes(p.nutriscore_grade)) {
    reasons.push(`NutriScore ${p.nutriscore_grade}`);
  }
  if (p.nova_class === 4 && BLOCK_GRADES.includes(p.nutriscore_grade)) {
    reasons.push('NOVA-4 + низкий NutriScore');
  }
  if (p.nutrients_per_100g.trans_fat_g > TRANS_FAT_BLOCK_G_PER_100G) {
    reasons.push(`Трансжиры ${p.nutrients_per_100g.trans_fat_g}г/100г`);
  }
  if (p.nutrients_per_100g.sodium_g > SODIUM_BLOCK_G_PER_100G) {
    reasons.push(`Натрий ${p.nutrients_per_100g.sodium_g}г/100г`);
  }

  if (p.nova_class === 4 && WARN_GRADES.includes(p.nutriscore_grade)) {
    warnings.push('Ультрапереработанный продукт (NOVA-4)');
  }
  if (p.nutrients_per_100g.trans_fat_g > TRANS_FAT_WARN_G_PER_100G &&
      p.nutrients_per_100g.trans_fat_g <= TRANS_FAT_BLOCK_G_PER_100G) {
    warnings.push('Повышенные трансжиры');
  }
  if (p.nutrients_per_100g.sodium_g > SODIUM_WARN_G_PER_100G &&
      p.nutrients_per_100g.sodium_g <= SODIUM_BLOCK_G_PER_100G) {
    warnings.push('Повышенный натрий');
  }
  const hasEmulsifier = p.e_additives.some((e) => EMULSIFIER_E_NUMBERS.includes(e));
  if (hasEmulsifier) warnings.push('Эмульгаторы E466/E471-E475');

  const gate_passed = reasons.length === 0;
  let gate_tier: GateResult['gate_tier'] = 0;
  if (!gate_passed) gate_tier = 1;
  else if (warnings.length >= 2) gate_tier = 3;
  else if (warnings.length === 1) gate_tier = 2;

  return { gate_passed, gate_tier, reasons, warnings };
}
