import type { JSX } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import {
  Col, Grid, Card, H3, Label, Metric, Callout, Button, Disclaimer,
} from '../../shared/ui';
import { C, ff, space } from '../../shared/ui/tokens';
import { formatRub } from '../../shared/format';
import {
  activeListSignal, userProfileSignal, persistList,
} from '../../shared/state';
import { api } from '../../data';
import { groupByCategory, countChecked } from './list.service';
import { ListItemRow } from './ListItemRow';
import { SwapOfWeekBlock } from './SwapOfWeekBlock';

const WELCOME_KEY = 'buffeat_welcome_dismissed';

export function ListScreen(): JSX.Element {
  const [, navigate] = useLocation();
  const list = activeListSignal.value;
  const profile = userProfileSignal.value;
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!profile) navigate('/onboarding/pain');
  }, [profile, navigate]);

  useEffect(() => {
    if (profile && profile.swaps_accepted_week === 0) {
      const dismissed = localStorage.getItem(WELCOME_KEY);
      if (!dismissed) setShowWelcome(true);
    }
  }, [profile]);

  if (!list || !profile) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ color: C.muted, fontSize: 14 }}>Загружаем список...</span>
      </div>
    );
  }

  const sections = groupByCategory(list);
  const { done, total } = countChecked(list);

  const dismissWelcome = () => {
    localStorage.setItem(WELCOME_KEY, '1');
    setShowWelcome(false);
  };

  const regenerate = async () => {
    const next = await api.regenerateList(profile);
    activeListSignal.value = next;
    persistList(next);
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, paddingBottom: 80 }}>
      <div style={{
        maxWidth: space.maxWidth, margin: '0 auto',
        padding: space.pagePad, paddingTop: 24,
      }}>
        <Col gap={space.gap.wide}>
          {/* Header */}
          <header style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          }}>
            <div>
              <Label>Список покупок</Label>
              <h1 style={{
                fontFamily: ff.serif, fontSize: 26, fontWeight: 700,
                color: C.text, margin: '4px 0 0', lineHeight: 1.2,
              }}>
                {list.period}
              </h1>
            </div>
            <span style={{
              fontFamily: ff.serif, fontSize: 13, fontWeight: 700,
              color: C.accent, letterSpacing: 2.5, marginTop: 4,
            }}>
              BUFF EAT
            </span>
          </header>

          {/* Welcome card */}
          {showWelcome && (
            <Callout color={C.blue}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontWeight: 600 }}>
                  Ваш список собран на основе цели ({profile.goal}), бюджета и привычек.
                </span>
                <span>
                  Свайп влево — удалить товар. Нажмите на строку — подробности.
                  Каждую неделю предлагаем замены для мягкого улучшения рациона.
                </span>
                <Button variant="ghost" size="sm" onClick={dismissWelcome}>
                  Понятно
                </Button>
              </div>
            </Callout>
          )}

          {/* Stats row */}
          <Grid min={160} gap={space.gap.base}>
            <Metric
              label="Итого"
              value={formatRub(list.total_estimated_rub)}
              color={C.accent}
            />
            <Metric
              label="Белок / день"
              value={`${list.total_daily_protein_g} г`}
              color={C.green}
            />
            <Metric
              label="Отмечено"
              value={`${done}/${total}`}
              sub={done === total ? 'Готово!' : undefined}
              color={C.blue}
            />
          </Grid>

          {/* Swap of week */}
          {list.swaps_of_week.length > 0 && (
            <SwapOfWeekBlock list={list} />
          )}

          {/* Items grouped by category */}
          <Col gap={space.gap.wide}>
            {sections.map((s) => (
              <section key={s.category}>
                <H3 style={{ marginBottom: space.gap.tight, paddingLeft: 2 }}>
                  {s.label}
                </H3>
                <Col gap={space.gap.tight}>
                  {s.items.map((it) => (
                    <ListItemRow key={it.id} item={it} list={list} />
                  ))}
                </Col>
              </section>
            ))}
          </Col>

          {/* Actions */}
          <div style={{ marginTop: space.gap.base }}>
            <Button variant="secondary" fullWidth onClick={regenerate}>
              Пересобрать список
            </Button>
          </div>

          <Disclaimer>
            Цены обновлены в базе прототипа (Q1 2026). Расчёты ₽/г белка — арифметика, не медицинская рекомендация.
          </Disclaimer>
        </Col>
      </div>
    </div>
  );
}
