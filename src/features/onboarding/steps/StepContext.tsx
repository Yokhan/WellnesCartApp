import type { JSX } from 'preact';
import { Col, Card, H2, P, Label, Pill, Chip } from '../../../shared/ui';
import { C, ff, space } from '../../../shared/ui/tokens';
import { formatRub } from '../../../shared/format';
import type { Goal } from '../../../shared/types';
import { onboardingDraftSignal } from '../../../shared/state';
import { patchDraft, toggleStore } from '../onboarding.service';

const GOALS: { id: Goal; label: string; hint: string }[] = [
  { id: 'bulk', label: 'Набор массы', hint: '+белок, +калории' },
  { id: 'cut', label: 'Сушка', hint: '+белок, −калории' },
  { id: 'maintain', label: 'Поддержание', hint: 'баланс' },
  { id: 'health', label: 'Здоровье', hint: 'качество важнее всего' },
];

const STORES = ['Пятёрочка', 'Перекрёсток', 'ВкусВилл', 'Лента', 'Магнит'];

export function StepContext(): JSX.Element {
  const draft = onboardingDraftSignal.value;
  return (
    <Col gap={space.gap.wide}>
      <div>
        <H2>Цель и условия</H2>
        <P style={{ marginTop: 6 }}>Под это соберём корзину.</P>
      </div>

      <Card>
        <Label style={{ marginBottom: space.gap.tight }}>Цель</Label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: space.gap.tight,
          marginTop: space.gap.tight,
        }}>
          {GOALS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => patchDraft({ goal: g.id })}
              style={{
                textAlign: 'left',
                borderRadius: space.radius.lg,
                padding: 14,
                border: draft.goal === g.id
                  ? `1.5px solid ${C.accent}`
                  : `1px solid ${C.bdr}`,
                background: draft.goal === g.id ? C.accentBg : C.card,
                color: draft.goal === g.id ? C.accent : C.text,
                cursor: 'pointer',
                transition: 'all .2s',
              }}
            >
              <div style={{
                fontFamily: ff.sans,
                fontWeight: 600,
                fontSize: 14.5,
              }}>
                {g.label}
              </div>
              <div style={{
                fontSize: 12,
                color: draft.goal === g.id ? C.accent : C.muted,
                marginTop: 2,
              }}>
                {g.hint}
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: space.gap.tight,
        }}>
          <Label>Бюджет на неделю</Label>
          <span style={{
            fontFamily: ff.serif,
            fontWeight: 600,
            fontSize: 17,
            color: C.text,
          }}>
            {formatRub(draft.weekly_budget_rub)}
          </span>
        </div>
        <input
          type="range"
          min="1500"
          max="10000"
          step="100"
          value={draft.weekly_budget_rub}
          onInput={(e) => patchDraft({ weekly_budget_rub: Number((e.currentTarget as HTMLInputElement).value) })}
          style={{ width: '100%', accentColor: C.accent }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 12,
          color: C.muted,
          marginTop: 4,
        }}>
          <span>1 500 ₽</span><span>10 000 ₽</span>
        </div>
      </Card>

      <Card>
        <Label style={{ marginBottom: space.gap.tight }}>Где чаще покупаешь</Label>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: space.gap.tight,
          marginTop: space.gap.tight,
        }}>
          {STORES.map((s) => (
            <Chip
              key={s}
              selected={draft.preferred_stores.includes(s)}
              onClick={() => toggleStore(s)}
            >
              {s}
            </Chip>
          ))}
        </div>
      </Card>
    </Col>
  );
}
