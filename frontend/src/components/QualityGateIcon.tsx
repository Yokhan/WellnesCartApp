import { cn } from './ui/utils';

type QualityTier = 'tier1' | 'tier2' | 'tier3';

interface QualityGateIconProps {
  tier: QualityTier;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

const TIER_CONFIG: Record<QualityTier, { icon: string; label: string; color: string }> = {
  tier1: {
    icon: '✅',
    label: 'Топ качество',
    color: 'var(--nutriscore-a)',
  },
  tier2: {
    icon: '🟡',
    label: 'Хорошее',
    color: 'var(--nutriscore-c)',
  },
  tier3: {
    icon: '⚠️',
    label: 'Допустимо',
    color: 'var(--nutriscore-d)',
  },
};

export default function QualityGateIcon({
  tier,
  size = 'sm',
  showLabel = false,
  className,
}: QualityGateIconProps) {
  const config = TIER_CONFIG[tier];

  return (
    <div
      className={cn('inline-flex items-center gap-1', className)}
      title={config.label}
      aria-label={`Качество: ${config.label}`}
    >
      <span
        className={cn(size === 'sm' ? 'text-sm' : 'text-base')}
        aria-hidden="true"
      >
        {config.icon}
      </span>
      {showLabel && (
        <span
          className="text-xs font-medium"
          style={{ color: config.color, fontFamily: 'Golos Text, sans-serif' }}
        >
          {config.label}
        </span>
      )}
    </div>
  );
}
