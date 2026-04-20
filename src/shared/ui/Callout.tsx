import type { ComponentChildren, JSX } from 'preact';
import { C, space } from './tokens';

interface CalloutProps {
  children: ComponentChildren;
  color?: string;
  style?: JSX.CSSProperties;
}

export function Callout({ children, color = C.blue, style }: CalloutProps): JSX.Element {
  return (
    <div style={{
      padding: space.padding.inner,
      borderRadius: space.radius.lg,
      background: `${color}0D`,
      border: `1px solid ${color}26`,
      color,
      fontSize: 13,
      lineHeight: 1.65,
      ...style,
    }}>
      {children}
    </div>
  );
}
