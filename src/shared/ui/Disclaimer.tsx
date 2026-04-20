import type { ComponentChildren, JSX } from 'preact';

interface DisclaimerProps {
  children: ComponentChildren;
  tone?: 'info' | 'warning';
}

export function Disclaimer({ children, tone = 'info' }: DisclaimerProps): JSX.Element {
  const cls = tone === 'warning'
    ? 'bg-warning/10 text-warning/90 border-warning/25'
    : 'bg-info/10 text-info/90 border-info/25';
  return (
    <div className={`rounded-md border px-3 py-2.5 text-xs leading-relaxed ${cls}`}>
      {children}
    </div>
  );
}
