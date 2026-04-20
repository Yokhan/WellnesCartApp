import type { JSX } from 'preact';
import { Chip } from '../../../shared/ui';
import { onboardingDraftSignal } from '../../../shared/state';
import { togglePainPoint } from '../onboarding.service';

const POINTS = [
  'Не знаю что покупать',
  'Ем одно и то же',
  'Мало белка',
  'Слишком дорого',
  'Не хватает времени готовить',
  'Нет плана на неделю',
  'Срываюсь на мусор вечером',
];

export function StepPain(): JSX.Element {
  const selected = onboardingDraftSignal.value.pain_points;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Что мешает есть правильно?</h1>
        <p className="text-text-muted text-sm mt-1">Выбери одно или несколько — подстроим список под твою боль.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {POINTS.map((p) => (
          <Chip key={p} selected={selected.includes(p)} onClick={() => togglePainPoint(p)}>
            {p}
          </Chip>
        ))}
      </div>
    </div>
  );
}
