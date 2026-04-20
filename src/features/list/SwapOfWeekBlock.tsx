import type { JSX } from 'preact';
import type { ShoppingList } from '../../shared/types';
import { Card, EvidenceTag } from '../../shared/ui';
import { formatRub } from '../../shared/format';
import { activeListSignal, persistList } from '../../shared/state';
import { api } from '../../data';

interface Props {
  list: ShoppingList;
}

export function SwapOfWeekBlock({ list }: Props): JSX.Element | null {
  if (list.swaps_of_week.length === 0) return null;

  const apply = async (fromId: string, toId: string) => {
    const next = await api.applySwap(list, fromId, toId);
    activeListSignal.value = next;
    persistList(next);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs text-text-muted uppercase tracking-wide">Свопы недели</div>
          <div className="font-semibold">Можно улучшить без потери удобства</div>
        </div>
        <EvidenceTag level="SR/MA" />
      </div>

      <div className="space-y-2">
        {list.swaps_of_week.map((s) => {
          const priceLabel = s.price_delta_rub > 0 ? `+${formatRub(s.price_delta_rub)}` : formatRub(s.price_delta_rub);
          const proteinLabel = s.protein_delta_g > 0 ? `+${s.protein_delta_g} г` : `${s.protein_delta_g} г`;
          return (
            <div key={`${s.from_product_id}-${s.to_product_id}`} className="bg-surface-alt rounded-md p-3">
              <div className="flex items-center gap-2 text-sm mb-2">
                <span className="text-text-muted line-through truncate">{s.from_name}</span>
                <span className="text-accent">→</span>
                <span className="font-medium truncate">{s.to_name}</span>
              </div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-text-muted">{s.reason}</span>
                <div className="flex gap-3">
                  <span className={s.protein_delta_g >= 0 ? 'text-success' : 'text-danger'}>
                    белок {proteinLabel}
                  </span>
                  <span className={s.price_delta_rub <= 0 ? 'text-success' : 'text-warning'}>
                    ₽ {priceLabel}
                  </span>
                </div>
              </div>
              <button
                onClick={() => apply(s.from_product_id, s.to_product_id)}
                className="w-full bg-accent/20 hover:bg-accent/30 text-accent text-sm py-1.5 rounded-md"
              >
                Заменить
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
