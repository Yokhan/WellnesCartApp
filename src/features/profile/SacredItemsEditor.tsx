import type { JSX } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import type { Product, UserProfile } from '../../shared/types';
import { Card, Chip } from '../../shared/ui';
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
      <h3 className="text-sm text-text-muted mb-2">Не трогать (sacred items)</h3>
      <p className="text-xs text-text-muted mb-3">
        Любимые продукты, которые никогда не предлагаем заменить. Никаких запретов — только твой контроль.
      </p>

      {profile.sacred_items.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
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
        placeholder="Поиск по каталогу…"
        className="w-full bg-surface-alt border border-border rounded-md px-3 py-2 text-sm mb-2"
      />
      <div className="max-h-48 overflow-y-auto space-y-1">
        {filtered.map((p) => {
          const added = profile.sacred_items.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                added ? 'bg-warning/10 text-warning' : 'hover:bg-surface-alt'
              }`}
            >
              <span className="mr-2">{p.image_emoji}</span>
              {p.name}
              {added && <span className="ml-2 text-xs">(в списке)</span>}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
