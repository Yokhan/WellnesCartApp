import { ListStatus } from './enums';
import { SwapCandidate } from './value-score.types';

export interface ShoppingListItem {
  id: string;
  listId: string;
  productId?: string;
  universalProductId: string;
  canonicalName: string;
  quantity: number;
  unit: string;
  priceSnapshotRub: number;
  storeId?: string;
  swapCandidates: SwapCandidate[]; // top-3 alternatives
  isIndulgence: boolean;
  isSacred: boolean;
  sourceSlot?: string;
}

export interface ShoppingList {
  id: string;
  userId: string;
  weekStartDate: string;
  status: ListStatus;
  totalCostRub: number;
  totalProteinG: number;
  totalCalories: number;
  items: ShoppingListItem[];
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}
