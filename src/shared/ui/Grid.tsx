import type { ComponentChildren, JSX } from 'preact';

interface GridProps {
  children: ComponentChildren;
  min?: number;
  gap?: number;
  style?: JSX.CSSProperties;
}

export function Grid({ children, min = 260, gap = 14, style }: GridProps): JSX.Element {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`,
      gap,
      ...style,
    }}>
      {children}
    </div>
  );
}
