import React from 'react';
import { cn } from './ui/utils';

type GlassButtonVariant = 'light' | 'green' | 'red' | 'dark';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: GlassButtonVariant;
  size?: 'default' | 'sm';
}

const variantClass: Record<GlassButtonVariant, string> = {
  green: 'fill-fakeglass-green',
  light: 'fill-fakeglass-light',
  red: 'fill-fakeglass-red',
  dark: 'fill-fakeglass-dark',
};

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = 'green', size = 'default', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'stroke-glass-gradient content-stretch flex items-center justify-center relative cursor-pointer',
          variantClass[variant],
          size === 'sm' ? 'px-4 py-2 text-sm rounded-[16px]' : 'px-8 py-4 text-base',
          className
        )}
        style={{
          borderRadius: 'var(--ButtonRadius, 24px)',
          boxShadow: 'var(--FakeGlassShadow)',
          minHeight: size === 'sm' ? '40px' : '56px',
          fontFamily: 'Golos Text, sans-serif',
          fontWeight: 500,
        }}
        {...props}
      >
        <span className="relative z-10 text-[var(--ContrastColor)] font-medium">
          {children}
        </span>
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3)' }}
        />
      </button>
    );
  }
);
GlassButton.displayName = 'GlassButton';
export default GlassButton;
