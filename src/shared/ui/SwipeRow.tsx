import type { ComponentChildren, JSX } from 'preact';
import { useRef, useState } from 'preact/hooks';

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
    const clamped = Math.max(-120, Math.min(120, delta));
    setDx(clamped);
  };
  const onEnd = () => {
    if (dx > threshold && props.onSwipeRight) props.onSwipeRight();
    else if (dx < -threshold && props.onSwipeLeft) props.onSwipeLeft();
    setDx(0);
    dragging.current = false;
    startX.current = null;
  };

  const bgCls = dx < 0 ? 'bg-danger/20' : dx > 0 ? 'bg-success/20' : 'bg-surface-alt';

  return (
    <div className={`relative overflow-hidden rounded-md ${bgCls}`}>
      <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
        <span className="text-success text-sm opacity-80">{props.rightAction}</span>
        <span className="text-danger text-sm opacity-80">{props.leftAction}</span>
      </div>
      <div
        onPointerDown={onStart}
        onPointerMove={onMove}
        onPointerUp={onEnd}
        onPointerCancel={onEnd}
        style={{ transform: `translateX(${dx}px)`, touchAction: 'pan-y' }}
        className="relative transition-transform bg-surface"
      >
        {props.children}
      </div>
    </div>
  );
}
