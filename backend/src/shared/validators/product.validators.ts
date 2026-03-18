import { z } from 'zod';

export const ProductNutrientsSchema = z.object({
  energyKj: z.number().min(0),
  proteinsG: z.number().min(0),
  carbohydratesG: z.number().min(0),
  sugarsG: z.number().min(0),
  fatG: z.number().min(0),
  saturatedFatG: z.number().min(0),
  fiberG: z.number().min(0).optional(),
  sodiumMg: z.number().min(0),
  saltG: z.number().min(0),
  fruitsVegNutsPct: z.number().min(0).max(100).optional(),
});

export const QualityGateInputSchema = z.object({
  nutriscoreGrade: z.enum(['A', 'B', 'C', 'D', 'E']),
  nutriscoreScore: z.number(),
  novaGroup: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  hasTransFats: z.boolean(),
  sodiumMg: z.number().min(0),
  ingredients: z.array(z.string()).optional(),
});
