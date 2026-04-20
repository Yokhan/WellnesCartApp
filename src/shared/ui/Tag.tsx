import type { ComponentChildren, JSX } from 'preact';
import { C, space } from './tokens';

interface TagProps {
  children: ComponentChildren;
  color?: string;
  bg?: string;
  nowrap?: boolean;
  style?: JSX.CSSProperties;
}

export function Tag({ children, color = C.blue, bg = C.blueBg, nowrap = true, style }: TagProps): JSX.Element {
  return (
    <span style={{
      display: 'inline-block',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 0.2,
      padding: '4px 10px',
      borderRadius: space.radius.sm,
      background: bg,
      color,
      border: `1px solid ${color}26`,
      whiteSpace: nowrap ? 'nowrap' : 'normal',
      ...style,
    }}>
      {children}
    </span>
  );
}
