import type { JSX } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import type { ProductDetail } from '../../shared/types';
import {
  Button, Card, Chip, Disclaimer, EvidenceTag, NutriBadge,
} from '../../shared/ui';
import { formatRub, formatGrams, formatPerProtein, formatPer100Kcal } from '../../shared/format';
import { userProfileSignal, activeListSignal } from '../../shared/state';
import { api } from '../../data';
import { AlternativesCarousel } from './AlternativesCarousel';

interface Props {
  productId: string;
}

export function ProductDetailScreen({ productId }: Props): JSX.Element {
  const [, navigate] = useLocation();
  const profile = userProfileSignal.value;
  const list = activeListSignal.value;
  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [alts, setAlts] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    setLoading(true);
    Promise.all([
      api.getProductById(productId, profile),
      api.getProductSwaps(productId, profile).catch(() => []),
    ]).then(([d, a]) => {
      setDetail(d);
      setAlts(a);
      setLoading(false);
    });
  }, [productId, profile]);

  if (loading || !detail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-muted">Загрузка…</div>
      </div>
    );
  }

  const gateColor = detail.gate.gate_tier === 0
    ? 'success'
    : detail.gate.gate_tier === 1 ? 'danger'
    : detail.gate.gate_tier === 3 ? 'warning' : 'info';

  return (
    <div className="min-h-screen bg-bg pb-20">
      <div className="max-w-xl mx-auto px-4 pt-4">
        <button
          onClick={() => navigate('/list')}
          className="text-text-muted hover:text-text text-sm mb-2"
        >
          ← К списку
        </button>

        <div className="flex items-start gap-4 mb-5">
          <span className="text-6xl">{detail.image_emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-text-muted">{detail.store}</div>
            <h1 className="text-xl font-bold">{detail.name}</h1>
            <div className="text-sm text-text-muted mt-1">
              {formatGrams(detail.weight_g)} · {formatRub(detail.price_rub)}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <NutriBadge grade={detail.nutriscore_grade} size="md" />
              <EvidenceTag level={detail.evidence} />
            </div>
          </div>
        </div>

        <Card className="mb-3">
          <h3 className="text-sm text-text-muted mb-2">Состав на 100 г</h3>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div><div className="text-text-muted">Ккал</div><div className="font-bold text-sm">{detail.nutrients_per_100g.calories_kcal}</div></div>
            <div><div className="text-text-muted">Белки</div><div className="font-bold text-sm text-accent">{detail.nutrients_per_100g.protein_g} г</div></div>
            <div><div className="text-text-muted">Жиры</div><div className="font-bold text-sm">{detail.nutrients_per_100g.fat_g} г</div></div>
            <div><div className="text-text-muted">Углев.</div><div className="font-bold text-sm">{detail.nutrients_per_100g.carbs_g} г</div></div>
          </div>
        </Card>

        <Card className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-text-muted">Quality Gate</h3>
            <Chip color={gateColor}>
              {detail.gate.gate_passed ? 'Прошёл' : 'Заблокирован'}
            </Chip>
          </div>
          {detail.gate.reasons.length > 0 && (
            <div className="mb-2">
              <div className="text-xs text-text-muted mb-1">Причины блокировки:</div>
              <div className="flex flex-wrap gap-1">
                {detail.gate.reasons.map((r) => (
                  <Chip key={r} color="danger">{r}</Chip>
                ))}
              </div>
            </div>
          )}
          {detail.gate.warnings.length > 0 && (
            <div>
              <div className="text-xs text-text-muted mb-1">Осторожно:</div>
              <div className="flex flex-wrap gap-1">
                {detail.gate.warnings.map((w) => (
                  <Chip key={w} color="warning">{w}</Chip>
                ))}
              </div>
            </div>
          )}
          {detail.gate.reasons.length === 0 && detail.gate.warnings.length === 0 && (
            <p className="text-sm text-success">Без замечаний.</p>
          )}
        </Card>

        <Card className="mb-4">
          <h3 className="text-sm text-text-muted mb-2">Value (для твоего профиля)</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-surface-alt rounded-md p-2">
              <div className="text-xs text-text-muted">₽/г белка</div>
              <div className="font-semibold">{formatPerProtein(detail.price_rub, (detail.weight_g / 100) * detail.nutrients_per_100g.protein_g)}</div>
            </div>
            <div className="bg-surface-alt rounded-md p-2">
              <div className="text-xs text-text-muted">₽/100 ккал</div>
              <div className="font-semibold">{formatPer100Kcal(detail.price_rub, (detail.weight_g / 100) * detail.nutrients_per_100g.calories_kcal)}</div>
            </div>
            <div className="col-span-2 bg-accent/10 border border-accent/30 rounded-md p-2">
              <div className="text-xs text-text-muted">Composite Score</div>
              <div className="font-bold text-accent">{(detail.value.composite_score * 100).toFixed(0)}/100</div>
            </div>
          </div>
        </Card>

        {detail.ingredients.length > 0 && (
          <Card className="mb-4">
            <h3 className="text-sm text-text-muted mb-2">Состав</h3>
            <p className="text-sm">{detail.ingredients.join(', ')}</p>
            {detail.e_additives.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {detail.e_additives.map((e) => (
                  <Chip key={e} color="info">{e}</Chip>
                ))}
              </div>
            )}
          </Card>
        )}

        <div className="mb-3">
          <h3 className="text-sm text-text-muted mb-2 px-1">Можно заменить</h3>
          {list && (
            <AlternativesCarousel alternatives={alts} currentId={detail.id} list={list} />
          )}
        </div>

        <Disclaimer tone="info">
          NutriScore — международная система, в России без официального статуса. Используем как ориентир.
          Composite Score — эвристика с дисклеймером, не медицинский инструмент.
        </Disclaimer>

        <div className="mt-4">
          <Button variant="secondary" fullWidth onClick={() => navigate('/list')}>
            Назад к списку
          </Button>
        </div>
      </div>
    </div>
  );
}
