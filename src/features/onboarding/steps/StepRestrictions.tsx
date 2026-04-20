import type { JSX } from 'preact';
import { Card, Chip, Disclaimer } from '../../../shared/ui';
import { onboardingDraftSignal } from '../../../shared/state';
import { toggleAllergen } from '../onboarding.service';

const ALLERGENS = ['Молочное', 'Глютен', 'Орехи', 'Яйца', 'Рыба', 'Соя'];

export function StepRestrictions(): JSX.Element {
  const selected = onboardingDraftSignal.value.allergens;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ограничения</h1>
        <p className="text-text-muted text-sm mt-1">Аллергены или продукты, которых не ешь. Можно пропустить.</p>
      </div>

      <Card>
        <div className="text-sm text-text-muted mb-2">Аллергены / не ем</div>
        <div className="flex flex-wrap gap-2">
          {ALLERGENS.map((a) => (
            <Chip
              key={a}
              selected={selected.includes(a)}
              onClick={() => toggleAllergen(a)}
              color="warning"
            >
              {a}
            </Chip>
          ))}
        </div>
      </Card>

      <Disclaimer tone="info">
        Любимые продукты не запрещаем. На экране профиля добавишь «sacred items» — они останутся в списке и не предлагаются к замене.
      </Disclaimer>
    </div>
  );
}
