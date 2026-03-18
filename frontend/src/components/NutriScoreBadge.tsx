import { cn } from './ui/utils';
import type { NutriScoreGrade } from '@/design-system/tokens';
import { NUTRISCORE_COLORS, NUTRISCORE_TEXT_COLOR } from '@/design-system/tokens';

interface NutriScoreBadgeProps {
  grade: NutriScoreGrade;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-5 min-w-[20px] px-1 text-[10px] font-bold rounded-[4px]',
  md: 'h-7 min-w-[28px] px-1.5 text-sm font-bold rounded-[6px]',
  lg: 'h-9 min-w-[36px] px-2 text-base font-bold rounded-[8px]',
};

export default function NutriScoreBadge({
  grade,
  size = 'md',
  showLabel = false,
  className,
}: NutriScoreBadgeProps) {
  const bg = NUTRISCORE_COLORS[grade];
  const textColor = NUTRISCORE_TEXT_COLOR[grade];

  if (showLabel) {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        <span
          className="text-[9px] font-medium text-[var(--ContrastColor)] opacity-50"
          style={{ fontFamily: 'Golos Text, sans-serif' }}
        >
          Nutri-Score
        </span>
        <span
          className={cn(
            'inline-flex items-center justify-center font-bold',
            sizeClasses[size]
          )}
          style={{
            backgroundColor: bg,
            color: textColor === 'white' ? '#ffffff' : '#1a1a1a',
            fontFamily: 'Golos Text, sans-serif',
          }}
          aria-label={`Nutri-Score ${grade}`}
          title={`Nutri-Score ${grade}`}
        >
          {grade}
        </span>
      </div>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-bold',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: bg,
        color: textColor === 'white' ? '#ffffff' : '#1a1a1a',
        fontFamily: 'Golos Text, sans-serif',
      }}
      aria-label={`Nutri-Score ${grade}`}
      title={`Nutri-Score ${grade}`}
    >
      {grade}
    </span>
  );
}
