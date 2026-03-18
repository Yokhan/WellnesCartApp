import GlassCard from './GlassCard';
import NutriScoreBadge from './NutriScoreBadge';
import { cn } from './ui/utils';
import type { NutriScoreGrade, NovaGroup } from '@/design-system/tokens';

interface ProductCardData {
  id: string;
  name: string;
  brandName: string;
  storeName?: string;
  priceRub: number;
  pricePerProteinG?: number;
  nutriScoreGrade: NutriScoreGrade;
  novaGroup: NovaGroup;
}

interface ProductCardProps {
  product: ProductCardData;
  onClick?: () => void;
  className?: string;
}

const NOVA_LABELS: Record<NovaGroup, { label: string; color: string }> = {
  1: { label: 'NOVA 1', color: 'var(--nutriscore-a)' },
  2: { label: 'NOVA 2', color: 'var(--nutriscore-b)' },
  3: { label: 'NOVA 3', color: 'var(--nutriscore-c)' },
  4: { label: 'NOVA 4', color: 'var(--nutriscore-e)' },
};

function formatRub(value: number): string {
  return `${Math.round(value)} ₽`;
}

export default function ProductCard({ product, onClick, className }: ProductCardProps) {
  const nova = NOVA_LABELS[product.novaGroup];

  return (
    <GlassCard padding="md" onClick={onClick} className={cn('animate-fade-in', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold text-[var(--ContrastColor)] truncate"
            style={{ fontFamily: 'Golos Text, sans-serif' }}
          >
            {product.name}
          </p>
          <p
            className="text-xs text-[var(--ContrastColor)] opacity-60 mt-0.5"
            style={{ fontFamily: 'Golos Text, sans-serif' }}
          >
            {product.brandName}
            {product.storeName && ` · ${product.storeName}`}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <NutriScoreBadge grade={product.nutriScoreGrade} size="sm" />
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded-[4px]"
              style={{
                color: nova.color,
                background: `${nova.color}18`,
                fontFamily: 'Golos Text, sans-serif',
              }}
            >
              {nova.label}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <p
            className="text-base font-bold text-[var(--ContrastColor)]"
            style={{ fontFamily: 'Golos Text, sans-serif' }}
          >
            {formatRub(product.priceRub)}
          </p>
          {product.pricePerProteinG !== undefined && (
            <p
              className="text-[10px] font-medium"
              style={{
                color: 'var(--color-accent-green)',
                fontFamily: 'Golos Text, sans-serif',
              }}
            >
              {product.pricePerProteinG.toFixed(1)} ₽/г белка
            </p>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

export type { ProductCardData };
