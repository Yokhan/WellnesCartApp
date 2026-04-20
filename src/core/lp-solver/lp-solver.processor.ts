import type { BasketTemplate, UserProfile } from '../../shared/types';

export interface BasketScoreBreakdown {
  template_id: string;
  goal_match: number;
  budget_fit: number;
  store_overlap: number;
  total: number;
}

function budgetFitScore(target: number, actual: number): number {
  const diff = Math.abs(target - actual);
  const ratio = diff / Math.max(target, 1);
  if (ratio <= 0.10) return 3;
  if (ratio <= 0.25) return 2;
  if (ratio <= 0.50) return 1;
  return 0;
}

export function scoreBasket(
  template: BasketTemplate,
  profile: UserProfile,
): BasketScoreBreakdown {
  const goal_match = template.goal === profile.goal ? 3 : 0;
  const budget_fit = budgetFitScore(profile.weekly_budget_rub, template.weekly_budget_rub);
  const store_overlap = 1;
  return {
    template_id: template.id,
    goal_match,
    budget_fit,
    store_overlap,
    total: goal_match + budget_fit + store_overlap,
  };
}

export function pickBootstrapBasket(
  templates: BasketTemplate[],
  profile: UserProfile,
): BasketTemplate {
  if (templates.length === 0) {
    throw new Error('No basket templates available');
  }
  const scored = templates.map((t) => ({
    template: t,
    score: scoreBasket(t, profile),
  }));
  scored.sort((a, b) => {
    if (b.score.total !== a.score.total) return b.score.total - a.score.total;
    const diffA = Math.abs(profile.weekly_budget_rub - a.template.weekly_budget_rub);
    const diffB = Math.abs(profile.weekly_budget_rub - b.template.weekly_budget_rub);
    return diffA - diffB;
  });
  const winner = scored[0];
  if (!winner) throw new Error('No basket templates available');
  return winner.template;
}
