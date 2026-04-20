import type { JSX } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Col, Card, H2, P, Metric, Disclaimer, EvidenceTag } from '../../../shared/ui';
import { C, ff, space } from '../../../shared/ui/tokens';
import { formatRub } from '../../../shared/format';
import type { BasketTemplate, UserProfile } from '../../../shared/types';
import { deriveBudgetTier } from '../../../shared/types';
import { onboardingDraftSignal } from '../../../shared/state';
import { pickBootstrapBasket } from '../../../core/lp-solver';
import { api } from '../../../data';

export function StepReview(): JSX.Element {
  const draft = onboardingDraftSignal.value;
  const [basket, setBasket] = useState<BasketTemplate | null>(null);

  useEffect(() => {
    api.getBootstrapBaskets().then((baskets) => {
      if (!draft.goal) return;
      const preview: UserProfile = {
        id: 'preview', goal: draft.goal, weight_kg: 75, height_cm: 175, age: 30, sex: 'M',
        activity_level: 'med', weekly_budget_rub: draft.weekly_budget_rub,
        budget_tier: deriveBudgetTier(draft.weekly_budget_rub),
        preferred_stores: draft.preferred_stores, allergens: draft.allergens,
        excluded_ingredients: [], sacred_items: [], priority_nutrients: ['protein'],
        progression_stage: 1, swaps_accepted_week: 0, created_at: new Date().toISOString(),
      };
      setBasket(pickBootstrapBasket(baskets, preview));
    });
  }, [draft.goal, draft.weekly_budget_rub]);

  return (
    <Col gap={space.gap.wide}>
      <div>
        <H2>Готово к сборке</H2>
        <P style={{ marginTop: 6 }}>
          Подобрали стартовую корзину. На следующей неделе подстроим под твои покупки.
        </P>
      </div>

      {basket && (
        <Card>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: space.gap.base,
          }}>
            <div>
              <div style={{
                fontSize: 10.5,
                fontWeight: 700,
                textTransform: 'uppercase' as const,
                letterSpacing: 1.6,
                color: C.muted,
              }}>
                Стартовая корзина
              </div>
              <div style={{
                fontFamily: ff.serif,
                fontSize: 20,
                fontWeight: 700,
                color: C.text,
                marginTop: 4,
              }}>
                {basket.name}
              </div>
            </div>
            <EvidenceTag level="SR/MA" />
          </div>

          <P style={{ marginBottom: space.gap.normal }}>
            {basket.description}
          </P>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: space.gap.tight,
          }}>
            <Metric
              label="Бюджет/нед"
              value={formatRub(basket.weekly_budget_rub)}
            />
            <Metric
              label="Белок/день"
              value={`${basket.daily_protein_g} г`}
              color={C.green}
            />
            <Metric
              label="Калории/день"
              value={String(basket.daily_calories_kcal)}
              color={C.blue}
            />
          </div>

          <div style={{
            marginTop: space.gap.normal,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            alignItems: 'center',
          }}>
            {basket.items.slice(0, 8).map((i) => (
              <span key={i.universal_product_id} style={{ fontSize: 20 }}>
                {i.image_emoji}
              </span>
            ))}
            {basket.items.length > 8 && (
              <span style={{
                fontSize: 12,
                color: C.muted,
                marginLeft: 4,
              }}>
                +{basket.items.length - 8}
              </span>
            )}
          </div>
        </Card>
      )}

      <Disclaimer>
        NutriScore — международная система оценки продуктов питания. В России без официального статуса. Используется как ориентир. Расчёты — не медицинская рекомендация.
      </Disclaimer>
    </Col>
  );
}
