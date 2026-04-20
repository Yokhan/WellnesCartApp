import type { JSX } from 'preact';
import { useLocation } from 'wouter-preact';
import type { ProductDetail, ShoppingList } from '../../shared/types';
import { Card, NutriBadge } from '../../shared/ui';
import { formatRub } from '../../shared/format';
import { activeListSignal, persistList } from '../../shared/state';
import { api } from '../../data';

interface Props {
  alternatives: ProductDetail[];
  currentId: string;
  list: ShoppingList | null;
}

export function AlternativesCarousel({ alternatives, currentId, list }: Props): JSX.Element {
  const [, navigate] = useLocation();

  if (alternatives.length === 0) {
    return (
      <Card>
        <p className="text-text-muted text-sm text-center">
          Альтернатив в том же слоте не нашлось.
        </p>
      </Card>
    );
  }

  const pick = async (toId: string) => {
    if (!list) return;
    const inList = list.items.find((it) => it.product_id === currentId);
    if (!inList) {
      navigate(`/product/${toId}`);
      return;
    }
    if (inList.is_sacred) return;
    const next = await api.applySwap(list, currentId, toId);
    activeListSignal.value = next;
    persistList(next);
    navigate('/list');
  };

  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory -mx-4 px-4">
      {alternatives.map((alt) => (
        <div key={alt.id} className="snap-start shrink-0 w-[78%]">
          <Card className="h-full">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-4xl">{alt.image_emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{alt.name}</div>
                <div className="text-xs text-text-muted">{alt.store}</div>
              </div>
              <NutriBadge grade={alt.nutriscore_grade} size="sm" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="bg-surface-alt rounded-md p-2">
                <div className="text-text-muted">Цена</div>
                <div className="font-semibold">{formatRub(alt.price_rub)}</div>
              </div>
              <div className="bg-surface-alt rounded-md p-2">
                <div className="text-text-muted">₽/г белка</div>
                <div className="font-semibold">{alt.value.price_per_protein_g.toFixed(2)}</div>
              </div>
            </div>
            <button
              onClick={() => pick(alt.id)}
              className="w-full bg-accent text-black font-semibold py-2 rounded-md hover:bg-accent-hover"
            >
              Заменить на эту
            </button>
          </Card>
        </div>
      ))}
    </div>
  );
}
