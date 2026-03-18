import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { swapsApi } from '@/services/api';
import { useListStore } from '@/stores/listStore';
import GlassCard from '@/components/GlassCard';
import GlassButton from '@/components/GlassButton';
import SwapCard from '@/components/SwapCard';
import NutriScoreBadge from '@/components/NutriScoreBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import type { SwapCandidate } from '@/components/SwapCard';
import type { NutriScoreGrade, NovaGroup, SwapReason } from '@/design-system/tokens';

const VALID_GRADES: NutriScoreGrade[] = ['A', 'B', 'C', 'D', 'E'];
const VALID_NOVA: NovaGroup[] = [1, 2, 3, 4];
const VALID_REASONS: SwapReason[] = ['better_nutriscore', 'better_price', 'best_overall'];

function parseCandidate(raw: Record<string, unknown>): SwapCandidate {
  return {
    id: String(raw.id ?? ''),
    name: String(raw.name ?? ''),
    brandName: String(raw.brandName ?? ''),
    priceRub: Number(raw.priceRub ?? 0),
    pricePerProteinG: typeof raw.pricePerProteinG === 'number' ? raw.pricePerProteinG : undefined,
    nutriScoreGrade: VALID_GRADES.includes(raw.nutriScoreGrade as NutriScoreGrade)
      ? (raw.nutriScoreGrade as NutriScoreGrade)
      : 'C',
    novaGroup: VALID_NOVA.includes(raw.novaGroup as NovaGroup) ? (raw.novaGroup as NovaGroup) : 3,
    compositeScore: Number(raw.compositeScore ?? 0),
    reason: VALID_REASONS.includes(raw.reason as SwapReason)
      ? (raw.reason as SwapReason)
      : 'best_overall',
  };
}

export default function ProductDetailScreen() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const { currentList, applySwap } = useListStore();
  const [candidates, setCandidates] = useState<SwapCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const item = currentList?.items.find((i) => i.id === itemId);

  useEffect(() => {
    if (!itemId) return;

    const load = async () => {
      if (!currentList) return;
      setIsLoading(true);
      try {
        const resp = await swapsApi.getCandidates(currentList.id);
        const rawList = resp.data as unknown as Record<string, unknown>[];
        setCandidates(rawList.slice(0, 3).map(parseCandidate));
      } catch {
        toast.error('Не удалось загрузить замены');
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [itemId, currentList]);

  const handleSwap = async (candidateId: string) => {
    if (!itemId) return;
    try {
      await applySwap(itemId, candidateId);
      toast.success('Товар заменён');
      navigate(-1);
    } catch {
      toast.error('Ошибка при замене');
    }
  };

  if (!item) {
    return (
      <div className="page-content">
        <EmptyState
          icon="🔍"
          title="Товар не найден"
          action={{ label: 'Назад', onClick: () => navigate(-1) }}
        />
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 text-[var(--ContrastColor)] opacity-60 hover:opacity-90 transition-fast"
        style={{ fontFamily: 'Golos Text, sans-serif', fontSize: '14px' }}
      >
        ← Назад
      </button>

      {/* Current item */}
      <GlassCard padding="md" className="mb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p
              className="text-base font-semibold text-[var(--ContrastColor)]"
              style={{ fontFamily: 'Golos Text, sans-serif' }}
            >
              {item.productName}
            </p>
            <p
              className="text-sm text-[var(--ContrastColor)] opacity-60 mt-0.5"
              style={{ fontFamily: 'Golos Text, sans-serif' }}
            >
              {item.brandName} · {item.quantity} шт.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <NutriScoreBadge grade={item.nutriScoreGrade as NutriScoreGrade} size="md" showLabel />
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p
              className="text-lg font-bold text-[var(--ContrastColor)]"
              style={{ fontFamily: 'Golos Text, sans-serif' }}
            >
              {Math.round(item.totalPrice)} ₽
            </p>
            {item.pricePerProteinG > 0 && (
              <p
                className="text-xs mt-0.5"
                style={{ color: 'var(--color-accent-green)', fontFamily: 'Golos Text, sans-serif' }}
              >
                {item.pricePerProteinG.toFixed(1)} ₽/г белка
              </p>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Swap candidates */}
      <h2
        className="text-base font-semibold text-[var(--ContrastColor)] mb-3"
        style={{ fontFamily: 'Golos Text, sans-serif' }}
      >
        Замены
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" label="Ищем лучшие замены..." />
        </div>
      ) : candidates.length === 0 ? (
        <EmptyState
          icon="🔄"
          title="Замены не найдены"
          description="Нет подходящих альтернатив в выбранных магазинах"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {candidates.map((candidate, idx) => (
            <SwapCard
              key={candidate.id}
              candidate={candidate}
              rank={(idx + 1) as 1 | 2 | 3}
              onSwap={(id) => void handleSwap(id)}
            />
          ))}
        </div>
      )}

      {/* Keep current */}
      <GlassButton
        variant="light"
        onClick={() => navigate(-1)}
        className="w-full mt-4"
      >
        Оставить текущий товар
      </GlassButton>
    </div>
  );
}
