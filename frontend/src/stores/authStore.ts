import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserGoal } from '@/design-system/tokens';
import { authApi } from '@/services/api';
import { safeStorage, STORAGE_KEYS } from '@/utils/safeStorage';

interface User {
  id: string;
  telegramId: string;
  name: string;
  weeklyBudgetRub: number;
  goal: UserGoal;
  stores: string[];
  proteinTargetG: number;
  calorieTargetKcal: number;
  needsProfileSetup: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isInitializing: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  loginTelegram: (initData: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  logout: () => void;
  setInitializing: (value: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

const persistStorage = {
  getItem: (name: string) => safeStorage.get(name),
  setItem: (name: string, value: string) => { safeStorage.set(name, value); },
  removeItem: (name: string) => { safeStorage.remove(name); },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isInitializing: true,
      isAuthenticated: false,

      setInitializing: (value) => set({ isInitializing: value }),

      loginTelegram: async (initData) => {
        const resp = await authApi.loginTelegram(initData);
        const { token, refreshToken, user } = resp.data;

        safeStorage.set(STORAGE_KEYS.AUTH_TOKEN, token);
        safeStorage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

        set({
          token,
          user: user as User,
          isAuthenticated: true,
        });
      },

      updateProfile: async (data) => {
        const resp = await authApi.updateProfile(data);
        set((state) => ({
          user: state.user ? { ...state.user, ...(resp.data as User) } : null,
        }));
      },

      refreshProfile: async () => {
        const { isAuthenticated } = get();
        if (!isAuthenticated) return;

        const resp = await authApi.getProfile();
        set((state) => ({
          user: state.user ? { ...state.user, ...(resp.data as User) } : null,
        }));
      },

      logout: () => {
        safeStorage.remove(STORAGE_KEYS.AUTH_TOKEN);
        safeStorage.remove(STORAGE_KEYS.REFRESH_TOKEN);
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: STORAGE_KEYS.USER,
      storage: createJSONStorage(() => persistStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
