import type { JSX } from 'preact';

interface StepperProps {
  current: number;
  total: number;
}

export function Stepper({ current, total }: StepperProps): JSX.Element {
  return (
    <div className="flex items-center gap-2 py-4">
      {Array.from({ length: total }, (_, i) => {
        const active = i < current;
        const isCurrent = i === current - 1;
        return (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              active ? 'bg-accent' : isCurrent ? 'bg-accent/60' : 'bg-border'
            }`}
          />
        );
      })}
    </div>
  );
}
