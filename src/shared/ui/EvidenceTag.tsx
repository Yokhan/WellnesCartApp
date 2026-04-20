import type { JSX } from 'preact';
import type { EvidenceLevel } from '../types';

interface EvidenceTagProps {
  level: EvidenceLevel;
}

const STYLE: Record<EvidenceLevel, { label: string; cls: string; title: string }> = {
  'RCT': {
    label: '[RCT]',
    cls: 'bg-success/15 text-success border-success/30',
    title: 'Randomised Controlled Trial — золотой стандарт доказательности',
  },
  'SR/MA': {
    label: '[SR/MA]',
    cls: 'bg-info/15 text-info border-info/30',
    title: 'Systematic Review / Meta-Analysis — вторичный синтез RCT и когорт',
  },
  'i': {
    label: '[i]',
    cls: 'bg-warning/15 text-warning border-warning/30',
    title: 'Информационный контекст — не основание для решений',
  },
};

export function EvidenceTag({ level }: EvidenceTagProps): JSX.Element {
  const { label, cls, title } = STYLE[level];
  return (
    <span
      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border ${cls}`}
      title={title}
    >
      {label}
    </span>
  );
}
