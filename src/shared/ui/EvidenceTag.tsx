import type { JSX } from 'preact';
import type { EvidenceLevel } from '../types';
import { C, ff, space } from './tokens';

interface EvidenceTagProps {
  level: EvidenceLevel;
}

const STYLE: Record<EvidenceLevel, { label: string; color: string; bg: string; title: string }> = {
  'RCT': {
    label: '[RCT]',
    color: C.green,
    bg: C.greenBg,
    title: 'Randomised Controlled Trial — золотой стандарт доказательности',
  },
  'SR/MA': {
    label: '[SR/MA]',
    color: C.blue,
    bg: C.blueBg,
    title: 'Systematic Review / Meta-Analysis — вторичный синтез RCT и когорт',
  },
  'i': {
    label: '[i]',
    color: C.amber,
    bg: C.amberBg,
    title: 'Информационный контекст — не основание для решений',
  },
};

export function EvidenceTag({ level }: EvidenceTagProps): JSX.Element {
  const s = STYLE[level];
  return (
    <span
      title={s.title}
      style={{
        display: 'inline-block',
        padding: '2px 6px',
        borderRadius: space.radius.sm,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.color}26`,
        fontFamily: ff.mono,
        fontSize: 10,
        fontWeight: 500,
      }}
    >
      {s.label}
    </span>
  );
}
