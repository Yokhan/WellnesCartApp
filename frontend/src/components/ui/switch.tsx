import { cn } from './utils';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

function Switch({ checked, onChange, label, disabled = false, className }: SwitchProps) {
  const handleClick = () => {
    if (!disabled) onChange(!checked);
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          'relative inline-flex h-7 w-12 items-center rounded-full transition-normal',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-green)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          checked
            ? 'bg-[var(--color-accent-green)]'
            : 'bg-[rgba(45,74,45,0.2)]'
        )}
      >
        <span
          className={cn(
            'inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-normal',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
      {label && (
        <span className="text-sm text-[var(--ContrastColor)] select-none">{label}</span>
      )}
    </div>
  );
}

export { Switch };
export type { SwitchProps };
