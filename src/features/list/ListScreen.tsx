import type { JSX } from 'preact';
import { useEffect } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import { Button, Disclaimer } from '../../shared/ui';
import { formatRub } from '../../shared/format';
import {
  activeListSignal, userProfileSignal, persistList,
} from '../../shared/state';
import { api } from '../../data';
import { groupByCategory, countChecked } from './list.service';
import { ListItemRow } from './ListItemRow';
import { SwapOfWeekBlock } from './SwapOfWeekBlock';

export function ListScreen(): JSX.Element {
  const [, navigate] = useLocation();
  const list = activeListSignal.value;
  const profile = userProfileSignal.value;

  useEffect(() => {
    if (!profile) navigate('/onboarding/pain');
  }, [profile, navigate]);

  if (!list || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-muted">Загружаем список…</div>
      </div>
    );
  }

  const sections = groupByCategory(list);
  const { done, total } = countChecked(list);

  const regenerate = async () => {
    const next = await api.regenerateList(profile);
    activeListSignal.value = next;
    persistList(next);
  };

  return (
    <div className="min-h-screen bg-bg pb-20">
      <div className="max-w-xl mx-auto px-4 pt-6">
        <header className="flex items-start justify-between mb-4">
          <div>
            <div className="text-xs text-text-muted uppercase tracking-wide">Список покупок</div>
            <h1 className="text-2xl font-bold">{list.period}</h1>
          </div>
          <span className="text-accent font-bold text-sm tracking-widest">BUFF EAT</span>
        </header>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-surface rounded-md p-3 border border-border">
            <div className="text-xs text-text-muted">Итого</div>
            <div className="font-bold text-lg">{formatRub(list.total_estimated_rub)}</div>
          </div>
          <div className="bg-surface rounded-md p-3 border border-border">
            <div className="text-xs text-text-muted">Белок/день</div>
            <div className="font-bold text-lg">{list.total_daily_protein_g} г</div>
          </div>
          <div className="bg-surface rounded-md p-3 border border-border">
            <div className="text-xs text-text-muted">Отмечено</div>
            <div className="font-bold text-lg">{done}/{total}</div>
          </div>
        </div>

        {list.swaps_of_week.length > 0 && (
          <div className="mb-4">
            <SwapOfWeekBlock list={list} />
          </div>
        )}

        <div className="space-y-5">
          {sections.map((s) => (
            <section key={s.category}>
              <h2 className="text-xs uppercase tracking-wide text-text-muted mb-2 px-1">{s.label}</h2>
              <div className="space-y-2">
                {s.items.map((it) => (
                  <ListItemRow key={it.id} item={it} list={list} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-6 mb-4">
          <Button variant="secondary" fullWidth onClick={regenerate}>
            Пересобрать список
          </Button>
        </div>

        <Disclaimer>
          Цены обновлены в базе прототипа (Q1 2026). Расчёты ₽/г белка — арифметика, не медицинская рекомендация.
        </Disclaimer>
      </div>
    </div>
  );
}
