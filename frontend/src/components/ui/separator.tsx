import React from 'react';
import { cn } from './utils';

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

function Separator({ orientation = 'horizontal', className, ...props }: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'bg-[rgba(45,74,45,0.12)]',
        orientation === 'horizontal' ? 'w-full h-px' : 'h-full w-px',
        className
      )}
      {...props}
    />
  );
}

export { Separator };
export type { SeparatorProps };
