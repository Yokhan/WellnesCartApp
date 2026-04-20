import type { ComponentChildren, JSX } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { C, space } from './tokens';

interface SwipeRowProps {
  children: ComponentChildren;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: ComponentChildren;
  rightAction?: ComponentChildren;
  threshold?: number;
}

const DEFAULT_THRESHOLD = 80;

export function SwipeRow(props: SwipeRowProps): JSX.Element {
  const threshold = props.threshold ?? DEFAULT_THRESHOLD;
  const [dx, setDx] = useState(0);
  const startX = useRef<number | null>(null);
  const dragging = useRef(false);

  const onStart = (e: PointerEvent) => {
    startX.current = e.clientX;
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging.current || startX.current === null) return;
    const delta = e.clientX - startX.current;
    setDx(Math.max(-120, Math.min(120, delta)));
  };
  const onEnd = () => {
    if (dx > threshold && props.onSwipeRight) props.onSwipeRight();
    else if (dx < -threshold && props.onSwipeLeft) props.onSwipeLeft();
    setDx(0);
    dragging.current = false;
    startX.current = null;
  };

  const bgColor = dx < 0 ? 'rgba(160,64,48,0.08)' : dx > 0 ? 'rgba(74,124,89,0.08)' : C.card;

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: space.radius.xl, background: bgColor }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', pointerEvents: 'none' }}>
        <span style={{ color: C.green, fontSize: 13, opacity: 0.8 }}>{props.rightAction}</span>
        <span style={{ color: C.accent, fontSize: 13, opacity: 0.8 }}>{props.leftAction}</span>
      </div>
      <div
        onPointerDown={onStart}
        onPointerMove={onMove}
        onPointerUp={onEnd}
        onPointerCancel={onEnd}
        style={{
          position: 'relative',
          transform: `translateX(${dx}px)`,
          touchAction: 'pan-y',
          background: C.card,
          transition: dragging.current ? 'none' : 'transform .2s',
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
