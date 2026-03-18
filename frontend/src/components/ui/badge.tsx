import React from 'react';
import { cn } from './utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'neutral';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[var(--color-accent-green)] text-[var(--ContrastColor)]',
  success: 'bg-[var(--nutriscore-a)] text-white',
  warning: 'bg-[var(--color-accent-orange)] text-white',
  danger: 'bg-[var(--color-accent-red)] text-white',
  neutral: 'bg-[rgba(45,74,45,0.1)] text-[var(--ContrastColor)]',
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps, BadgeVariant };
