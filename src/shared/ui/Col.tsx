import type { ComponentChildren, JSX } from 'preact';

interface ColProps {
  children: ComponentChildren;
  gap?: number;
  style?: JSX.CSSProperties;
}

export function Col({ children, gap = 14, style }: ColProps): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap, ...style }}>
      {children}
    </div>
  );
}
