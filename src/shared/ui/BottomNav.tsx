import type { JSX } from 'preact';
import { useLocation } from 'wouter-preact';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const ITEMS: NavItem[] = [
  { path: '/list', label: 'Список', icon: '📋' },
  { path: '/profile', label: 'Профиль', icon: '👤' },
];

export function BottomNav(): JSX.Element {
  const [location, navigate] = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-30">
      <div className="max-w-xl mx-auto flex">
        {ITEMS.map((it) => {
          const active = location.startsWith(it.path);
          return (
            <button
              key={it.path}
              onClick={() => navigate(it.path)}
              className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors ${
                active ? 'text-accent' : 'text-text-muted'
              }`}
            >
              <span className="text-xl">{it.icon}</span>
              <span className="text-[11px]">{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
