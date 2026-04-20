import type { ComponentChildren, JSX } from 'preact';

interface ButtonProps {
  children: ComponentChildren;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const VARIANTS: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-accent hover:bg-accent-hover text-black font-semibold',
  secondary: 'bg-surface-alt hover:bg-border text-text',
  ghost: 'bg-transparent hover:bg-surface-alt text-text-muted',
  danger: 'bg-danger/20 hover:bg-danger/30 text-danger',
};

const SIZES: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5',
  lg: 'px-6 py-3.5 text-lg',
};

export function Button(props: ButtonProps): JSX.Element {
  const variant = props.variant ?? 'primary';
  const size = props.size ?? 'md';
  const className = [
    'rounded-md transition-colors select-none',
    VARIANTS[variant],
    SIZES[size],
    props.fullWidth ? 'w-full' : '',
    props.disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : '',
  ].filter(Boolean).join(' ');
  return (
    <button
      type={props.type ?? 'button'}
      className={className}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}
