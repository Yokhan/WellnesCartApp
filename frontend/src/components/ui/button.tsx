import React from 'react';
import { cn } from './utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-accent-green)] text-[var(--ContrastColor)] hover:opacity-90',
  secondary: 'bg-[var(--FakeGlassBg)] text-[var(--ContrastColor)] border border-[rgba(255,255,255,0.25)]',
  ghost: 'bg-transparent text-[var(--ContrastColor)] hover:bg-[rgba(45,74,45,0.08)]',
  destructive: 'bg-[var(--color-accent-red)] text-white hover:opacity-90',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-[12px] min-h-[32px]',
  md: 'px-4 py-2 text-base rounded-[16px] min-h-[40px]',
  lg: 'px-6 py-3 text-base rounded-[20px] min-h-[52px]',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-fast cursor-pointer',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        style={{ fontFamily: 'Golos Text, sans-serif' }}
        {...props}
      >
        {isLoading ? (
          <span
            className="mr-2 h-4 w-4 rounded-full border-2 border-current border-t-transparent"
            style={{ animation: 'spin 0.7s linear infinite' }}
            aria-hidden="true"
          />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
