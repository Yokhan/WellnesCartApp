import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useListStore } from '@/stores/listStore';
import { useAuthStore } from '@/stores/authStore';
import MacroSummaryBar from '@/components/MacroSummaryBar';
import BudgetIndicator from '@/components/BudgetIndicator';
import ShoppingListItem from '@/components/ShoppingListItem';
import GlassButton from '@/components/GlassButton';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';
import GlassCard from '@/components/GlassCard';
import type { ShoppingListItem as ListItemType } from '@/stores/listStore';

const CATEGORY_LABELS: Record<string, string> = {
  protein: '🥩 Белок',
  dairy: '🥛 Молочное',
  grains: '🌾 Крупы',
  vegetables: '🥦 Овощи',
  fruits: '🍎 Фрукты',
  other: '🛒 Прочее',
};

const CATEGORY_ORDER = ['protein', 'dairy', 'grains', 'vegetables', 'fruits', 'other'];

function groupByCategory(items: ListItemType[]): Map<string, ListItemType[]> {
  const map = new Map<string, ListItemType[]>();
  for (const item of items) {
    const cat = item.category in CATEGORY_LABELS ? item.category : 'other';
    const existing = map.get(cat) ?? [];
    map.set(cat, [...existing, item]);
  }
  return map;
}

export default function ShoppingListScreen() {
  const navigate = useNavigate();
  const { currentList, isLoading, error, fetchCurrentList, checkItem, generateList, clearError } = useListStore();
  const { user } = useAuthStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    void fetchCurrentList();
  }, [fetchCurrentList]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCurrentList();
    setIsRefreshing(false);
  };

  const handleSwap = (itemId: string) => {
    navigate(`/list/${itemId}/swaps`);
  };

  if (isLoading && !currentList) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" label="Загрузка списка..." />
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1
          className="text-2xl font-light text-[var(--ContrastColor)]"
          style={{ fontFamily: 'Unbounded, sans-serif' }}
        >
          Список
        </h1>
        <button
          type="button"
          onClick={() => void handleRefresh()}
          disabled={isRefreshing}
          className="h-10 w-10 rounded-full fill-fakeglass-light stroke-glass-gradient flex items-center justify-center transition-fast hover:opacity-80"
          aria-label="Обновить список"
        >
          <span
            className="text-lg"
            style={{ display: 'inline-block', animation: isRefreshing ? 'spin 0.8s linear infinite' : 'none' }}
            aria-hidden="true"
          >
            ↻
          </span>
        </button>
      </div>

      {/* Macro + Budget summary */}
      {user && currentList && (
        <div className="flex flex-col gap-3 mb-4">
          <MacroSummaryBar
            proteinG={currentList.totalProteinG}
            proteinTargetG={user.proteinTargetG}
            caloriesKcal={currentList.totalCalories}
            caloriesTargetKcal={user.calorieTargetKcal}
          />
          <BudgetIndicator
            spentRub={currentList.totalCostRub}
            weeklyBudgetRub={user.weeklyBudgetRub}
            compact
          />
        </div>
      )}

      {/* Empty state */}
      {!currentList || currentList.items.length === 0 ? (
        <EmptyState
          icon="🛒"
          title="Список пуст"
          description="Сформируйте список покупок на неделю"
          action={{
            label: 'Сформировать список',
            onClick: () => void generateList(),
          }}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {CATEGORY_ORDER.filter((cat) => {
            const grouped = groupByCategory(currentList.items);
            return grouped.has(cat);
          }).map((cat) => {
            const grouped = groupByCategory(currentList.items);
            const items = grouped.get(cat) ?? [];
            return (
              <GlassCard key={cat} padding="md">
                <h2
                  className="text-sm font-semibold text-[var(--ContrastColor)] opacity-70 mb-1"
                  style={{ fontFamily: 'Golos Text, sans-serif' }}
                >
                  {CATEGORY_LABELS[cat] ?? cat}
                </h2>
                <div>
                  {items.map((item) => (
                    <ShoppingListItem
                      key={item.id}
                      item={item}
                      onCheck={(id, checked) => void checkItem(id, checked)}
                      onSwap={handleSwap}
                    />
                  ))}
                </div>
              </GlassCard>
            );
          })}

          {/* Total */}
          <GlassCard padding="md" className="flex justify-between items-center">
            <span
              className="text-sm text-[var(--ContrastColor)] opacity-60"
              style={{ fontFamily: 'Golos Text, sans-serif' }}
            >
              Итого
            </span>
            <span
              className="text-lg font-bold text-[var(--ContrastColor)]"
              style={{ fontFamily: 'Golos Text, sans-serif' }}
            >
              {Math.round(currentList.totalCostRub)} ₽
            </span>
          </GlassCard>

          <GlassButton
            variant="light"
            onClick={() => navigate('/swaps')}
            className="w-full"
          >
            Посмотреть свопы
          </GlassButton>
        </div>
      )}
    </div>
  );
}
