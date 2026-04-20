import type { JSX } from 'preact';
import { Col, Card, H2, P, Label, Chip, Disclaimer } from '../../../shared/ui';
import { C, ff, space } from '../../../shared/ui/tokens';
import { onboardingDraftSignal } from '../../../shared/state';
import { toggleAllergen } from '../onboarding.service';

const ALLERGENS = ['Молочное', 'Глютен', 'Орехи', 'Яйца', 'Рыба', 'Соя'];

export function StepRestrictions(): JSX.Element {
  const selected = onboardingDraftSignal.value.allergens;
  return (
    <Col gap={space.gap.wide}>
      <div>
        <H2>Ограничения</H2>
        <P style={{ marginTop: 6 }}>
          Аллергены или продукты, которых не ешь. Можно пропустить.
        </P>
      </div>

      <Card>
        <Label style={{ marginBottom: space.gap.tight }}>Аллергены / не ем</Label>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: space.gap.tight,
          marginTop: space.gap.tight,
        }}>
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
    </Col>
  );
}
