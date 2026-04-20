import type { JSX } from 'preact';
import { Col, Card, H2, P, Label, Pill } from '../../../shared/ui';
import { C, ff, space } from '../../../shared/ui/tokens';
import { onboardingDraftSignal } from '../../../shared/state';
import { setHabit } from '../onboarding.service';

const BREAKFAST = ['Овсянка', 'Яйца', 'Творог', 'Бутерброд', 'Ничего / кофе'];
const SANDWICH = ['Колбаса', 'Сыр', 'Ветчина', 'Тунец', 'Курица варёная', 'Не ем'];
const DINNER = ['Курица+рис', 'Рыба+овощи', 'Макароны', 'Заказ в доставке', 'Как получится'];

interface Slot {
  key: keyof typeof onboardingDraftSignal.value.habits;
  title: string;
  options: string[];
}

const SLOTS: Slot[] = [
  { key: 'breakfast', title: 'Завтрак обычно', options: BREAKFAST },
  { key: 'sandwich', title: 'На бутерброд обычно кладёшь', options: SANDWICH },
  { key: 'dinner', title: 'Ужин чаще всего', options: DINNER },
];

export function StepHabits(): JSX.Element {
  const habits = onboardingDraftSignal.value.habits;
  return (
    <Col gap={space.gap.wide}>
      <div>
        <H2>Что ты обычно ешь?</H2>
        <P style={{ marginTop: 6 }}>
          Без оценки. Мы не отбираем любимое — наращиваем белок вокруг.
        </P>
      </div>
      {SLOTS.map((slot) => (
        <Card key={slot.key}>
          <Label style={{ marginBottom: space.gap.tight }}>{slot.title}</Label>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: space.gap.tight,
            marginTop: space.gap.tight,
          }}>
            {slot.options.map((o) => (
              <Pill
                key={o}
                active={habits[slot.key] === o}
                onClick={() => setHabit(slot.key, o)}
              >
                {o}
              </Pill>
            ))}
          </div>
        </Card>
      ))}
    </Col>
  );
}
