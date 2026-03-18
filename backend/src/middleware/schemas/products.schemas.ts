import { z } from 'zod';

export const searchProductsSchema = z.object({
  q: z.string().min(1, 'Search query is required').max(100),
  category: z.string().max(50).optional(),
  store: z.string().max(50).optional(),
  limit: z
    .string()
    .regex(/^\d+$/, 'limit must be a positive integer')
    .transform(Number)
    .refine((n) => n >= 1 && n <= 100, 'limit must be between 1 and 100')
    .optional(),
});

export const productIdSchema = z.object({
  id: z.string().uuid('Product id must be a valid UUID'),
});
