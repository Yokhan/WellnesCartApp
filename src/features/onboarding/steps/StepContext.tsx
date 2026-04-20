import type { JSX } from 'preact';
import { Card, Chip } from '../../../shared/ui';
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Цель и условия</h1>
        <p className="text-text-muted text-sm mt-1">Под это соберём корзину.</p>
      </div>

      <Card>
        <div className="text-sm text-text-muted mb-2">Цель</div>
        <div className="grid grid-cols-2 gap-2">
          {GOALS.map((g) => (
            <button
              key={g.id}
              onClick={() => patchDraft({ goal: g.id })}
              className={`text-left rounded-md p-3 border transition-colors ${
                draft.goal === g.id
                  ? 'bg-accent/15 border-accent text-accent'
                  : 'bg-surface-alt border-border text-text'
              }`}
            >
              <div className="font-semibold">{g.label}</div>
              <div className="text-xs text-text-muted">{g.hint}</div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-muted">Бюджет на неделю</span>
          <span className="font-semibold">{formatRub(draft.weekly_budget_rub)}</span>
        </div>
        <input
          type="range"
          min="1500"
          max="10000"
          step="100"
          value={draft.weekly_budget_rub}
          onInput={(e) => patchDraft({ weekly_budget_rub: Number((e.currentTarget as HTMLInputElement).value) })}
          className="w-full accent-accent"
        />
        <div className="flex justify-between text-xs text-text-muted mt-1">
          <span>1 500 ₽</span><span>10 000 ₽</span>
        </div>
      </Card>

      <Card>
        <div className="text-sm text-text-muted mb-2">Где чаще покупаешь</div>
        <div className="flex flex-wrap gap-2">
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
    </div>
  );
}
