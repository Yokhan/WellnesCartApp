import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { safeStorage, STORAGE_KEYS } from '@/utils/safeStorage';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* Request interceptor — attach Bearer token */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = safeStorage.get(STORAGE_KEYS.AUTH_TOKEN);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* Response interceptor — handle 401 */
api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = safeStorage.get(STORAGE_KEYS.REFRESH_TOKEN);

      if (refreshToken) {
        try {
          const resp = await axios.post<{ token: string }>(`${BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          const newToken = resp.data.token;
          safeStorage.set(STORAGE_KEYS.AUTH_TOKEN, newToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return api(originalRequest);
        } catch {
          safeStorage.remove(STORAGE_KEYS.AUTH_TOKEN);
          safeStorage.remove(STORAGE_KEYS.REFRESH_TOKEN);
        }
      }
    }

    return Promise.reject(error);
  }
);

/* ── Auth ── */
interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserDto;
}

interface UserDto {
  id: string;
  telegramId: string;
  name: string;
  weeklyBudgetRub: number;
  goal: string;
  stores: string[];
  proteinTargetG: number;
  calorieTargetKcal: number;
  needsProfileSetup: boolean;
}

export const authApi = {
  loginTelegram: (initData: string) =>
    api.post<AuthResponse>('/auth/telegram', { initData }),

  refreshToken: (refreshToken: string) =>
    api.post<{ token: string }>('/auth/refresh', { refreshToken }),

  getProfile: () => api.get<UserDto>('/profile'),

  updateProfile: (data: Partial<UserDto>) => api.put<UserDto>('/profile', data),
};

/* ── Lists ── */
export interface ShoppingListDto {
  id: string;
  weekStartDate: string;
  items: ShoppingListItemDto[];
  totalCostRub: number;
  totalProteinG: number;
  totalCalories: number;
  status: 'draft' | 'active' | 'completed';
}

export interface ShoppingListItemDto {
  id: string;
  productId: string;
  productName: string;
  brandName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  nutriScoreGrade: string;
  novaGroup: number;
  proteinPer100g: number;
  pricePerProteinG: number;
  category: string;
  isIndulgence: boolean;
  isChecked: boolean;
}

export const listsApi = {
  getCurrent: () => api.get<ShoppingListDto>('/shopping-lists/current'),
  getAll: () => api.get<ShoppingListDto[]>('/shopping-lists'),
  checkItem: (listId: string, itemId: string, checked: boolean) =>
    api.patch(`/shopping-lists/${listId}/items/${itemId}`, { isChecked: checked }),
  generate: () => api.post<ShoppingListDto>('/shopping-lists'),
};

/* ── Swaps ── */
export interface SwapCandidateDto {
  id: string;
  name: string;
  brandName: string;
  priceRub: number;
  pricePerProteinG: number;
  nutriScoreGrade: string;
  novaGroup: number;
  compositeScore: number;
  reason: string;
}

export const swapsApi = {
  /** Get all swap candidates for a shopping list */
  getCandidates: (listId: string) =>
    api.get<SwapCandidateDto[]>(`/shopping-lists/${listId}/swaps`),
  /** Accept a swap: replace item with alternative */
  applySwap: (listId: string, itemId: string, newProductId: string) =>
    api.post(`/shopping-lists/${listId}/swaps`, { itemId, newProductId }),
  /** Reject a swap candidate */
  rejectSwap: (listId: string, swapId: string) =>
    api.delete(`/shopping-lists/${listId}/swaps/${swapId}`),
};

/* ── Products ── */
export const productsApi = {
  getById: (productId: string) => api.get(`/products/${productId}`),
  getAlternatives: (productId: string) => api.get(`/products/${productId}/alternatives`),
  search: (query: string, stores?: string[]) =>
    api.get('/products/search', { params: { q: query, stores: stores?.join(',') } }),
};

/* ── Indulgence ── */
export const indulgenceApi = {
  getAll: () => api.get('/indulgence'),
  add: (data: { universalProductId: string; servingG: number; dayOfWeek: number; mealContext: string }) =>
    api.post('/indulgence', data),
  remove: (id: string) => api.delete(`/indulgence/${id}`),
};

export default api;
