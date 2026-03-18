import { useState } from 'react';
import GlassCard from './GlassCard';
import GlassButton from './GlassButton';
import StoreSelector from './StoreSelector';
import { Slider } from './ui';
import { cn } from './ui/utils';
import { GOAL_OPTIONS } from '@/design-system/tokens';
import type { UserGoal } from '@/design-system/tokens';

interface OnboardingData {
  goal: UserGoal;
  weeklyBudgetRub: number;
  stores: string[];
}

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
  isLoading?: boolean;
}

const BUDGET_MIN = 1000;
const BUDGET_MAX = 15000;
const BUDGET_STEP = 500;

function formatRub(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function OnboardingWizard({ onComplete, isLoading = false }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<UserGoal>('maintain');
  const [budget, setBudget] = useState(5000);
  const [stores, setStores] = useState<string[]>(['pyaterochka']);

  const totalSteps = 4;
  const canProceed =
    step === 1
      ? Boolean(goal)
      : step === 2
      ? budget >= BUDGET_MIN
      : step === 3
      ? stores.length > 0
      : true;

  const handleNext = () => {
    if (step < totalSteps) setStep((s) => s + 1);
    else onComplete({ goal, weeklyBudgetRub: budget, stores });
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2" aria-label={`Шаг ${step} из ${totalSteps}`}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={cn(
              'rounded-full transition-all duration-300',
              i + 1 === step
                ? 'w-6 h-2 bg-[var(--color-accent-green)]'
                : i + 1 < step
                ? 'w-2 h-2 bg-[var(--color-accent-green)] opacity-60'
                : 'w-2 h-2 bg-[rgba(45,74,45,0.2)]'
            )}
          />
        ))}
      </div>

      {/* Step 1: Goal */}
      {step === 1 && (
        <div className="animate-fade-in">
          <h1
            className="text-2xl font-light text-[var(--ContrastColor)] mb-2"
            style={{ fontFamily: 'Unbounded, sans-serif' }}
          >
            Ваша цель
          </h1>
          <p className="text-sm text-[var(--ContrastColor)] opacity-60 mb-6">
            SmartCart подберёт состав корзины под вашу цель
          </p>
          <div className="flex flex-col gap-3">
            {GOAL_OPTIONS.map((opt) => (
              <GlassCard
                key={opt.id}
                padding="md"
                onClick={() => setGoal(opt.id)}
                className={cn(
                  'border-2 transition-fast',
                  goal === opt.id
                    ? 'border-[var(--color-accent-green)]'
                    : 'border-transparent'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'h-5 w-5 rounded-full border-2 transition-fast shrink-0',
                      goal === opt.id
                        ? 'border-[var(--color-accent-green)] bg-[var(--color-accent-green)]'
                        : 'border-[rgba(45,74,45,0.3)]'
                    )}
                  />
                  <div>
                    <p
                      className="text-sm font-semibold text-[var(--ContrastColor)]"
                      style={{ fontFamily: 'Golos Text, sans-serif' }}
                    >
                      {opt.label}
                    </p>
                    <p
                      className="text-xs text-[var(--ContrastColor)] opacity-60"
                      style={{ fontFamily: 'Golos Text, sans-serif' }}
                    >
                      {opt.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Budget */}
      {step === 2 && (
        <div className="animate-fade-in">
          <h1
            className="text-2xl font-light text-[var(--ContrastColor)] mb-2"
            style={{ fontFamily: 'Unbounded, sans-serif' }}
          >
            Недельный бюджет
          </h1>
          <p className="text-sm text-[var(--ContrastColor)] opacity-60 mb-6">
            Сколько вы готовы тратить на продукты в неделю?
          </p>
          <GlassCard padding="lg">
            <div className="text-center mb-6">
              <p
                className="text-4xl font-light text-[var(--ContrastColor)]"
                style={{ fontFamily: 'Unbounded, sans-serif' }}
              >
                {formatRub(budget)}
              </p>
              <p className="text-xs text-[var(--ContrastColor)] opacity-50 mt-1">в неделю</p>
            </div>
            <Slider
              min={BUDGET_MIN}
              max={BUDGET_MAX}
              step={BUDGET_STEP}
              value={budget}
              onChange={setBudget}
              aria-label="Недельный бюджет"
            />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-[var(--ContrastColor)] opacity-40">{formatRub(BUDGET_MIN)}</span>
              <span className="text-xs text-[var(--ContrastColor)] opacity-40">{formatRub(BUDGET_MAX)}</span>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Step 3: Stores */}
      {step === 3 && (
        <div className="animate-fade-in">
          <h1
            className="text-2xl font-light text-[var(--ContrastColor)] mb-2"
            style={{ fontFamily: 'Unbounded, sans-serif' }}
          >
            Магазины
          </h1>
          <p className="text-sm text-[var(--ContrastColor)] opacity-60 mb-6">
            Где вы обычно покупаете продукты?
          </p>
          <StoreSelector selected={stores} onChange={setStores} />
        </div>
      )}

      {/* Step 4: Summary */}
      {step === 4 && (
        <div className="animate-fade-in">
          <h1
            className="text-2xl font-light text-[var(--ContrastColor)] mb-2"
            style={{ fontFamily: 'Unbounded, sans-serif' }}
          >
            Всё готово!
          </h1>
          <p className="text-sm text-[var(--ContrastColor)] opacity-60 mb-6">
            SmartCart сформирует ваш первый список покупок
          </p>
          <GlassCard padding="lg" className="flex flex-col gap-4">
            <SummaryRow
              label="Цель"
              value={GOAL_OPTIONS.find((o) => o.id === goal)?.label ?? goal}
            />
            <SummaryRow label="Бюджет" value={`${formatRub(budget)} / нед.`} />
            <SummaryRow
              label="Магазины"
              value={
                stores.length > 0
                  ? stores.join(', ')
                  : 'не выбраны'
              }
            />
          </GlassCard>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-2">
        {step > 1 && (
          <GlassButton
            variant="light"
            onClick={handleBack}
            className="flex-1"
            disabled={isLoading}
          >
            Назад
          </GlassButton>
        )}
        <GlassButton
          variant="green"
          onClick={handleNext}
          className="flex-1"
          disabled={!canProceed || isLoading}
        >
          {step === totalSteps ? (isLoading ? 'Сохранение...' : 'Начать') : 'Далее'}
        </GlassButton>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-[var(--ContrastColor)] opacity-60">{label}</span>
      <span className="text-sm font-semibold text-[var(--ContrastColor)]">{value}</span>
    </div>
  );
}
