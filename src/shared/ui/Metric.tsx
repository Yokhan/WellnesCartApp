import type { JSX } from 'preact';
import { C, ff, space } from './tokens';

interface MetricProps {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}

export function Metric({ label, value, sub, color = C.accent }: MetricProps): JSX.Element {
  return (
    <div style={{
      background: C.card,
      borderRadius: space.radius.xl,
      border: `1px solid ${C.bdr}`,
      borderLeft: `3px solid ${color}`,
      padding: space.padding.card,
    }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1.6, color: C.muted, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontFamily: ff.serif, fontSize: 26, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}
