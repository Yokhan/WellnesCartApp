import { cn } from './ui/utils';

interface IndulgenceTagProps {
  className?: string;
  size?: 'sm' | 'md';
}

export default function IndulgenceTag({ className, size = 'sm' }: IndulgenceTagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-[rgba(45,74,45,0.2)]',
        'bg-[rgba(45,74,45,0.06)] text-[var(--ContrastColor)] opacity-70',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
        className
      )}
      style={{ fontFamily: 'Golos Text, sans-serif' }}
      title="Запланированное удовольствие — не блокируется"
      aria-label="Запланировано"
    >
      <span aria-hidden="true">🎯</span>
      Запланировано
    </span>
  );
}
