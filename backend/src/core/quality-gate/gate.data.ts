// NutriScore-2023 scoring tables (general food category)
// All values per 100g

// Negative components — [upper threshold, points at that level]
export const ENERGY_KJ_POINTS: [number, number][] = [
  [335, 0], [670, 1], [1005, 2], [1340, 3], [1675, 4],
  [2010, 5], [2345, 6], [2680, 7], [3015, 8], [3350, 9],
];

export const SAT_FAT_POINTS: [number, number][] = [
  [1, 0], [2, 1], [3, 2], [4, 3], [5, 4],
  [6, 5], [7, 6], [8, 7], [9, 8], [10, 9],
];

export const SUGARS_POINTS: [number, number][] = [
  [4.5, 0], [9, 1], [13.5, 2], [18, 3], [22.5, 4],
  [27, 5], [31, 6], [36, 7], [40, 8], [45, 9],
];

export const SODIUM_POINTS: [number, number][] = [
  [90, 0], [180, 1], [270, 2], [360, 3], [450, 4],
  [540, 5], [630, 6], [720, 7], [810, 8], [900, 9],
];

// Positive components (subtracted from score — higher = better nutrition)
export const FIBER_POINTS: [number, number][] = [
  [0.9, 0], [1.9, 1], [2.8, 2], [3.7, 3], [4.7, 4],
];

export const PROTEIN_POINTS: [number, number][] = [
  [1.6, 0], [3.2, 1], [4.8, 2], [6.4, 3], [8.0, 4],
];

export const FRUITS_VEG_NUTS_POINTS: [number, number][] = [
  [40, 0], [60, 2], [80, 4],
];

// Grade thresholds — final NutriScore = negative_pts - positive_pts
export const NUTRISCORE_GRADES: { maxScore: number; grade: string }[] = [
  { maxScore: -1, grade: 'A' },
  { maxScore: 2, grade: 'B' },
  { maxScore: 10, grade: 'C' },
  { maxScore: 18, grade: 'D' },
  { maxScore: Infinity, grade: 'E' },
];

// Quality Gate thresholds
export const TRANS_FAT_THRESHOLD_G_PER_100G = 0.5; // EFSA practical limit
export const SODIUM_WARNING_MG_PER_100G = 1500; // 1.5g sodium = 1500mg
export const EMULSIFIER_E_NUMBERS = ['E466', 'E471', 'E472', 'E473', 'E474', 'E475'];
