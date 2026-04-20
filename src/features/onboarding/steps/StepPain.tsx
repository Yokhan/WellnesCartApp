import type { JSX } from 'preact';
import { Col, H2, P, Pill } from '../../../shared/ui';
import { space } from '../../../shared/ui/tokens';
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
    <Col gap={space.gap.wide}>
      <div>
        <H2>Что мешает есть правильно?</H2>
        <P style={{ marginTop: 6 }}>
          Выбери одно или несколько — подстроим список под твою боль.
        </P>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.gap.tight }}>
        {POINTS.map((p) => (
          <Pill key={p} active={selected.includes(p)} onClick={() => togglePainPoint(p)}>
            {p}
          </Pill>
        ))}
      </div>
    </Col>
  );
}
