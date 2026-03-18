import { z } from 'zod';

export const listIdSchema = z.object({
  id: z.string().uuid('List id must be a valid UUID'),
});

export const updateListItemSchema = z.object({
  quantity: z.number().int().min(1).max(99).optional(),
  isChecked: z.boolean().optional(),
});

export const generateListSchema = z.object({}).optional();

export const acceptSwapSchema = z.object({
  itemId: z.string().min(1, 'itemId is required'),
  newProductId: z.string().uuid('newProductId must be a valid UUID'),
});

export const rejectSwapSchema = z.object({
  itemId: z.string().min(1, 'itemId is required'),
});

export const addIndulgenceItemSchema = z.object({
  universalProductId: z.string().uuid('universalProductId must be a valid UUID'),
  servingG: z.number().positive('servingG must be a positive number'),
  dayOfWeek: z.number().int().min(0).max(6),
  mealContext: z.string().min(1, 'mealContext is required'),
  isSacred: z.boolean().optional(),
});
