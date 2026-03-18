import { create } from 'zustand';
import type { UserGoal } from '@/design-system/tokens';
import { authApi, indulgenceApi } from '@/services/api';

interface IndulgenceProduct {
  productId: string;
  productName: string;
  brandName: string;
}

interface ProfileState {
  goal: UserGoal | null;
  weeklyBudgetRub: number;
  proteinTargetG: number;
  calorieTargetKcal: number;
  stores: string[];
  indulgences: IndulgenceProduct[];
  isLoading: boolean;
  error: string | null;
}

interface ProfileActions {
  fetchIndulgences: () => Promise<void>;
  addIndulgence: (productId: string) => Promise<void>;
  removeIndulgence: (productId: string) => Promise<void>;
  updateGoal: (goal: UserGoal) => Promise<void>;
  updateBudget: (budgetRub: number) => Promise<void>;
  updateStores: (stores: string[]) => Promise<void>;
  updateMacroTargets: (proteinG: number, caloriesKcal: number) => Promise<void>;
  setProfileFromUser: (user: {
    goal: UserGoal;
    weeklyBudgetRub: number;
    proteinTargetG: number;
    calorieTargetKcal: number;
    stores: string[];
  }) => void;
  clearError: () => void;
}

type ProfileStore = ProfileState & ProfileActions;

const VALID_GOALS: UserGoal[] = ['cut', 'bulk', 'maintain', 'recomp'];

function isValidGoal(g: unknown): g is UserGoal {
  return VALID_GOALS.includes(g as UserGoal);
}

export const useProfileStore = create<ProfileStore>((set) => ({
  goal: null,
  weeklyBudgetRub: 5000,
  proteinTargetG: 140,
  calorieTargetKcal: 2200,
  stores: [],
  indulgences: [],
  isLoading: false,
  error: null,

  setProfileFromUser: (user) => {
    set({
      goal: isValidGoal(user.goal) ? user.goal : 'maintain',
      weeklyBudgetRub: user.weeklyBudgetRub,
      proteinTargetG: user.proteinTargetG,
      calorieTargetKcal: user.calorieTargetKcal,
      stores: user.stores,
    });
  },

  fetchIndulgences: async () => {
    set({ isLoading: true, error: null });
    try {
      const resp = await indulgenceApi.getAll();
      const items = resp.data as IndulgenceProduct[];
      set({ indulgences: items, isLoading: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ошибка загрузки';
      set({ error: msg, isLoading: false });
    }
  },

  addIndulgence: async (productId) => {
    try {
      await indulgenceApi.add({ universalProductId: productId, servingG: 100, dayOfWeek: 0, mealContext: 'snack' });
      const resp = await indulgenceApi.getAll();
      set({ indulgences: resp.data as IndulgenceProduct[] });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ошибка добавления';
      set({ error: msg });
    }
  },

  removeIndulgence: async (productId) => {
    set((state) => ({
      indulgences: state.indulgences.filter((i) => i.productId !== productId),
    }));
    try {
      await indulgenceApi.remove(productId);
    } catch {
      const resp = await indulgenceApi.getAll();
      set({ indulgences: resp.data as IndulgenceProduct[] });
    }
  },

  updateGoal: async (goal) => {
    set({ goal });
    try {
      await authApi.updateProfile({ goal });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ошибка обновления';
      set({ error: msg });
    }
  },

  updateBudget: async (budgetRub) => {
    set({ weeklyBudgetRub: budgetRub });
    try {
      await authApi.updateProfile({ weeklyBudgetRub: budgetRub });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ошибка обновления';
      set({ error: msg });
    }
  },

  updateStores: async (stores) => {
    set({ stores });
    try {
      await authApi.updateProfile({ stores });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ошибка обновления';
      set({ error: msg });
    }
  },

  updateMacroTargets: async (proteinG, caloriesKcal) => {
    set({ proteinTargetG: proteinG, calorieTargetKcal: caloriesKcal });
    try {
      await authApi.updateProfile({ proteinTargetG: proteinG, calorieTargetKcal: caloriesKcal });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ошибка обновления';
      set({ error: msg });
    }
  },

  clearError: () => set({ error: null }),
}));
