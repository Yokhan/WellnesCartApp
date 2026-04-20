import type { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import type { Goal, UserProfile } from '../../shared/types';
import { Button, Card, Chip, Disclaimer } from '../../shared/ui';
import { formatRub } from '../../shared/format';
import {
  userProfileSignal, persistProfile, resetAll,
} from '../../shared/state';
import { api } from '../../data';
import { SacredItemsEditor } from './SacredItemsEditor';

const GOAL_LABEL: Record<Goal, string> = {
  bulk: 'Набор массы', cut: 'Сушка', maintain: 'Поддержание', health: 'Здоровье',
};

type Tab = 'goals' | 'sacred' | 'data';

export function ProfileScreen(): JSX.Element {
  const [, navigate] = useLocation();
  const profile = userProfileSignal.value;
  const [tab, setTab] = useState<Tab>('goals');

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-muted">Нет профиля. <button onClick={() => navigate('/onboarding/pain')} className="text-accent underline">Пройти онбординг</button></div>
      </div>
    );
  }

  const updateBudget = async (rub: number) => {
    const next = await api.updateProfile(profile, { weekly_budget_rub: rub });
    userProfileSignal.value = next;
    persistProfile(next);
  };

  const updateGoal = async (goal: Goal) => {
    const next = await api.updateProfile(profile, { goal });
    userProfileSignal.value = next;
    persistProfile(next);
  };

  const clear = () => {
    if (!confirm('Удалить профиль и список? Вернёшься на онбординг.')) return;
    resetAll();
    navigate('/onboarding/pain');
  };

  return (
    <div className="min-h-screen bg-bg pb-20">
      <div className="max-w-xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Профиль</h1>
          <span className="text-accent font-bold text-sm tracking-widest">BUFF EAT</span>
        </div>

        <div className="flex gap-1 bg-surface p-1 rounded-md mb-4 border border-border">
          <TabBtn active={tab === 'goals'} onClick={() => setTab('goals')}>Цели</TabBtn>
          <TabBtn active={tab === 'sacred'} onClick={() => setTab('sacred')}>Не трогать</TabBtn>
          <TabBtn active={tab === 'data'} onClick={() => setTab('data')}>Данные</TabBtn>
        </div>

        {tab === 'goals' && (
          <GoalsTab profile={profile} onGoal={updateGoal} onBudget={updateBudget} />
        )}
        {tab === 'sacred' && <SacredItemsEditor profile={profile} />}
        {tab === 'data' && <DataTab profile={profile} onClear={clear} />}
      </div>
    </div>
  );
}

function TabBtn(props: { active: boolean; onClick: () => void; children: JSX.Element | string }): JSX.Element {
  return (
    <button
      onClick={props.onClick}
      className={`flex-1 py-2 rounded-md text-sm transition-colors ${
        props.active ? 'bg-accent/15 text-accent' : 'text-text-muted hover:text-text'
      }`}
    >
      {props.children}
    </button>
  );
}

function GoalsTab(props: {
  profile: UserProfile;
  onGoal: (g: Goal) => void;
  onBudget: (n: number) => void;
}): JSX.Element {
  const { profile, onGoal, onBudget } = props;
  const goals: Goal[] = ['bulk', 'cut', 'maintain', 'health'];
  return (
    <div className="space-y-3">
      <Card>
        <div className="text-sm text-text-muted mb-2">Цель</div>
        <div className="grid grid-cols-2 gap-2">
          {goals.map((g) => (
            <Chip key={g} selected={profile.goal === g} onClick={() => onGoal(g)}>
              {GOAL_LABEL[g]}
            </Chip>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-muted">Бюджет / неделя</span>
          <span className="font-semibold">{formatRub(profile.weekly_budget_rub)}</span>
        </div>
        <input
          type="range"
          min="1500"
          max="10000"
          step="100"
          value={profile.weekly_budget_rub}
          onInput={(e) => onBudget(Number((e.currentTarget as HTMLInputElement).value))}
          className="w-full accent-accent"
        />
        <div className="text-xs text-text-muted mt-1">Текущий уровень: {profile.budget_tier}</div>
      </Card>

      <Card>
        <div className="text-sm text-text-muted mb-1">Прогрессия</div>
        <div className="text-sm">Этап {profile.progression_stage} из 4</div>
        <div className="flex gap-1 mt-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full ${
                s <= profile.progression_stage ? 'bg-accent' : 'bg-border'
              }`}
            />
          ))}
        </div>
        <div className="text-xs text-text-muted mt-2">
          Свопов принято на этой неделе: {profile.swaps_accepted_week}
        </div>
      </Card>
    </div>
  );
}

function DataTab(props: { profile: UserProfile; onClear: () => void }): JSX.Element {
  const { profile, onClear } = props;
  return (
    <div className="space-y-3">
      <Card>
        <h3 className="text-sm text-text-muted mb-2">Магазины</h3>
        <div className="flex flex-wrap gap-1">
          {profile.preferred_stores.map((s) => (<Chip key={s}>{s}</Chip>))}
        </div>
      </Card>
      <Card>
        <h3 className="text-sm text-text-muted mb-2">Аллергены</h3>
        {profile.allergens.length === 0 ? (
          <p className="text-sm text-text-muted">Не указаны.</p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {profile.allergens.map((a) => (<Chip key={a} color="warning">{a}</Chip>))}
          </div>
        )}
      </Card>
      <Disclaimer tone="warning">
        Прототип. Все данные хранятся локально в браузере (localStorage). Никуда не отправляются.
      </Disclaimer>
      <Button variant="danger" fullWidth onClick={onClear}>Сбросить всё и заново</Button>
    </div>
  );
}
