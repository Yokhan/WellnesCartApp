import type { JSX } from 'preact';
import { C, space } from './tokens';

interface DeltaChipProps {
  value: number;
  unit: string;
  positive?: 'good' | 'bad';
}

export function DeltaChip({ value, unit, positive = 'good' }: DeltaChipProps): JSX.Element {
  const isPositive = value > 0;
  const isGood = positive === 'good' ? isPositive : !isPositive;
  const color = isGood ? C.green : C.accent;
  const bg = isGood ? C.greenBg : C.accentBg;
  const sign = isPositive ? '+' : '';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      padding: '2px 8px',
      borderRadius: space.radius.sm,
      background: bg,
      color,
      fontSize: 11,
      fontWeight: 600,
      border: `1px solid ${color}26`,
    }}>
      {sign}{value}{unit}
    </span>
  );
}
