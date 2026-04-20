import type { ComponentChildren, JSX } from 'preact';
import { useState } from 'preact/hooks';
import { C, space } from './tokens';

interface InfoTipProps {
  children: ComponentChildren;
}

export function InfoTip({ children }: InfoTipProps): JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          border: `1px solid ${C.bdr}`,
          background: C.card,
          color: C.muted,
          fontSize: 11,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        i
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: 6,
          padding: space.padding.tight,
          background: C.card,
          border: `1px solid ${C.bdr}`,
          borderRadius: space.radius.lg,
          fontSize: 12,
          color: C.mid,
          lineHeight: 1.5,
          width: 220,
          zIndex: 50,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          {children}
        </div>
      )}
    </span>
  );
}
