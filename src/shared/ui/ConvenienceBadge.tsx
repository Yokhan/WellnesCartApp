import type { JSX } from 'preact';
import { C, space } from './tokens';

interface ConvenienceBadgeProps {
  tier: 1 | 2 | 3;
}

const LABELS: Record<number, { icon: string; text: string }> = {
  1: { icon: '🍽', text: 'Готовое' },
  2: { icon: '⏱', text: 'Быстрое (5 мин)' },
  3: { icon: '🔪', text: 'Для готовки' },
};

export function ConvenienceBadge({ tier }: ConvenienceBadgeProps): JSX.Element {
  const l = LABELS[tier];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '3px 8px',
      borderRadius: space.radius.sm,
      background: C.accentBg,
      color: C.accent,
      fontSize: 11,
      fontWeight: 500,
      border: `1px solid ${C.accent}1A`,
    }}>
      <span>{l.icon}</span>
      <span>{l.text}</span>
    </span>
  );
}
