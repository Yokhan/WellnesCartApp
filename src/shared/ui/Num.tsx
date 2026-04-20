import type { JSX } from 'preact';
import { C, ff, space } from './tokens';

interface NumProps {
  n: number;
  color?: string;
}

export function Num({ n, color = C.accent }: NumProps): JSX.Element {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      borderRadius: space.radius.lg,
      background: `${color}0D`,
      color,
      fontFamily: ff.mono,
      fontSize: 13,
      fontWeight: 500,
      flexShrink: 0,
    }}>
      {String(n).padStart(2, '0')}
    </span>
  );
}
