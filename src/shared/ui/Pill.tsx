import type { ComponentChildren, JSX } from 'preact';
import { C, space } from './tokens';

interface PillProps {
  children: ComponentChildren;
  active?: boolean;
  onClick?: () => void;
}

export function Pill({ children, active, onClick }: PillProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 18px',
        borderRadius: space.radius.pill,
        border: active ? `1.5px solid ${C.accent}` : `1px solid ${C.bdr}`,
        background: active ? C.accentBg : 'transparent',
        color: active ? C.accent : C.mid,
        fontSize: 14,
        fontWeight: active ? 600 : 400,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all .2s',
      }}
    >
      {children}
    </button>
  );
}
