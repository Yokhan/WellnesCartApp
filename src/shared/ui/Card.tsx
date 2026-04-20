import type { ComponentChildren, JSX } from 'preact';

interface CardProps {
  children: ComponentChildren;
  onClick?: () => void;
  className?: string;
  padded?: boolean;
}

export function Card(props: CardProps): JSX.Element {
  const base = 'bg-surface rounded-lg border border-border shadow-card';
  const pad = props.padded === false ? '' : 'p-4';
  const interactive = props.onClick ? 'active:scale-[0.98] transition-transform cursor-pointer' : '';
  const className = [base, pad, interactive, props.className ?? ''].filter(Boolean).join(' ');
  return (
    <div className={className} onClick={props.onClick}>
      {props.children}
    </div>
  );
}
