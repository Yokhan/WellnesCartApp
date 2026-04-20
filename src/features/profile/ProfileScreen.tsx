import type { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import type { Goal, UserProfile } from '../../shared/types';
import { Button, Card, Chip, Disclaimer, Pill } from '../../shared/ui';
import { C, ff, space } from '../../shared/ui/tokens';
import { formatRub } from '../../shared/format';
import {
  userProfileSignal, persistProfile, resetAll,
} from '../../shared/state';
import { api } from '../../data';
import { SacredItemsEditor } from './SacredItemsEditor';

const GOAL_LABEL: Record<Goal, string> = {
  bulk: 'Набор массы', cut: 'Сушка', maintain: 'Поддержание', health: 'Здоровье',
};

const BUDGET_LABEL: Record<string, string> = {
  low: 'Экономный', med: 'Средний', high: 'Премиум',
};

type Tab = 'goals' | 'sacred' | 'settings';

export function ProfileScreen(): JSX.Element {
  const [, navigate] = useLocation();
  const profile = userProfileSignal.value;
  const [tab, setTab] = useState<Tab>('goals');

  if (!profile) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg }}>
        <div style={{ color: C.muted, fontFamily: ff.sans, fontSize: 14 }}>
          Нет профиля.{' '}
          <button onClick={() => navigate('/onboarding/pain')} style={{ color: C.accent, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontFamily: ff.sans }}>
            Пройти онбординг
          </button>
        </div>
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
    <div style={{ minHeight: '100vh', background: C.bg, paddingBottom: 80, fontFamily: ff.sans }}>
      <div style={{ maxWidth: space.maxWidth, margin: '0 auto', padding: space.pagePad, paddingTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h1 style={{ fontFamily: ff.serif, fontSize: 24, fontWeight: 700, color: C.text, margin: 0 }}>Профиль</h1>
          <span style={{ color: C.accent, fontWeight: 700, fontSize: 13, letterSpacing: '0.1em' }}>BUFF EAT</span>
        </div>

        {/* Tab bar using Pill */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <Pill active={tab === 'goals'} onClick={() => setTab('goals')}>Цели</Pill>
          <Pill active={tab === 'sacred'} onClick={() => setTab('sacred')}>Любимое 🔒</Pill>
          <Pill active={tab === 'settings'} onClick={() => setTab('settings')}>Настройки</Pill>
        </div>

        {tab === 'goals' && (
          <GoalsTab profile={profile} onGoal={updateGoal} onBudget={updateBudget} />
        )}
        {tab === 'sacred' && <SacredItemsEditor profile={profile} />}
        {tab === 'settings' && <SettingsTab profile={profile} onClear={clear} />}
      </div>
    </div>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Card>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>Цель</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {goals.map((g) => (
            <Pill key={g} active={profile.goal === g} onClick={() => onGoal(g)}>
              {GOAL_LABEL[g]}
            </Pill>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: C.muted }}>Бюджет / неделя</span>
          <span style={{ fontWeight: 600, color: C.text, fontFamily: ff.mono, fontSize: 14 }}>
            {formatRub(profile.weekly_budget_rub)}
          </span>
        </div>
        <input
          type="range"
          min="1500"
          max="10000"
          step="100"
          value={profile.weekly_budget_rub}
          onInput={(e) => onBudget(Number((e.currentTarget as HTMLInputElement).value))}
          style={{ width: '100%', accentColor: C.accent }}
        />
        <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>
          Текущий уровень: {BUDGET_LABEL[profile.budget_tier] ?? profile.budget_tier}
        </div>
      </Card>

      <Card>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>Прогрессия</div>
        <div style={{ fontSize: 14, color: C.text, marginBottom: 8 }}>
          Этап {profile.progression_stage} из 4
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: 6,
                borderRadius: space.radius.pill,
                background: s <= profile.progression_stage ? C.accent : C.bdr,
                transition: 'background .2s',
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>
          Свопов принято на этой неделе: {profile.swaps_accepted_week}
        </div>
        <p style={{ fontSize: 12, color: C.mid, marginTop: 6, lineHeight: 1.5 }}>
          Принимай замены — система учится и предлагает точнее.
        </p>
      </Card>
    </div>
  );
}

function SettingsTab(props: { profile: UserProfile; onClear: () => void }): JSX.Element {
  const { profile, onClear } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Card>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>Магазины</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {profile.preferred_stores.map((s) => (<Chip key={s}>{s}</Chip>))}
        </div>
      </Card>
      <Card>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>Аллергены</div>
        {profile.allergens.length === 0 ? (
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Не указаны.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
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
