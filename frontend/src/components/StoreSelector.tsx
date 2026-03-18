import { cn } from './ui/utils';
import { STORE_OPTIONS } from '@/design-system/tokens';

interface StoreSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

export default function StoreSelector({ selected, onChange, className }: StoreSelectorProps) {
  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    onChange(next);
  };

  return (
    <div className={cn('flex flex-col gap-2', className)} role="group" aria-label="Выбор магазинов">
      {STORE_OPTIONS.map((store) => {
        const isSelected = selected.includes(store.id);
        return (
          <button
            key={store.id}
            type="button"
            onClick={() => toggle(store.id)}
            aria-pressed={isSelected}
            className={cn(
              'flex items-center gap-3 w-full rounded-[16px] px-4 py-3 text-left',
              'transition-fast cursor-pointer',
              'stroke-glass-gradient',
              isSelected ? 'fill-fakeglass-green' : 'fill-fakeglass-light'
            )}
          >
            <span
              className={cn(
                'h-5 w-5 rounded-full border-2 flex items-center justify-center transition-fast',
                isSelected
                  ? 'border-[var(--ContrastColor)] bg-[var(--ContrastColor)]'
                  : 'border-[rgba(45,74,45,0.3)] bg-transparent'
              )}
            >
              {isSelected && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path
                    d="M1 4l3 3 5-5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span
              className="text-sm font-medium text-[var(--ContrastColor)]"
              style={{ fontFamily: 'Golos Text, sans-serif' }}
            >
              {store.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
