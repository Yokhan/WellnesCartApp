import type { JSX } from 'preact';
import { useLocation } from 'wouter-preact';
import type { ShoppingListItem, ShoppingList } from '../../shared/types';
import { NutriBadge, NOVABadge, Tag, SwipeRow } from '../../shared/ui';
import { C, ff, space } from '../../shared/ui/tokens';
import { formatRub, formatGrams } from '../../shared/format';
import { activeListSignal, persistList } from '../../shared/state';
import { api } from '../../data';

interface Props {
  item: ShoppingListItem;
  list: ShoppingList;
}

export function ListItemRow({ item, list }: Props): JSX.Element {
  const [, navigate] = useLocation();
  const hasWarnings = item.gate.warnings.length > 0;
  const pricePerProtein = item.value.price_per_protein_g;

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
    <SwipeRow
      onSwipeLeft={onSwipeLeft}
      leftAction={item.is_sacred ? '🔒' : '🗑 удалить'}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: space.padding.inner,
        opacity: item.checked ? 0.5 : 1,
      }}>
        {/* Checkbox */}
        <button
          onClick={onToggle}
          aria-label="Отметить"
          style={{
            width: 24,
            height: 24,
            flexShrink: 0,
            borderRadius: '50%',
            border: `2px solid ${item.checked ? C.accent : C.bdr}`,
            background: item.checked ? C.accent : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {item.checked && (
            <span style={{ color: C.card, fontSize: 12, fontWeight: 700 }}>
              ✓
            </span>
          )}
        </button>

        {/* Main content — clickable */}
        <button
          onClick={openDetail}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            textAlign: 'left',
            minWidth: 0,
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            color: 'inherit',
            font: 'inherit',
          }}
        >
          {/* Emoji */}
          <span style={{ fontSize: 22, flexShrink: 0 }}>
            {item.product.image_emoji}
          </span>

          {/* Name + meta */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: ff.sans,
              fontWeight: 500,
              fontSize: 14,
              color: C.text,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textDecoration: item.checked ? 'line-through' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              {item.product.name}
              {item.is_sacred && (
                <Tag color={C.amber} bg={C.amberBg}>Любимое</Tag>
              )}
              {hasWarnings && (
                <span
                  title={item.gate.warnings.join(', ')}
                  style={{
                    display: 'inline-block',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: C.amber,
                    flexShrink: 0,
                  }}
                />
              )}
            </div>
            <div style={{
              fontSize: 12,
              color: C.muted,
              marginTop: 2,
            }}>
              {formatGrams(item.product.weight_g)} · {item.product.store}
            </div>
          </div>

          {/* Right side: badges + price */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 4,
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', gap: 4 }}>
              <NutriBadge grade={item.product.nutriscore_grade} size="sm" />
              <NOVABadge nova={item.product.nova_class} />
            </div>
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              fontFamily: ff.sans,
              color: C.text,
            }}>
              {formatRub(item.product.price_rub)}
            </span>
            <span style={{
              fontSize: 11,
              fontFamily: ff.mono,
              color: C.muted,
            }}>
              {pricePerProtein > 0
                ? `${pricePerProtein.toFixed(1)} ₽/г белка`
                : '—'}
            </span>
          </div>
        </button>
      </div>
    </SwipeRow>
  );
}
