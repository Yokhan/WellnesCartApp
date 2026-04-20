import type { ComponentChildren, JSX } from 'preact';
import { C, space } from './tokens';

interface ButtonProps {
  children: ComponentChildren;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const VARIANTS: Record<string, { bg: string; color: string; border: string }> = {
  primary:   { bg: C.accent, color: '#FFF', border: 'transparent' },
  secondary: { bg: C.accentBg, color: C.accent, border: `${C.accent}33` },
  ghost:     { bg: 'transparent', color: C.mid, border: 'transparent' },
  danger:    { bg: 'rgba(160,82,45,0.08)', color: '#A04030', border: 'rgba(160,64,48,0.2)' },
};

const SIZES: Record<string, { padding: string; fontSize: number }> = {
  sm: { padding: '6px 14px', fontSize: 13 },
  md: { padding: '10px 20px', fontSize: 14.5 },
  lg: { padding: '14px 28px', fontSize: 16 },
};

export function Button(props: ButtonProps): JSX.Element {
  const v = VARIANTS[props.variant ?? 'primary'];
  const s = SIZES[props.size ?? 'md'];
  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 600,
        borderRadius: space.radius.lg,
        background: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        width: props.fullWidth ? '100%' : undefined,
        opacity: props.disabled ? 0.4 : 1,
        pointerEvents: props.disabled ? 'none' : undefined,
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        transition: 'all .2s',
      }}
    >
      {props.children}
    </button>
  );
}
