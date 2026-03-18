export type Goal = 'bulk' | 'cut' | 'maintain';
export type NutriScoreGrade = 'A' | 'B' | 'C' | 'D' | 'E';
export type NovaGroup = 1 | 2 | 3 | 4;
export type GateTier = 1 | 2 | 3; // 1=block, 2=warn, 3=info
export type ConvenienceTier = 1 | 2 | 3; // 1=ready-to-eat, 2=quick-cook, 3=meal-base
export type UseContext =
  | 'sandwich'
  | 'hot_meal'
  | 'cold_snack'
  | 'breakfast_ready'
  | 'side_dish'
  | 'protein_source'
  | 'dairy'
  | 'beverage'
  | 'condiment';
export type InteractionType =
  | 'accepted_swap'
  | 'rejected_swap'
  | 'removed_from_list'
  | 'added_manually'
  | 'marked_purchased';
export type ListStatus = 'draft' | 'active' | 'purchased';
export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extra_active';
