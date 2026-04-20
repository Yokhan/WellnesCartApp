import type { JSX } from 'preact';
import { C, ff, space } from './tokens';

interface ScoreBreakdownProps {
  score: number;
  weights: { ns: number; price: number; deficit: number };
  budgetTier: string;
}

const TIER_LABEL: Record<string, string> = {
  low: 'Экономный',
  med: 'Средний',
  high: 'Премиум',
};

const SEGMENTS = [
  { key: 'ns' as const, label: 'Качество', color: '#4A7C59' },
  { key: 'price' as const, label: 'Цена', color: '#4A6A8A' },
  { key: 'deficit' as const, label: 'Нутриенты', color: '#A0522D' },
];

export function ScoreBreakdown({ score, weights, budgetTier }: ScoreBreakdownProps): JSX.Element {
  const pct = Math.round(score * 100);
  return (
    <div style={{ padding: space.padding.inner, background: C.card, borderRadius: space.radius.xl, border: `1px solid ${C.bdr}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontFamily: ff.serif, fontSize: 26, fontWeight: 700, color: C.text }}>{pct}</span>
        <span style={{ fontSize: 12, color: C.muted }}>/100</span>
      </div>

      <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', gap: 2, marginBottom: 8 }}>
        {SEGMENTS.map((seg) => (
          <div
            key={seg.key}
            style={{
              flex: weights[seg.key],
              background: seg.color,
              opacity: 0.7,
              borderRadius: 2,
            }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
        {SEGMENTS.map((seg) => (
          <span key={seg.key} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: C.muted }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: seg.color, opacity: 0.7, flexShrink: 0 }} />
            {seg.label} {Math.round(weights[seg.key] * 100)}%
          </span>
        ))}
      </div>

      <div style={{ fontSize: 11, color: C.muted }}>
        Персонализировано под бюджет: {TIER_LABEL[budgetTier] ?? budgetTier}
      </div>
    </div>
  );
}
