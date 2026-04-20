import type { JSX } from 'preact';
import type { ShoppingList, SwapSuggestion } from '../../shared/types';
import { Card, Tag, DeltaChip, EvidenceTag, Label } from '../../shared/ui';
import { C, ff, space } from '../../shared/ui/tokens';
import { formatRub } from '../../shared/format';
import { activeListSignal, persistList } from '../../shared/state';
import { api } from '../../data';

interface Props {
  list: ShoppingList;
}

function SwapRow({ swap, onApply }: {
  swap: SwapSuggestion;
  onApply: () => void;
}): JSX.Element {
  const priceDelta = swap.price_delta_rub;
  const priceColor = priceDelta <= 0 ? C.green : C.amber;

  return (
    <div style={{
      background: C.bg,
      borderRadius: space.radius.lg,
      padding: space.padding.inner,
    }}>
      {/* From → To */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 14,
        marginBottom: 8,
      }}>
        <span style={{
          color: C.muted,
          textDecoration: 'line-through',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {swap.from_name}
        </span>
        <span style={{ color: C.accent, flexShrink: 0 }}>→</span>
        <span style={{
          fontWeight: 600,
          color: C.text,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {swap.to_name}
        </span>
      </div>

      {/* Reason tags */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 8,
      }}>
        {swap.reasons.map((r) => (
          <Tag key={r} color={C.blue} bg={C.blueBg}>{r}</Tag>
        ))}
      </div>

      {/* Metrics row: delta chip + convenience + protein/price */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 10,
      }}>
        <DeltaChip
          value={swap.score_delta}
          unit="% оценка"
          positive="good"
        />
        {swap.convenience_label && (
          <span style={{
            fontSize: 11,
            color: C.mid,
            fontFamily: ff.sans,
          }}>
            Оба — {swap.convenience_label}
          </span>
        )}
        <span style={{
          fontSize: 11,
          fontFamily: ff.mono,
          color: swap.protein_delta_g >= 0 ? C.green : C.accent,
        }}>
          белок {swap.protein_delta_g > 0 ? '+' : ''}{swap.protein_delta_g} г
        </span>
        <span style={{
          fontSize: 11,
          fontFamily: ff.mono,
          color: priceColor,
        }}>
          ₽ {priceDelta > 0 ? '+' : ''}{formatRub(priceDelta)}
        </span>
      </div>

      {/* Apply button */}
      <button
        onClick={onApply}
        style={{
          width: '100%',
          padding: '8px 0',
          border: 'none',
          borderRadius: space.radius.md,
          background: C.accentBg,
          color: C.accent,
          fontSize: 13,
          fontWeight: 600,
          fontFamily: ff.sans,
          cursor: 'pointer',
        }}
      >
        Заменить
      </button>
    </div>
  );
}

export function SwapOfWeekBlock({ list }: Props): JSX.Element | null {
  if (list.swaps_of_week.length === 0) return null;

  const apply = async (fromId: string, toId: string) => {
    const next = await api.applySwap(list, fromId, toId);
    activeListSignal.value = next;
    persistList(next);
  };

  return (
    <Card accentColor={C.accent}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: space.gap.base,
      }}>
        <div>
          <Label>Свопы недели</Label>
          <div style={{
            fontFamily: ff.sans,
            fontWeight: 600,
            fontSize: 14,
            color: C.text,
            marginTop: 2,
          }}>
            Можно улучшить без потери удобства
          </div>
        </div>
        <EvidenceTag level="SR/MA" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: space.gap.tight }}>
        {list.swaps_of_week.map((s) => (
          <SwapRow
            key={`${s.from_product_id}-${s.to_product_id}`}
            swap={s}
            onApply={() => apply(s.from_product_id, s.to_product_id)}
          />
        ))}
      </div>
    </Card>
  );
}
