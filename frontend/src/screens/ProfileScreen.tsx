import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';
import GlassCard from '@/components/GlassCard';
import GlassButton from '@/components/GlassButton';
import IndulgenceTag from '@/components/IndulgenceTag';
import { Avatar, Separator } from '@/components/ui';
import { GOAL_OPTIONS } from '@/design-system/tokens';

function formatRub(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const {
    indulgences,
    fetchIndulgences,
    removeIndulgence,
    isLoading,
  } = useProfileStore();

  useEffect(() => {
    void fetchIndulgences();
  }, [fetchIndulgences]);

  const handleRemoveIndulgence = async (productId: string) => {
    await removeIndulgence(productId);
    toast.success('Удалено из запланированных');
  };

  const goalLabel = GOAL_OPTIONS.find((o) => o.id === user?.goal)?.label ?? user?.goal ?? '—';

  return (
    <div className="page-content">
      {/* Header */}
      <h1
        className="text-2xl font-light text-[var(--ContrastColor)] mb-6"
        style={{ fontFamily: 'Unbounded, sans-serif' }}
      >
        Профиль
      </h1>

      {/* User info */}
      <GlassCard padding="lg" className="mb-4">
        <div className="flex items-center gap-4 mb-4">
          <Avatar name={user?.name ?? 'User'} size="lg" />
          <div>
            <p
              className="text-lg font-semibold text-[var(--ContrastColor)]"
              style={{ fontFamily: 'Golos Text, sans-serif' }}
            >
              {user?.name ?? 'Пользователь'}
            </p>
            <p
              className="text-sm text-[var(--ContrastColor)] opacity-50"
              style={{ fontFamily: 'Golos Text, sans-serif' }}
            >
              Telegram ID: {user?.telegramId ?? '—'}
            </p>
          </div>
        </div>

        <Separator className="mb-4" />

        <div className="flex flex-col gap-3">
          <ProfileRow label="Цель" value={goalLabel} />
          <ProfileRow
            label="Недельный бюджет"
            value={user?.weeklyBudgetRub ? formatRub(user.weeklyBudgetRub) : '—'}
          />
          <ProfileRow
            label="Белок / день"
            value={user?.proteinTargetG ? `${user.proteinTargetG} г` : '—'}
          />
          <ProfileRow
            label="Калории / день"
            value={user?.calorieTargetKcal ? `${user.calorieTargetKcal} ккал` : '—'}
          />
          <ProfileRow
            label="Магазины"
            value={user?.stores && user.stores.length > 0 ? user.stores.join(', ') : '—'}
          />
        </div>
      </GlassCard>

      {/* Planned indulgences */}
      <GlassCard padding="md" className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <h2
            className="text-sm font-semibold text-[var(--ContrastColor)]"
            style={{ fontFamily: 'Golos Text, sans-serif' }}
          >
            Запланированные
          </h2>
          <IndulgenceTag />
        </div>

        {isLoading ? (
          <p
            className="text-xs text-[var(--ContrastColor)] opacity-50 py-2"
            style={{ fontFamily: 'Golos Text, sans-serif' }}
          >
            Загрузка...
          </p>
        ) : indulgences.length === 0 ? (
          <p
            className="text-xs text-[var(--ContrastColor)] opacity-50 py-2"
            style={{ fontFamily: 'Golos Text, sans-serif' }}
          >
            Нет запланированных продуктов. Любимые товары не блокируются — просто отметьте их.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {indulgences.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between py-2 border-b border-[rgba(45,74,45,0.08)] last:border-b-0"
              >
                <div>
                  <p
                    className="text-sm font-medium text-[var(--ContrastColor)]"
                    style={{ fontFamily: 'Golos Text, sans-serif' }}
                  >
                    {item.productName}
                  </p>
                  <p
                    className="text-xs text-[var(--ContrastColor)] opacity-50"
                    style={{ fontFamily: 'Golos Text, sans-serif' }}
                  >
                    {item.brandName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleRemoveIndulgence(item.productId)}
                  className="text-xs text-[var(--color-accent-red)] hover:opacity-70 transition-fast"
                  aria-label={`Удалить ${item.productName} из запланированных`}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Logout */}
      <GlassButton
        variant="red"
        onClick={logout}
        className="w-full"
      >
        Выйти
      </GlassButton>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span
        className="text-sm text-[var(--ContrastColor)] opacity-60"
        style={{ fontFamily: 'Golos Text, sans-serif' }}
      >
        {label}
      </span>
      <span
        className="text-sm font-medium text-[var(--ContrastColor)]"
        style={{ fontFamily: 'Golos Text, sans-serif' }}
      >
        {value}
      </span>
    </div>
  );
}
