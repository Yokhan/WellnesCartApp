import React from 'react';
import { cn } from './utils';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium text-[var(--ContrastColor)] opacity-80 select-none',
        className
      )}
      style={{ fontFamily: 'Golos Text, sans-serif' }}
      {...props}
    >
      {children}
      {required && <span className="text-[var(--color-accent-red)] ml-0.5">*</span>}
    </label>
  )
);
Label.displayName = 'Label';

export { Label };
export type { LabelProps };
