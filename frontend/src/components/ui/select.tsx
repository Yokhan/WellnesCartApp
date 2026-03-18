import React from 'react';
import { cn } from './utils';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-[var(--ContrastColor)] opacity-80"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full rounded-[16px] px-4 py-3 text-base appearance-none',
            'bg-[rgba(255,255,255,0.6)] border border-[rgba(255,255,255,0.4)]',
            'text-[var(--ContrastColor)]',
            'backdrop-blur-md',
            'focus:outline-none focus:border-[var(--color-accent-green)]',
            'transition-fast cursor-pointer',
            error && 'border-[var(--color-accent-red)]',
            className
          )}
          style={{ fontFamily: 'Golos Text, sans-serif' }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-[var(--color-accent-red)]">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
export type { SelectProps, SelectOption };
