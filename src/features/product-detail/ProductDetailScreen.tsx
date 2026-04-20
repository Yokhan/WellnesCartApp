import type { JSX } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import type { ProductDetail } from '../../shared/types';
import {
  Button, Card, Callout, Chip, Disclaimer, EvidenceTag, H2, H3, Label,
  NutriBadge, NOVABadge, ConvenienceBadge, ScoreBreakdown, Tag,
} from '../../shared/ui';
import { C, ff, space } from '../../shared/ui/tokens';
import { formatRub, formatGrams, formatPerProtein, formatPer100Kcal } from '../../shared/format';
import { userProfileSignal, activeListSignal } from '../../shared/state';
import { api } from '../../data';
import { AlternativesCarousel } from './AlternativesCarousel';

const WEIGHTS = {
  low:  { ns: 0.25, price: 0.55, deficit: 0.20 },
  med:  { ns: 0.35, price: 0.35, deficit: 0.30 },
  high: { ns: 0.45, price: 0.15, deficit: 0.40 },
};

const GATE_TRANSLATIONS: Record<string, string> = {
  'NutriScore D':                  'Невысокое качество состава (NutriScore D)',
  'NutriScore E':                  'Низкое качество состава (NutriScore E)',
  'NOVA-4 + низкий NutriScore':    'Высокая степень обработки при невысоком качестве',
  'Трансжиры':                     'Повышенное содержание трансжиров',
};

function translateGateReason(raw: string): string {
  return GATE_TRANSLATIONS[raw] ?? raw;
}

interface Props { productId: string }

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
    ]).then(([d, a]) => { setDetail(d); setAlts(a); setLoading(false); });
  }, [productId, profile]);

  if (loading || !detail) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg }}>
        <span style={{ color: C.muted, fontFamily: ff.sans }}>Загрузка...</span>
      </div>
    );
  }

  const n = detail.nutrients_per_100g;
  const tier = profile?.budget_tier ?? 'med';
  const weights = WEIGHTS[tier];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, paddingBottom: 80, fontFamily: ff.sans }}>
      <div style={{ maxWidth: space.maxWidth, margin: '0 auto', padding: space.pagePad, paddingTop: 16 }}>
        <button onClick={() => navigate('/list')} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 14, cursor: 'pointer', marginBottom: 8, padding: 0 }}>
          ← К списку
        </button>

        {/* HERO */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: space.gap.normal, marginBottom: space.gap.wide }}>
          <span style={{ fontSize: 56, lineHeight: 1 }}>{detail.image_emoji}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Label style={{ color: C.muted }}>{detail.store}</Label>
            <h1 style={{ fontFamily: ff.serif, fontSize: 22, fontWeight: 700, color: C.text, margin: '4px 0 6px' }}>{detail.name}</h1>
            <div style={{ fontSize: 14, color: C.mid, marginBottom: 8 }}>
              {formatGrams(detail.weight_g)} · {formatRub(detail.price_rub)}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              <NutriBadge grade={detail.nutriscore_grade} size="md" />
              <NOVABadge nova={detail.nova_class} />
              <ConvenienceBadge tier={detail.convenience_tier} />
            </div>
          </div>
        </div>

        {/* NUTRIENTS TABLE */}
        <NutrientsTable n={n} />

        {/* NOVA CLASS */}
        <Card style={{ marginBottom: space.gap.base }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <H3>Степень обработки</H3>
            <NOVABadge nova={detail.nova_class} showLabel />
          </div>
          <NovaExplanation nova={detail.nova_class} />
        </Card>

        {/* COMPOSITE SCORE */}
        <div style={{ marginBottom: space.gap.base }}>
          <ScoreBreakdown score={detail.value.composite_score} weights={weights} budgetTier={tier} />
        </div>

        {/* QUALITY GATE */}
        <QualityGateBlock gate={detail.gate} />

        {/* INGREDIENTS */}
        {detail.ingredients.length > 0 && (
          <Card style={{ marginBottom: space.gap.base }}>
            <H3>Состав</H3>
            <p style={{ fontSize: 13, color: C.mid, lineHeight: 1.6, margin: '8px 0' }}>{detail.ingredients.join(', ')}</p>
            {detail.e_additives.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                {detail.e_additives.map((e) => <Tag key={e}>{e}</Tag>)}
              </div>
            )}
          </Card>
        )}

        {/* ALTERNATIVES */}
        <H3 style={{ marginBottom: 8 }}>Можно заменить</H3>
        {list && <AlternativesCarousel alternatives={alts} currentProduct={detail} list={list} />}

        <div style={{ marginTop: space.gap.normal }}>
          <Disclaimer tone="info">
            NutriScore — международная система, в России без официального статуса. Используем как ориентир.
            Composite Score — эвристика, не медицинский инструмент.
          </Disclaimer>
        </div>

        <div style={{ marginTop: space.gap.normal }}>
          <Button variant="secondary" fullWidth onClick={() => navigate('/list')}>Назад к списку</Button>
        </div>
      </div>
    </div>
  );
}

