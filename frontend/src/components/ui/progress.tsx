import React from 'react';
import { cn } from './utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  color?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeHeight: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

function Progress({
  value,
  max = 100,
  color,
  showLabel = false,
  size = 'md',
  className,
  ...props
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const fillColor = color ?? 'var(--color-accent-green)';

  return (
    <div className={cn('flex flex-col gap-1', className)} {...props}>
      <div
        className={cn('w-full rounded-full bg-[rgba(45,74,45,0.12)] overflow-hidden', sizeHeight[size])}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: fillColor,
          }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-[var(--ContrastColor)] opacity-60 text-right">
          {Math.round(pct)}%
        </p>
      )}
    </div>
  );
}

export { Progress };
export type { ProgressProps };
