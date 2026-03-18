import { cn } from './ui/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  fullscreen?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 24,
  md: 40,
  lg: 56,
};

export default function LoadingSpinner({
  size = 'md',
  label,
  fullscreen = false,
  className,
}: LoadingSpinnerProps) {
  const px = sizeMap[size];

  const spinner = (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <svg
        width={px}
        height={px}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ animation: 'spin 0.8s linear infinite' }}
      >
        <circle
          cx="20"
          cy="20"
          r="16"
          stroke="var(--color-accent-green)"
          strokeWidth="4"
          strokeOpacity="0.2"
        />
        <path
          d="M20 4 A16 16 0 0 1 36 20"
          stroke="var(--color-accent-green)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      {label && (
        <p
          className="text-sm text-[var(--ContrastColor)] opacity-60"
          style={{ fontFamily: 'Golos Text, sans-serif' }}
        >
          {label}
        </p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--MainColor)]"
        role="status"
        aria-label={label ?? 'Загрузка...'}
      >
        {spinner}
      </div>
    );
  }

  return (
    <div role="status" aria-label={label ?? 'Загрузка...'}>
      {spinner}
    </div>
  );
}
