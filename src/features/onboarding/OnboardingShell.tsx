import type { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import { Button, Stepper } from '../../shared/ui';
import {
  userProfileSignal, activeListSignal, onboardingDraftSignal,
  persistProfile, persistList, emptyDraft,
} from '../../shared/state';
import { api } from '../../data';
import {
  STEPS, stepIndex, stepAt, canAdvance, type StepId,
} from './onboarding.service';
import { StepPain } from './steps/StepPain';
import { StepHabits } from './steps/StepHabits';
import { StepContext } from './steps/StepContext';
import { StepRestrictions } from './steps/StepRestrictions';
import { StepReview } from './steps/StepReview';

interface Props {
  step: StepId;
}

export function OnboardingShell({ step }: Props): JSX.Element {
  const [, navigate] = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const draft = onboardingDraftSignal.value;
  const idx = stepIndex(step);

  const goNext = async () => {
    const nextStep = stepAt(idx + 1);
    if (nextStep) {
      navigate(`/onboarding/${nextStep}`);
      return;
    }
    setSubmitting(true);
    try {
      const { profile, list } = await api.submitOnboarding(draft);
      userProfileSignal.value = profile;
      activeListSignal.value = list;
      persistProfile(profile);
      persistList(list);
      onboardingDraftSignal.value = emptyDraft();
      navigate('/list');
    } catch (e) {
      console.error('onboarding failed', e);
      setSubmitting(false);
    }
  };

  const goBack = () => {
    const prev = stepAt(idx - 1);
    if (prev) navigate(`/onboarding/${prev}`);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <div className="max-w-xl w-full mx-auto px-5 pt-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-muted">Шаг {idx + 1} из {STEPS.length}</span>
          <span className="text-accent font-bold text-sm tracking-widest">BUFF EAT</span>
        </div>
        <Stepper current={idx + 1} total={STEPS.length} />

        <div className="flex-1 pt-4 pb-6">
          {step === 'pain' && <StepPain />}
          {step === 'habits' && <StepHabits />}
          {step === 'context' && <StepContext />}
          {step === 'restrictions' && <StepRestrictions />}
          {step === 'review' && <StepReview />}
        </div>

        <div className="flex gap-2 py-4">
          {idx > 0 && (
            <Button variant="ghost" onClick={goBack} disabled={submitting}>Назад</Button>
          )}
          <div className="flex-1" />
          <Button
            onClick={goNext}
            disabled={!canAdvance(step, draft) || submitting}
            size="lg"
          >
            {step === 'review' ? (submitting ? 'Собираем…' : 'Собрать список') : 'Дальше'}
          </Button>
        </div>
      </div>
    </div>
  );
}
