import type { JSX } from 'preact';
import { space } from './tokens';

interface NOVABadgeProps {
  nova: 1 | 2 | 3 | 4;
  showLabel?: boolean;
}

const NOVA_STYLE: Record<number, { color: string; bg: string; label: string }> = {
  1: { color: '#4A7C59', bg: 'rgba(74,124,89,0.10)', label: 'Необработанный' },
  2: { color: '#8B7535', bg: 'rgba(139,117,53,0.10)', label: 'Обработанный' },
  3: { color: '#A0522D', bg: 'rgba(160,82,45,0.10)', label: 'Переработанный' },
  4: { color: '#A04030', bg: 'rgba(160,64,48,0.10)', label: 'Ультрапереработанный' },
};

export function NOVABadge({ nova, showLabel = false }: NOVABadgeProps): JSX.Element {
  const s = NOVA_STYLE[nova];
  return (
    <span
      title={`NOVA-${nova}: ${s.label}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: showLabel ? '3px 8px' : '3px 6px',
        borderRadius: space.radius.sm,
        background: s.bg,
        color: s.color,
        fontSize: 10.5,
        fontWeight: 600,
        border: `1px solid ${s.color}26`,
      }}
    >
      <span style={{ fontSize: 9, fontWeight: 700 }}>N{nova}</span>
      {showLabel && <span>{s.label}</span>}
    </span>
  );
}
