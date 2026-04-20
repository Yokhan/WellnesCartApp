import type { JSX } from 'preact';
import { useLocation } from 'wouter-preact';
import { C, ff, space } from './tokens';

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
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: C.card,
      borderTop: `1px solid ${C.bdr}`,
      zIndex: 30,
    }}>
      <div style={{ maxWidth: space.maxWidth, margin: '0 auto', display: 'flex' }}>
        {ITEMS.map((it) => {
          const active = location.startsWith(it.path);
          return (
            <button
              key={it.path}
              onClick={() => navigate(it.path)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px 0',
                gap: 2,
                color: active ? C.accent : C.muted,
                transition: 'color .2s',
                fontFamily: ff.sans,
              }}
            >
              <span style={{ fontSize: 20 }}>{it.icon}</span>
              <span style={{ fontSize: 11 }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
