import type { JSX } from 'preact';
import { useLocation } from 'wouter-preact';
import type { ProductDetail, ShoppingList } from '../../shared/types';
import { Card, NutriBadge, NOVABadge, Num, DeltaChip, Tag, Button } from '../../shared/ui';
import { C, ff, space } from '../../shared/ui/tokens';
import { formatRub } from '../../shared/format';
import { activeListSignal, persistList } from '../../shared/state';
import { api } from '../../data';

interface Props {
  alternatives: ProductDetail[];
  currentProduct: ProductDetail;
  list: ShoppingList | null;
}

function computeReasonTag(alt: ProductDetail, current: ProductDetail): { label: string; color: string; bg: string } {
  const priceDelta = alt.price_rub - current.price_rub;
  const proteinDelta = alt.nutrients_per_100g.protein_g - current.nutrients_per_100g.protein_g;
  const scoreDelta = alt.value.composite_score - current.value.composite_score;

  if (priceDelta < -5) return { label: 'Дешевле', color: C.green, bg: C.greenBg };
  if (proteinDelta > 1) return { label: 'Больше белка', color: C.blue, bg: C.blueBg };
  if (scoreDelta > 0.05) return { label: 'Здоровее', color: C.green, bg: C.greenBg };
  return { label: 'Альтернатива', color: C.mid, bg: `${C.mid}0D` };
}

export function AlternativesCarousel({ alternatives, currentProduct, list }: Props): JSX.Element {
  const [, navigate] = useLocation();

  if (alternatives.length === 0) {
    return (
      <Card>
        <p style={{ color: C.muted, fontSize: 13, textAlign: 'center', margin: 0 }}>
          Альтернатив в том же слоте не нашлось.
        </p>
      </Card>
    );
  }

  const pick = async (toId: string) => {
    if (!list) return;
    const inList = list.items.find((it) => it.product_id === currentProduct.id);
    if (!inList) { navigate(`/product/${toId}`); return; }
    if (inList.is_sacred) return;
    const next = await api.applySwap(list, currentProduct.id, toId);
    activeListSignal.value = next;
    persistList(next);
    navigate('/list');
  };

  return (
    <div style={{
      display: 'flex',
      gap: 12,
      overflowX: 'auto',
      paddingBottom: 8,
      scrollSnapType: 'x mandatory',
      marginLeft: -24,
      marginRight: -24,
      paddingLeft: 24,
      paddingRight: 24,
    }}>
      {alternatives.map((alt, idx) => {
        const priceDelta = Math.round(alt.price_rub - currentProduct.price_rub);
        const proteinDelta = +(alt.nutrients_per_100g.protein_g - currentProduct.nutrients_per_100g.protein_g).toFixed(1);
        const reason = computeReasonTag(alt, currentProduct);

        return (
          <div key={alt.id} style={{ scrollSnapAlign: 'start', flexShrink: 0, width: '78%' }}>
            <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Header: rank + name + badges */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                <Num n={idx + 1} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: ff.serif, fontWeight: 600, fontSize: 15, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{alt.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{alt.store} · {formatRub(alt.price_rub)}</div>
                </div>
              </div>

              {/* Badges row */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                <NutriBadge grade={alt.nutriscore_grade} size="sm" />
                <NOVABadge nova={alt.nova_class} />
                <Tag color={reason.color} bg={reason.bg}>{reason.label}</Tag>
              </div>

              {/* Delta chips */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                <DeltaChip value={priceDelta} unit=" ₽" positive="bad" />
                <DeltaChip value={proteinDelta} unit=" г белка" positive="good" />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                <Button variant="ghost" size="sm" onClick={() => navigate(`/product/${alt.id}`)}>
                  Подробнее
                </Button>
                <Button variant="primary" size="sm" onClick={() => pick(alt.id)}>
                  Заменить
                </Button>
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
