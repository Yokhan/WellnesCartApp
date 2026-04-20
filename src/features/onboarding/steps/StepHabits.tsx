import type { JSX } from 'preact';
import { Card, Chip } from '../../../shared/ui';
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Что ты обычно ешь?</h1>
        <p className="text-text-muted text-sm mt-1">Без оценки. Мы не отбираем любимое — наращиваем белок вокруг.</p>
      </div>
      {SLOTS.map((slot) => (
        <Card key={slot.key}>
          <div className="text-sm text-text-muted mb-2">{slot.title}</div>
          <div className="flex flex-wrap gap-2">
            {slot.options.map((o) => (
              <Chip
                key={o}
                selected={habits[slot.key] === o}
                onClick={() => setHabit(slot.key, o)}
              >
                {o}
              </Chip>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
