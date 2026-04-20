import type { OnboardingDraft } from '../../shared/state';
import { onboardingDraftSignal } from '../../shared/state';

export type StepId = 'pain' | 'habits' | 'context' | 'restrictions' | 'review';

export const STEPS: readonly StepId[] = ['pain', 'habits', 'context', 'restrictions', 'review'];

export function stepIndex(step: StepId): number {
  return STEPS.indexOf(step);
}

export function stepAt(idx: number): StepId | null {
  return STEPS[idx] ?? null;
}

export function patchDraft(patch: Partial<OnboardingDraft>): void {
  const current = onboardingDraftSignal.value;
  onboardingDraftSignal.value = { ...current, ...patch };
}

export function togglePainPoint(point: string): void {
  const current = onboardingDraftSignal.value;
  const next = current.pain_points.includes(point)
    ? current.pain_points.filter((p) => p !== point)
    : [...current.pain_points, point];
  onboardingDraftSignal.value = { ...current, pain_points: next };
}

export function toggleStore(store: string): void {
  const current = onboardingDraftSignal.value;
  const next = current.preferred_stores.includes(store)
    ? current.preferred_stores.filter((s) => s !== store)
    : [...current.preferred_stores, store];
  onboardingDraftSignal.value = { ...current, preferred_stores: next };
}

export function toggleAllergen(a: string): void {
  const current = onboardingDraftSignal.value;
  const next = current.allergens.includes(a)
    ? current.allergens.filter((s) => s !== a)
    : [...current.allergens, a];
  onboardingDraftSignal.value = { ...current, allergens: next };
}

export function setHabit(slot: keyof OnboardingDraft['habits'], value: string): void {
  const current = onboardingDraftSignal.value;
  onboardingDraftSignal.value = {
    ...current,
    habits: { ...current.habits, [slot]: value },
  };
}

export function canAdvance(step: StepId, draft: OnboardingDraft): boolean {
  switch (step) {
    case 'pain': return draft.pain_points.length > 0;
    case 'habits': return draft.habits.breakfast !== null && draft.habits.sandwich !== null;
    case 'context': return draft.goal !== null && draft.preferred_stores.length > 0;
    case 'restrictions': return true;
    case 'review': return true;
  }
}
