import React from 'react';
import { cn } from './utils';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

function Dialog({ open, onClose, children, className }: DialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative w-full max-w-[428px] animate-slide-up',
          'fake-glass rounded-t-[var(--CornerRadius,24px)] p-6',
          'pb-[max(24px,env(safe-area-inset-bottom))]',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

interface DialogHeaderProps {
  title: string;
  onClose?: () => void;
}

function DialogHeader({ title, onClose }: DialogHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2
        className="text-lg font-semibold text-[var(--ContrastColor)]"
        style={{ fontFamily: 'Golos Text, sans-serif' }}
      >
        {title}
      </h2>
      {onClose && (
        <button
          onClick={onClose}
          className="text-[var(--ContrastColor)] opacity-50 hover:opacity-80 transition-fast p-1"
          aria-label="Закрыть"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export { Dialog, DialogHeader };
export type { DialogProps };
