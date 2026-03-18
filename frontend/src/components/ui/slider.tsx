import React from 'react';
import { cn } from './utils';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  valueLabel?: string;
  onChange?: (value: number) => void;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, valueLabel, onChange, min = 0, max = 100, value, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(Number(e.target.value));
    };

    const pct =
      value !== undefined && min !== undefined && max !== undefined
        ? ((Number(value) - Number(min)) / (Number(max) - Number(min))) * 100
        : 0;

    return (
      <div className="flex flex-col gap-2">
        {(label || valueLabel) && (
          <div className="flex justify-between items-center">
            {label && (
              <span className="text-sm font-medium text-[var(--ContrastColor)] opacity-80">
                {label}
              </span>
            )}
            {valueLabel && (
              <span className="text-sm font-semibold text-[var(--ContrastColor)]">
                {valueLabel}
              </span>
            )}
          </div>
        )}
        <div className="relative py-2">
          <div
            className="absolute top-1/2 left-0 h-2 rounded-full -translate-y-1/2 pointer-events-none"
            style={{
              width: `${pct}%`,
              background: 'var(--color-accent-green)',
            }}
          />
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={handleChange}
            className={cn('w-full h-2 rounded-full appearance-none cursor-pointer', className)}
            style={{
              background: `linear-gradient(to right, var(--color-accent-green) ${pct}%, rgba(45,74,45,0.15) ${pct}%)`,
            }}
            {...props}
          />
        </div>
      </div>
    );
  }
);
Slider.displayName = 'Slider';

export { Slider };
export type { SliderProps };
