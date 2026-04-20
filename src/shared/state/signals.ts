import { signal, computed } from '@preact/signals';
import type { UserProfile, ShoppingList, Goal, BudgetTier } from '../types';

export interface OnboardingDraft {
  pain_points: string[];
  habits: {
    breakfast: string | null;
    sandwich: string | null;
    dinner: string | null;
  };
  goal: Goal | null;
  weekly_budget_rub: number;
  preferred_stores: string[];
  allergens: string[];
  excluded_ingredients: string[];
}

export function emptyDraft(): OnboardingDraft {
  return {
    pain_points: [],
    habits: { breakfast: null, sandwich: null, dinner: null },
    goal: null,
    weekly_budget_rub: 4000,
    preferred_stores: [],
    allergens: [],
    excluded_ingredients: [],
  };
}

export const userProfileSignal = signal<UserProfile | null>(null);
export const activeListSignal = signal<ShoppingList | null>(null);
export const onboardingDraftSignal = signal<OnboardingDraft>(emptyDraft());

export const isOnboarded = computed<boolean>(() => userProfileSignal.value !== null);

export const budgetTierSignal = computed<BudgetTier | null>(() => {
  const p = userProfileSignal.value;
  return p ? p.budget_tier : null;
});

const STORAGE_KEY_PROFILE = 'buffEatProfile';
const STORAGE_KEY_LIST = 'buffEatList';

export function hydrateFromStorage(): void {
  try {
    const rawProfile = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (rawProfile) {
      const parsed: unknown = JSON.parse(rawProfile);
      if (parsed && typeof parsed === 'object' && 'id' in parsed) {
        userProfileSignal.value = parsed as UserProfile;
      }
    }
    const rawList = localStorage.getItem(STORAGE_KEY_LIST);
    if (rawList) {
      const parsed: unknown = JSON.parse(rawList);
      if (parsed && typeof parsed === 'object' && 'id' in parsed) {
        activeListSignal.value = parsed as ShoppingList;
      }
    }
  } catch {
    /* ignore corrupt storage */
  }
}

export function persistProfile(p: UserProfile | null): void {
  if (p === null) {
    localStorage.removeItem(STORAGE_KEY_PROFILE);
  } else {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(p));
  }
}

export function persistList(l: ShoppingList | null): void {
  if (l === null) {
    localStorage.removeItem(STORAGE_KEY_LIST);
  } else {
    localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(l));
  }
}

export function resetAll(): void {
  userProfileSignal.value = null;
  activeListSignal.value = null;
  onboardingDraftSignal.value = emptyDraft();
  persistProfile(null);
  persistList(null);
}
