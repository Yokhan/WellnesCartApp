import type { JSX } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import type { Product, UserProfile } from '../../shared/types';
import { Card, Chip } from '../../shared/ui';
import { C, ff, space } from '../../shared/ui/tokens';
import { userProfileSignal, persistProfile } from '../../shared/state';
import { api } from '../../data';

interface Props {
  profile: UserProfile;
}

export function SacredItemsEditor({ profile }: Props): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    api.getUniversalProducts().then(setProducts);
  }, []);

  const toggle = async (id: string) => {
    const next_sacred = profile.sacred_items.includes(id)
      ? profile.sacred_items.filter((s) => s !== id)
      : [...profile.sacred_items, id];
    const next = await api.updateProfile(profile, { sacred_items: next_sacred });
    userProfileSignal.value = next;
    persistProfile(next);
  };

  const filtered = q
    ? products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
    : products.slice(0, 10);

  return (
    <Card>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 8, fontFamily: ff.sans }}>
        Любимое 🔒
      </div>
      <p style={{ fontSize: 12, color: C.muted, marginBottom: 12, lineHeight: 1.5 }}>
        Любимые продукты, которые никогда не предлагаем заменить. Никаких запретов — только твой контроль.
      </p>

      {profile.sacred_items.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {profile.sacred_items.map((id) => {
            const p = products.find((x) => x.id === id);
            if (!p) return null;
            return (
              <Chip key={id} onClick={() => toggle(id)} color="warning">
                🔒 {p.name} ×
              </Chip>
            );
          })}
        </div>
      )}

      <input
        type="text"
        value={q}
        onInput={(e) => setQ((e.currentTarget as HTMLInputElement).value)}
        placeholder="Поиск по каталогу..."
        style={{
          width: '100%',
          background: C.bg,
          border: `1px solid ${C.bdr}`,
          borderRadius: space.radius.md,
          padding: '10px 14px',
          fontSize: 14,
          color: C.text,
          fontFamily: ff.sans,
          marginBottom: 8,
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />

      <div style={{ maxHeight: 192, overflowY: 'auto' }}>
        {filtered.map((p) => {
          const added = profile.sacred_items.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px 14px',
                borderRadius: space.radius.md,
                fontSize: 14,
                fontFamily: ff.sans,
                background: added ? C.amberBg : 'transparent',
                color: added ? C.amber : C.text,
                border: 'none',
                cursor: 'pointer',
                display: 'block',
                transition: 'background .15s',
              }}
            >
              <span style={{ marginRight: 8 }}>{p.image_emoji}</span>
              {p.name}
              {added && <span style={{ marginLeft: 8, fontSize: 12, color: C.muted }}>(в списке)</span>}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
