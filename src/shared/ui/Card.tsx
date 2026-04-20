import type { ComponentChildren, JSX } from 'preact';
import { C, space } from './tokens';

interface CardProps {
  children: ComponentChildren;
  onClick?: () => void;
  accentColor?: string;
  padded?: boolean;
  style?: JSX.CSSProperties;
}

export function Card({ children, onClick, accentColor, padded = true, style }: CardProps): JSX.Element {
  return (
    <div
      onClick={onClick}
      style={{
        background: C.card,
        borderRadius: space.radius.xl,
        border: `1px solid ${C.bdr}`,
        borderLeft: accentColor ? `3px solid ${accentColor}` : `1px solid ${C.bdr}`,
        padding: padded ? space.padding.card : 0,
        cursor: onClick ? 'pointer' : undefined,
        transition: 'all .2s',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