/* --- Sub-components --- */

function NutrientsTable({ n }: { n: ProductDetail['nutrients_per_100g'] }): JSX.Element {
  const sodiumColor = n.sodium_g > 2.5 ? '#A04030' : n.sodium_g > 1.5 ? C.amber : C.text;
  const transColor = n.trans_fat_g > 0.5 ? C.amber : C.text;
  const rows: Array<[string, string, string?]> = [
    ['Ккал', `${n.calories_kcal}`],
    ['Белки', `${n.protein_g} г`],
    ['Жиры', `${n.fat_g} г`],
    ['  нас. жиры', `${n.saturated_fat_g} г`],
    ['  трансжиры', `${n.trans_fat_g} г`, transColor],
    ['Углеводы', `${n.carbs_g} г`],
    ['  сахар', `${n.sugar_g} г`],
    ['Клетчатка', `${n.fiber_g} г`],
    ['Натрий', `${n.sodium_g} г`, sodiumColor],
  ];
  return (
    <Card style={{ marginBottom: space.gap.base }}>
      <H3>Состав на 100 г</H3>
      <div style={{ marginTop: 10 }}>
        {rows.map(([label, val, color]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: `1px solid ${C.bdr}40`, fontSize: 13 }}>
            <span style={{ color: label.startsWith('  ') ? C.muted : C.mid }}>{label}</span>
            <span style={{ fontWeight: 600, color: (color as string) ?? C.text, fontFamily: ff.mono, fontSize: 12 }}>{val}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

const NOVA_TEXT: Record<number, string> = {
  1: 'Необработанный или минимально обработанный продукт. Лучший выбор.',
  2: 'Обработанный кулинарный ингредиент (масло, соль, сахар).',
  3: 'Переработанный продукт — консервирование, копчение, ферментация.',
  4: 'Ультрапереработанный: промышленные добавки, красители, ароматизаторы.',
};

function NovaExplanation({ nova }: { nova: 1 | 2 | 3 | 4 }): JSX.Element {
  return <p style={{ fontSize: 13, color: C.mid, lineHeight: 1.55, margin: 0 }}>{NOVA_TEXT[nova]}</p>;
}

function QualityGateBlock({ gate }: { gate: ProductDetail['gate'] }): JSX.Element {
  const passed = gate.gate_passed;
  const accentColor = passed ? C.green : C.accent;
  return (
    <Card accentColor={accentColor} style={{ marginBottom: space.gap.base }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <H3>Quality Gate</H3>
        <Chip color={passed ? 'success' : 'danger'}>{passed ? 'Прошёл' : 'Заблокирован'}</Chip>
      </div>
      {gate.reasons.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <Label style={{ color: C.muted, marginBottom: 4 }}>Причины блокировки:</Label>
          {gate.reasons.map((r) => (
            <Callout key={r} color={C.accent} style={{ marginTop: 4 }}>{translateGateReason(r)}</Callout>
          ))}
        </div>
      )}
      {gate.warnings.length > 0 && (
        <div>
          <Label style={{ color: C.muted, marginBottom: 4 }}>Осторожно:</Label>
          {gate.warnings.map((w) => (
            <Callout key={w} color={C.amber} style={{ marginTop: 4 }}>{translateGateReason(w)}</Callout>
          ))}
        </div>
      )}
      {gate.reasons.length === 0 && gate.warnings.length === 0 && (
        <p style={{ fontSize: 13, color: C.green, margin: 0 }}>Без замечаний.</p>
      )}
    </Card>
  );
}
