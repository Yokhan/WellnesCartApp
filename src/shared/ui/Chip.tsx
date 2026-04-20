import type { ComponentChildren, JSX } from 'preact';
import { C, space } from './tokens';

interface ChipProps {
  children: ComponentChildren;
  selected?: boolean;
  onClick?: () => void;
  color?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

type ChipColor = 'default' | 'success' | 'warning' | 'danger' | 'info';
const COLORS: Record<ChipColor, { bg: string; color: string }> = {
  default: { bg: `${C.bdr}80`, color: C.mid },
  success: { bg: C.greenBg, color: C.green },
  warning: { bg: C.amberBg, color: C.amber },
  danger:  { bg: C.accentBg, color: C.accent },
  info:    { bg: C.blueBg, color: C.blue },
};

export function Chip(props: ChipProps): JSX.Element {
  const c = COLORS[props.color ?? 'default'];
  const isSelected = props.selected;
  return (
    <button
      type="button"
      onClick={props.onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 14px',
        borderRadius: space.radius.pill,
        border: isSelected ? `1.5px solid ${C.accent}` : `1px solid ${c.color}26`,
        background: isSelected ? C.accentBg : c.bg,
        color: isSelected ? C.accent : c.color,
        fontSize: 13,
        fontWeight: isSelected ? 600 : 400,
        cursor: props.onClick ? 'pointer' : 'default',
        transition: 'all .2s',
      }}
    >
      {props.children}
    </button>
  );
}
