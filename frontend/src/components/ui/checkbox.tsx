import React from 'react';
import { cn } from './utils';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, onChange, label, disabled = false, className, id }, ref) => {
    const inputId = id ?? `checkbox-${Math.random().toString(36).slice(2)}`;

    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only"
          />
          <label
            htmlFor={inputId}
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded-[6px] border-2 cursor-pointer transition-fast',
              checked
                ? 'bg-[var(--color-accent-green)] border-[var(--color-accent-green)]'
                : 'bg-white/60 border-[rgba(45,74,45,0.3)]',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {checked && (
              <svg
                className="h-3 w-3 text-[var(--ContrastColor)] animate-check"
                fill="none"
                viewBox="0 0 12 12"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </label>
        </div>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm text-[var(--ContrastColor)] select-none cursor-pointer',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
export type { CheckboxProps };
