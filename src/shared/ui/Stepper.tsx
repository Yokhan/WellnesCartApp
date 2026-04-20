import type { JSX } from 'preact';
import { C } from './tokens';

interface StepperProps {
  current: number;
  total: number;
}

export function Stepper({ current, total }: StepperProps): JSX.Element {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '16px 0' }}>
      {Array.from({ length: total }, (_, i) => {
        const active = i < current;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: active ? C.accent : C.bdr,
              transition: 'background .3s',
            }}
          />
        );
      })}
    </div>
  );
}
