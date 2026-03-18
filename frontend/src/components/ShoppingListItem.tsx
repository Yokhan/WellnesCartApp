import { cn } from './ui/utils';
import { Checkbox } from './ui';
import NutriScoreBadge from './NutriScoreBadge';
import IndulgenceTag from './IndulgenceTag';
import type { NutriScoreGrade } from '@/design-system/tokens';

interface ShoppingListItemData {
  id: string;
  productName: string;
  brandName: string;
  quantity: number;
  totalPrice: number;
  nutriScoreGrade: NutriScoreGrade;
  isIndulgence: boolean;
  isChecked: boolean;
}

interface ShoppingListItemProps {
  item: ShoppingListItemData;
  onCheck: (id: string, checked: boolean) => void;
  onSwap: (id: string) => void;
  className?: string;
}

function formatRub(value: number): string {
  return `${Math.round(value)} ₽`;
}

export default function ShoppingListItem({
  item,
  onCheck,
  onSwap,
  className,
}: ShoppingListItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 py-3 px-1',
        'border-b border-[rgba(45,74,45,0.08)] last:border-b-0',
        item.isChecked && 'opacity-60',
        'transition-fast',
        className
      )}
    >
      <Checkbox
        checked={item.isChecked}
        onChange={(checked) => onCheck(item.id, checked)}
        aria-label={`Отметить ${item.productName}`}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p
            className={cn(
              'text-sm font-medium text-[var(--ContrastColor)] truncate',
              item.isChecked && 'line-through'
            )}
            style={{ fontFamily: 'Golos Text, sans-serif' }}
          >
            {item.productName}
          </p>
          <NutriScoreBadge grade={item.nutriScoreGrade} size="sm" />
        </div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <p
            className="text-xs text-[var(--ContrastColor)] opacity-50"
            style={{ fontFamily: 'Golos Text, sans-serif' }}
          >
            {item.brandName} · {item.quantity} шт.
          </p>
          {item.isIndulgence && <IndulgenceTag size="sm" />}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <p
          className="text-sm font-semibold text-[var(--ContrastColor)]"
          style={{ fontFamily: 'Golos Text, sans-serif' }}
        >
          {formatRub(item.totalPrice)}
        </p>
        <button
          type="button"
          onClick={() => onSwap(item.id)}
          aria-label={`Найти замену для ${item.productName}`}
          className="h-8 w-8 rounded-full fill-fakeglass-light stroke-glass-gradient flex items-center justify-center transition-fast hover:opacity-80 active:scale-95"
          title="Найти замену"
        >
          <span aria-hidden="true" className="text-sm">🔄</span>
        </button>
      </div>
    </div>
  );
}

export type { ShoppingListItemData };
