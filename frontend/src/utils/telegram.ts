/**
 * Telegram Mini App SDK helpers.
 * All access is guarded against environments where Telegram is unavailable.
 */

interface TelegramWebApp {
  ready: () => void;
  close: () => void;
  expand: () => void;
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
      language_code?: string;
    };
    hash: string;
  };
  colorScheme: 'light' | 'dark';
  themeParams: Record<string, string>;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (fn: () => void) => void;
    offClick: (fn: () => void) => void;
    isVisible: boolean;
  };
  MainButton: {
    show: () => void;
    hide: () => void;
    setText: (text: string) => void;
    onClick: (fn: () => void) => void;
    offClick: (fn: () => void) => void;
    isVisible: boolean;
    isActive: boolean;
    text: string;
    color: string;
    textColor: string;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
}

function getTelegramWebApp(): TelegramWebApp | null {
  try {
    const twa = (window as unknown as Record<string, unknown>).Telegram;
    if (twa && typeof twa === 'object' && 'WebApp' in twa) {
      return (twa as { WebApp: TelegramWebApp }).WebApp;
    }
    return null;
  } catch {
    return null;
  }
}

export const telegram = {
  /** Call once at app startup */
  ready() {
    getTelegramWebApp()?.ready();
  },

  /** Expand the Mini App to full height */
  expand() {
    getTelegramWebApp()?.expand();
  },

  /** Get raw initData string for backend verification */
  getInitData(): string {
    return getTelegramWebApp()?.initData ?? '';
  },

  /** Get the current Telegram user (if available) */
  getUser() {
    return getTelegramWebApp()?.initDataUnsafe?.user ?? null;
  },

  /** Check if running inside Telegram */
  isAvailable(): boolean {
    return getTelegramWebApp() !== null;
  },

  haptic: {
    impact(style: 'light' | 'medium' | 'heavy' = 'light') {
      getTelegramWebApp()?.HapticFeedback?.impactOccurred(style);
    },
    success() {
      getTelegramWebApp()?.HapticFeedback?.notificationOccurred('success');
    },
    error() {
      getTelegramWebApp()?.HapticFeedback?.notificationOccurred('error');
    },
    warning() {
      getTelegramWebApp()?.HapticFeedback?.notificationOccurred('warning');
    },
  },

  backButton: {
    show() {
      getTelegramWebApp()?.BackButton?.show();
    },
    hide() {
      getTelegramWebApp()?.BackButton?.hide();
    },
    onClick(fn: () => void) {
      getTelegramWebApp()?.BackButton?.onClick(fn);
    },
    offClick(fn: () => void) {
      getTelegramWebApp()?.BackButton?.offClick(fn);
    },
  },
};
