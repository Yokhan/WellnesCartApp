import { create } from 'zustand';
import type { NutriScoreGrade, NovaGroup, ListStatus } from '@/design-system/tokens';
import { listsApi, swapsApi } from '@/services/api';

interface ShoppingListItem {
  id: string;
  productId: string;
  productName: string;
  brandName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  nutriScoreGrade: NutriScoreGrade;
  novaGroup: NovaGroup;
  proteinPer100g: number;
  pricePerProteinG: number;
  category: string;
  isIndulgence: boolean;
  isChecked: boolean;
}

interface ShoppingList {
  id: string;
  weekStartDate: string;
  items: ShoppingListItem[];
  totalCostRub: number;
  totalProteinG: number;
  totalCalories: number;
  status: ListStatus;
}

interface ListState {
  currentList: ShoppingList | null;
  isLoading: boolean;
  error: string | null;
}

interface ListActions {
  fetchCurrentList: () => Promise<void>;
  checkItem: (itemId: string, checked: boolean) => Promise<void>;
  applySwap: (itemId: string, candidateId: string) => Promise<void>;
  generateList: () => Promise<void>;
  clearError: () => void;
}

type ListStore = ListState & ListActions;

function isValidGrade(grade: unknown): grade is NutriScoreGrade {
  return ['A', 'B', 'C', 'D', 'E'].includes(grade as string);
}

function isValidNova(group: unknown): group is NovaGroup {
  return [1, 2, 3, 4].includes(group as number);
}

function safeParseItem(raw: Record<string, unknown>): ShoppingListItem {
  return {
    id: String(raw.id ?? ''),
    productId: String(raw.productId ?? ''),
    productName: String(raw.productName ?? ''),
    brandName: String(raw.brandName ?? ''),
    quantity: Number(raw.quantity ?? 1),
    unitPrice: Number(raw.unitPrice ?? 0),
    totalPrice: Number(raw.totalPrice ?? 0),
    nutriScoreGrade: isValidGrade(raw.nutriScoreGrade) ? raw.nutriScoreGrade : 'C',
    novaGroup: isValidNova(raw.novaGroup) ? raw.novaGroup : 3,
    proteinPer100g: Number(raw.proteinPer100g ?? 0),
    pricePerProteinG: Number(raw.pricePerProteinG ?? 0),
    category: String(raw.category ?? 'other'),
    isIndulgence: Boolean(raw.isIndulgence),
    isChecked: Boolean(raw.isChecked),
  };
}

export const useListStore = create<ListStore>((set, get) => ({
  currentList: null,
  isLoading: false,
  error: null,

  fetchCurrentList: async () => {
    set({ isLoading: true, error: null });
    try {
      const resp = await listsApi.getCurrent();
      const data = resp.data as unknown as Record<string, unknown>;
      const rawItems = Array.isArray(data.items) ? (data.items as unknown as Record<string, unknown>[]) : [];

      const list: ShoppingList = {
        id: String(data.id ?? ''),
        weekStartDate: String(data.weekStartDate ?? ''),
        items: rawItems.map(safeParseItem),
        totalCostRub: Number(data.totalCostRub ?? data.totalCost ?? 0),
        totalProteinG: Number(data.totalProteinG ?? 0),
        totalCalories: Number(data.totalCalories ?? data.totalCaloriesKcal ?? 0),
        status: (['draft', 'active', 'completed'] as ListStatus[]).includes(data.status as ListStatus)
          ? (data.status as ListStatus)
          : 'draft',
      };

      set({ currentList: list, isLoading: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ошибка загрузки списка';
      set({ error: msg, isLoading: false });
    }
  },

  checkItem: async (itemId, checked) => {
    const { currentList } = get();
    if (!currentList) return;

    // Optimistic update
    set((state) => ({
      currentList: state.currentList
        ? {
            ...state.currentList,
            items: state.currentList.items.map((item) =>
              item.id === itemId ? { ...item, isChecked: checked } : item
            ),
          }
        : null,
    }));

    try {
      await listsApi.checkItem(currentList.id, itemId, checked);
    } catch {
      // Rollback on error
      set((state) => ({
        currentList: state.currentList
          ? {
              ...state.currentList,
              items: state.currentList.items.map((item) =>
                item.id === itemId ? { ...item, isChecked: !checked } : item
              ),
            }
          : null,
      }));
    }
  },

  applySwap: async (itemId, candidateId) => {
    const { currentList } = get();
    if (!currentList) return;

    set({ isLoading: true, error: null });
    try {
      await swapsApi.applySwap(currentList.id, itemId, candidateId);
      await get().fetchCurrentList();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ошибка замены товара';
      set({ error: msg, isLoading: false });
    }
  },

  generateList: async () => {
    set({ isLoading: true, error: null });
    try {
      await listsApi.generate();
      await get().fetchCurrentList();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ошибка генерации списка';
      set({ error: msg, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export type { ShoppingList, ShoppingListItem };
