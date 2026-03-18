import React from 'react';
import { cn } from './utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--ContrastColor)] opacity-80"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-[16px] px-4 py-3 text-base',
            'bg-[rgba(255,255,255,0.6)] border border-[rgba(255,255,255,0.4)]',
            'text-[var(--ContrastColor)] placeholder:text-[var(--ContrastColor)] placeholder:opacity-40',
            'backdrop-blur-md',
            'focus:outline-none focus:border-[var(--color-accent-green)] focus:ring-1 focus:ring-[var(--color-accent-green)]',
            'transition-fast',
            error && 'border-[var(--color-accent-red)]',
            className
          )}
          style={{ fontFamily: 'Golos Text, sans-serif' }}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-[var(--ContrastColor)] opacity-50">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-[var(--color-accent-red)]">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
export type { InputProps };
