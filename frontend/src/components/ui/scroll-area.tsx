import React from 'react';
import { cn } from './utils';

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: string;
  horizontal?: boolean;
}

function ScrollArea({
  children,
  className,
  maxHeight = '100%',
  horizontal = false,
  style,
  ...props
}: ScrollAreaProps) {
  return (
    <div
      className={cn(
        'overflow-auto',
        horizontal ? 'overflow-x-auto overflow-y-hidden' : 'overflow-y-auto overflow-x-hidden',
        className
      )}
      style={{ maxHeight, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

export { ScrollArea };
export type { ScrollAreaProps };
