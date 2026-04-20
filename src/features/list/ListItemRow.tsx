import type { JSX } from 'preact';
import { useLocation } from 'wouter-preact';
import type { ShoppingListItem, ShoppingList } from '../../shared/types';
import { NutriBadge, SwipeRow } from '../../shared/ui';
import { formatRub, formatGrams } from '../../shared/format';
import { activeListSignal, persistList } from '../../shared/state';
import { api } from '../../data';

interface Props {
  item: ShoppingListItem;
  list: ShoppingList;
}

export function ListItemRow({ item, list }: Props): JSX.Element {
  const [, navigate] = useLocation();

  const onToggle = async () => {
    const next = await api.toggleItem(list, item.id);
    activeListSignal.value = next;
    persistList(next);
  };

  const onSwipeLeft = async () => {
    if (item.is_sacred) return;
    try {
      const next = await api.removeItem(list, item.id);
      activeListSignal.value = next;
      persistList(next);
    } catch {
      /* sacred — ignore */
    }
  };

  const openDetail = () => navigate(`/product/${item.product.id}`);

  return (
    <SwipeRow onSwipeLeft={onSwipeLeft} leftAction={item.is_sacred ? '🔒' : '🗑 удалить'}>
      <div className={`flex items-center gap-3 p-3 ${item.checked ? 'opacity-50' : ''}`}>
        <button
          onClick={onToggle}
          className={`w-6 h-6 shrink-0 rounded-full border-2 transition-colors ${
            item.checked
              ? 'bg-accent border-accent'
              : 'border-border hover:border-accent'
          }`}
          aria-label="Отметить"
        >
          {item.checked && <span className="text-black text-xs font-bold">✓</span>}
        </button>

        <button onClick={openDetail} className="flex-1 flex items-center gap-3 text-left min-w-0">
          <span className="text-2xl shrink-0">{item.product.image_emoji}</span>
          <div className="flex-1 min-w-0">
            <div className={`font-medium truncate ${item.checked ? 'line-through' : ''}`}>
              {item.product.name}
              {item.is_sacred && <span className="ml-2 text-warning text-xs">🔒</span>}
            </div>
            <div className="text-xs text-text-muted">
              {formatGrams(item.product.weight_g)} · {item.product.store}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <NutriBadge grade={item.product.nutriscore_grade} size="sm" />
            <span className="text-sm font-semibold">{formatRub(item.product.price_rub)}</span>
          </div>
        </button>
      </div>
    </SwipeRow>
  );
}
