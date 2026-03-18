import GlassCard from './GlassCard';
import { Progress } from './ui';

interface BudgetIndicatorProps {
  spentRub: number;
  weeklyBudgetRub: number;
  className?: string;
  compact?: boolean;
}

function formatRub(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function BudgetIndicator({
  spentRub,
  weeklyBudgetRub,
  className = '',
  compact = false,
}: BudgetIndicatorProps) {
  const pct = weeklyBudgetRub > 0 ? (spentRub / weeklyBudgetRub) * 100 : 0;
  const remaining = weeklyBudgetRub - spentRub;
  const isOverBudget = remaining < 0;

  const barColor = isOverBudget
    ? 'var(--color-accent-red)'
    : pct > 80
    ? 'var(--color-accent-orange)'
    : 'var(--color-accent-green)';

  if (compact) {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <div className="flex justify-between text-xs" style={{ fontFamily: 'Golos Text, sans-serif' }}>
          <span className="text-[var(--ContrastColor)] opacity-60">Бюджет</span>
          <span
            className="font-semibold"
            style={{ color: isOverBudget ? 'var(--color-accent-red)' : 'var(--ContrastColor)' }}
          >
            {formatRub(spentRub)} / {formatRub(weeklyBudgetRub)}
          </span>
        </div>
        <Progress value={Math.min(pct, 100)} max={100} color={barColor} size="sm" />
      </div>
    );
  }

  return (
    <GlassCard padding="md" className={className}>
      <div className="flex justify-between items-baseline mb-2">
        <h2
          className="text-xs font-semibold text-[var(--ContrastColor)] opacity-60 uppercase tracking-wider"
          style={{ fontFamily: 'Golos Text, sans-serif' }}
        >
          Бюджет недели
        </h2>
        <span
          className="text-xs font-semibold"
          style={{
            color: isOverBudget ? 'var(--color-accent-red)' : 'var(--ContrastColor)',
            fontFamily: 'Golos Text, sans-serif',
          }}
        >
          {isOverBudget ? `Превышение ${formatRub(Math.abs(remaining))}` : `Остаток ${formatRub(remaining)}`}
        </span>
      </div>
      <Progress value={Math.min(pct, 100)} max={100} color={barColor} size="md" />
      <div className="flex justify-between mt-2">
        <span
          className="text-sm font-semibold text-[var(--ContrastColor)]"
          style={{ fontFamily: 'Golos Text, sans-serif' }}
        >
          {formatRub(spentRub)}
        </span>
        <span
          className="text-sm text-[var(--ContrastColor)] opacity-50"
          style={{ fontFamily: 'Golos Text, sans-serif' }}
        >
          из {formatRub(weeklyBudgetRub)}
        </span>
      </div>
    </GlassCard>
  );
}
