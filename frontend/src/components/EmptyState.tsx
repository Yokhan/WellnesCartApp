import GlassCard from './GlassCard';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export default function EmptyState({
  icon = '📭',
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <GlassCard className={`flex flex-col items-center text-center py-10 ${className}`}>
      <div className="text-5xl mb-4 animate-float" aria-hidden="true">
        {icon}
      </div>
      <h3
        className="text-lg font-semibold text-[var(--ContrastColor)] mb-2"
        style={{ fontFamily: 'Golos Text, sans-serif' }}
      >
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--ContrastColor)] opacity-60 max-w-[220px] mb-6">
          {description}
        </p>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="fill-fakeglass-green stroke-glass-gradient px-6 py-3 rounded-[20px] text-sm font-medium text-[var(--ContrastColor)] transition-fast hover:opacity-90"
          style={{ fontFamily: 'Golos Text, sans-serif', minHeight: '44px' }}
        >
          {action.label}
        </button>
      )}
    </GlassCard>
  );
}
