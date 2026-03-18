/**
 * Safe localStorage wrapper.
 * Telegram Mini App sometimes restricts localStorage access.
 * All operations are wrapped in try/catch and fail silently.
 */

const STORAGE_AVAILABLE = (() => {
  try {
    const key = '__smartcart_test__';
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
})();

export const safeStorage = {
  get(key: string): string | null {
    if (!STORAGE_AVAILABLE) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  set(key: string, value: string): boolean {
    if (!STORAGE_AVAILABLE) return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },

  remove(key: string): boolean {
    if (!STORAGE_AVAILABLE) return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  getJSON<T>(key: string): T | null {
    const raw = safeStorage.get(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  setJSON(key: string, value: unknown): boolean {
    try {
      return safeStorage.set(key, JSON.stringify(value));
    } catch {
      return false;
    }
  },

  clear(): boolean {
    if (!STORAGE_AVAILABLE) return false;
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  },
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'smartcart_token',
  REFRESH_TOKEN: 'smartcart_refresh',
  USER: 'smartcart_user',
} as const;
