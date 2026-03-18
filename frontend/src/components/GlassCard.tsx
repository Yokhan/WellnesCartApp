import React from 'react';
import { cn } from './ui/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export default function GlassCard({
  children,
  className = '',
  onClick,
  padding = 'lg',
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'fake-glass rounded-[var(--CornerRadius,24px)]',
        paddingClasses[padding],
        onClick && 'cursor-pointer transition-fast hover:shadow-lg active:scale-[0.99]',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick();
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
