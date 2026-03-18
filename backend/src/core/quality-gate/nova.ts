import { NovaGroup } from '../../shared/types/enums';
import { EMULSIFIER_E_NUMBERS } from './gate.data';

// NOVA classification helpers.
// In the full system, NOVA group comes from product data.
// This module provides ingredient-based detection helpers.

export function detectEmulsifiers(ingredients: string[]): string[] {
  return ingredients.filter((ing) =>
    EMULSIFIER_E_NUMBERS.some((e) => ing.toUpperCase().includes(e))
  );
}

export function isNovaUltraProcessed(novaGroup: NovaGroup): boolean {
  return novaGroup === 4;
}
