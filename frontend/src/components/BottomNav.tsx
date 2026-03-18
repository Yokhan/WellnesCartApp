import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from './ui/utils';

interface NavTab {
  id: string;
  label: string;
  icon: string;
  path: string;
}

const TABS: NavTab[] = [
  { id: 'list', label: 'Список', icon: '🛒', path: '/list' },
  { id: 'swaps', label: 'Свопы', icon: '🔄', path: '/swaps' },
  { id: 'profile', label: 'Профиль', icon: '👤', path: '/profile' },
  { id: 'settings', label: 'Настройки', icon: '⚙️', path: '/settings' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeId = TABS.find((t) => location.pathname.startsWith(t.path))?.id ?? 'list';

  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-32px)] max-w-[396px]"
      aria-label="Навигация"
    >
      <div className="bottom-nav-fakeglass stroke-glass-gradient safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-3">
          {TABS.map((tab) => {
            const isActive = tab.id === activeId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => navigate(tab.path)}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-1 rounded-[16px] relative',
                  'transition-fast cursor-pointer min-w-[56px]',
                  isActive ? 'opacity-100' : 'opacity-50 hover:opacity-70'
                )}
              >
                {isActive && (
                  <span
                    className="absolute -top-1 left-1/2 -translate-x-1/2 h-1 w-5 rounded-full"
                    style={{ background: 'var(--color-accent-green)' }}
                    aria-hidden="true"
                  />
                )}
                <span className="text-xl leading-none" aria-hidden="true">
                  {tab.icon}
                </span>
                <span
                  className={cn(
                    'text-[10px] font-medium text-[var(--ContrastColor)]',
                    isActive && 'font-semibold'
                  )}
                  style={{ fontFamily: 'Golos Text, sans-serif' }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
