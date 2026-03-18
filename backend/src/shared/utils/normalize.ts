// Normalize a value to [0, 1] range
export function normalizeMinMax(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

// Normalize NutriScore grade to 0-1 (A=1, E=0)
export function normalizeNutriScoreGrade(grade: string): number {
  const grades: Record<string, number> = { A: 1.0, B: 0.75, C: 0.5, D: 0.25, E: 0.0 };
  return grades[grade] ?? 0;
}

// Normalize price per protein (lower price = higher score)
// Pass array of all candidates to compute min/max
export function normalizePricePerProtein(
  pricePerProteinG: number,
  allCandidates: number[]
): number {
  const min = Math.min(...allCandidates);
  const max = Math.max(...allCandidates);
  if (max === min) return 1;
  // Invert: lower price → higher normalized score
  return 1 - normalizeMinMax(pricePerProteinG, min, max);
}
