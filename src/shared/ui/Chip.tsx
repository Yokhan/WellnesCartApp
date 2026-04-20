import type { ComponentChildren, JSX } from 'preact';

interface ChipProps {
  children: ComponentChildren;
  selected?: boolean;
  onClick?: () => void;
  color?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const COLORS: Record<NonNullable<ChipProps['color']>, { bg: string; text: string; border: string }> = {
  default: { bg: 'bg-surface-alt', text: 'text-text', border: 'border-border' },
  success: { bg: 'bg-success/15', text: 'text-success', border: 'border-success/30' },
  warning: { bg: 'bg-warning/15', text: 'text-warning', border: 'border-warning/30' },
  danger: { bg: 'bg-danger/15', text: 'text-danger', border: 'border-danger/30' },
  info: { bg: 'bg-info/15', text: 'text-info', border: 'border-info/30' },
};

export function Chip(props: ChipProps): JSX.Element {
  const color = props.color ?? 'default';
  const { bg, text, border } = COLORS[color];
  const selected = props.selected
    ? 'ring-2 ring-accent bg-accent/15 text-accent border-accent/40'
    : `${bg} ${text} ${border}`;
  const interactive = props.onClick ? 'cursor-pointer active:scale-95' : '';
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-all ${selected} ${interactive}`}
    >
      {props.children}
    </button>
  );
}
