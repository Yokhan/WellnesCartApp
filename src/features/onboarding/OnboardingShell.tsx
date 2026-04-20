import type { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import { Button, Stepper } from '../../shared/ui';
import { C, ff, space } from '../../shared/ui/tokens';
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
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        maxWidth: space.maxWidth,
        width: '100%',
        margin: '0 auto',
        padding: space.pagePad,
        paddingTop: 24,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}>
          <span style={{
            fontSize: 12,
            color: C.muted,
            fontFamily: ff.sans,
          }}>
            Шаг {idx + 1} из {STEPS.length}
          </span>
          <span style={{
            color: C.accent,
            fontFamily: ff.serif,
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: 2,
          }}>
            BUFF EAT
          </span>
        </div>

        <Stepper current={idx + 1} total={STEPS.length} />

        <div style={{ flex: 1, paddingTop: space.gap.normal, paddingBottom: space.gap.wide }}>
          {step === 'pain' && <StepPain />}
          {step === 'habits' && <StepHabits />}
          {step === 'context' && <StepContext />}
          {step === 'restrictions' && <StepRestrictions />}
          {step === 'review' && <StepReview />}
        </div>

        <div style={{
          display: 'flex',
          gap: space.gap.tight,
          padding: `${space.gap.normal}px 0`,
        }}>
          {idx > 0 && (
            <Button variant="ghost" onClick={goBack} disabled={submitting}>Назад</Button>
          )}
          <div style={{ flex: 1 }} />
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
