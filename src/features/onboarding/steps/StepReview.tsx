import type { JSX } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Card, Disclaimer, EvidenceTag } from '../../../shared/ui';
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Готово к сборке</h1>
        <p className="text-text-muted text-sm mt-1">Подобрали стартовую корзину. На следующей неделе подстроим под твои покупки.</p>
      </div>

      {basket && (
        <Card>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs text-text-muted uppercase tracking-wide">Стартовая корзина</div>
              <h2 className="text-xl font-bold mt-0.5">{basket.name}</h2>
            </div>
            <EvidenceTag level="SR/MA" />
          </div>
          <p className="text-sm text-text-muted mb-4">{basket.description}</p>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-surface-alt rounded-md py-2">
              <div className="text-xs text-text-muted">Бюджет/нед</div>
              <div className="font-semibold text-sm">{formatRub(basket.weekly_budget_rub)}</div>
            </div>
            <div className="bg-surface-alt rounded-md py-2">
              <div className="text-xs text-text-muted">Белок/день</div>
              <div className="font-semibold text-sm">{basket.daily_protein_g} г</div>
            </div>
            <div className="bg-surface-alt rounded-md py-2">
              <div className="text-xs text-text-muted">Калории/день</div>
              <div className="font-semibold text-sm">{basket.daily_calories_kcal}</div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1">
            {basket.items.slice(0, 8).map((i) => (
              <span key={i.universal_product_id} className="text-lg">{i.image_emoji}</span>
            ))}
            {basket.items.length > 8 && (
              <span className="text-xs text-text-muted self-center ml-1">+{basket.items.length - 8}</span>
            )}
          </div>
        </Card>
      )}

      <Disclaimer>
        NutriScore — международная система оценки продуктов питания. В России без официального статуса. Используется как ориентир. Расчёты — не медицинская рекомендация.
      </Disclaimer>
    </div>
  );
}
