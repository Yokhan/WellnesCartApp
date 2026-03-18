import GlassCard from './GlassCard';
import { Progress } from './ui';

interface MacroSummaryBarProps {
  proteinG: number;
  proteinTargetG: number;
  caloriesKcal: number;
  caloriesTargetKcal: number;
  className?: string;
}

function MacroItem({
  label,
  current,
  target,
  unit,
  color,
}: {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-1 flex-1">
      <div className="flex justify-between items-baseline">
        <span
          className="text-xs text-[var(--ContrastColor)] opacity-60"
          style={{ fontFamily: 'Golos Text, sans-serif' }}
        >
          {label}
        </span>
        <span
          className="text-xs font-semibold text-[var(--ContrastColor)]"
          style={{ fontFamily: 'Golos Text, sans-serif' }}
        >
          {Math.round(current)}{unit}
          <span className="opacity-40"> / {Math.round(target)}</span>
        </span>
      </div>
      <Progress value={current} max={target} color={color} size="sm" />
    </div>
  );
}

export default function MacroSummaryBar({
  proteinG,
  proteinTargetG,
  caloriesKcal,
  caloriesTargetKcal,
  className = '',
}: MacroSummaryBarProps) {
  return (
    <GlassCard padding="md" className={className}>
      <h2
        className="text-xs font-semibold text-[var(--ContrastColor)] opacity-60 uppercase tracking-wider mb-3"
        style={{ fontFamily: 'Golos Text, sans-serif' }}
      >
        Макронутриенты недели
      </h2>
      <div className="flex gap-4">
        <MacroItem
          label="Белок"
          current={proteinG}
          target={proteinTargetG}
          unit="г"
          color="var(--color-accent-green)"
        />
        <div className="w-px bg-[rgba(45,74,45,0.12)]" aria-hidden="true" />
        <MacroItem
          label="Калории"
          current={caloriesKcal}
          target={caloriesTargetKcal}
          unit="ккал"
          color="var(--color-accent-orange)"
        />
      </div>
    </GlassCard>
  );
}
