import GlassCard from './GlassCard';
import GlassButton from './GlassButton';
import NutriScoreBadge from './NutriScoreBadge';
import { cn } from './ui/utils';
import type { NutriScoreGrade, NovaGroup, SwapReason } from '@/design-system/tokens';

interface SwapCandidate {
  id: string;
  name: string;
  brandName: string;
  priceRub: number;
  pricePerProteinG?: number;
  nutriScoreGrade: NutriScoreGrade;
  novaGroup: NovaGroup;
  compositeScore: number;
  reason: SwapReason;
}

interface SwapCardProps {
  candidate: SwapCandidate;
  rank: 1 | 2 | 3;
  onSwap: (candidateId: string) => void;
  className?: string;
}

const REASON_LABELS: Record<SwapReason, { label: string; color: string }> = {
  better_nutriscore: { label: 'Лучше Nutri-Score', color: 'var(--nutriscore-a)' },
  better_price: { label: 'Выгоднее', color: 'var(--color-accent-orange)' },
  best_overall: { label: 'Лучший выбор', color: 'var(--color-accent-green)' },
};

const RANK_COLORS: Record<1 | 2 | 3, string> = {
  1: 'var(--color-accent-green)',
  2: 'var(--nutriscore-b)',
  3: 'var(--color-accent-orange)',
};

function formatRub(value: number): string {
  return `${Math.round(value)} ₽`;
}

export default function SwapCard({ candidate, rank, onSwap, className }: SwapCardProps) {
  const reason = REASON_LABELS[candidate.reason];
  const rankColor = RANK_COLORS[rank];

  return (
    <GlassCard padding="md" className={cn('animate-fade-in', className)}>
      <div className="flex items-start gap-3">
        <div
          className="shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ background: rankColor }}
          aria-label={`Позиция ${rank}`}
        >
          {rank}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold text-[var(--ContrastColor)] truncate"
            style={{ fontFamily: 'Golos Text, sans-serif' }}
          >
            {candidate.name}
          </p>
          <p
            className="text-xs text-[var(--ContrastColor)] opacity-60 mt-0.5"
            style={{ fontFamily: 'Golos Text, sans-serif' }}
          >
            {candidate.brandName}
          </p>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <NutriScoreBadge grade={candidate.nutriScoreGrade} size="sm" />
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
              style={{
                color: reason.color,
                background: `${reason.color}18`,
                fontFamily: 'Golos Text, sans-serif',
              }}
            >
              {reason.label}
            </span>
            <span
              className="text-[10px] font-medium text-[var(--ContrastColor)] opacity-50"
              style={{ fontFamily: 'Golos Text, sans-serif' }}
            >
              Score: {candidate.compositeScore.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <p
            className="text-base font-bold text-[var(--ContrastColor)]"
            style={{ fontFamily: 'Golos Text, sans-serif' }}
          >
            {formatRub(candidate.priceRub)}
          </p>
          {candidate.pricePerProteinG !== undefined && (
            <p
              className="text-[10px] font-medium"
              style={{ color: 'var(--color-accent-green)', fontFamily: 'Golos Text, sans-serif' }}
            >
              {candidate.pricePerProteinG.toFixed(1)} ₽/г
            </p>
          )}
          <GlassButton
            variant="green"
            size="sm"
            onClick={() => onSwap(candidate.id)}
            aria-label={`Заменить на ${candidate.name}`}
          >
            Заменить
          </GlassButton>
        </div>
      </div>
    </GlassCard>
  );
}

export type { SwapCandidate };
