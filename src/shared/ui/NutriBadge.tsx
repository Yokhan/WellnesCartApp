import type { JSX } from 'preact';
import type { NutriGrade } from '../types';
import { space } from './tokens';

interface NutriBadgeProps {
  grade: NutriGrade;
  size?: 'sm' | 'md' | 'lg';
}

const GRADE_STYLE: Record<NutriGrade, { bg: string; color: string }> = {
  A: { bg: 'rgba(74,124,89,0.12)', color: '#3B6B4A' },
  B: { bg: 'rgba(107,150,56,0.12)', color: '#5A7F2F' },
  C: { bg: 'rgba(139,117,53,0.12)', color: '#8B7535' },
  D: { bg: 'rgba(180,100,40,0.12)', color: '#A05020' },
  E: { bg: 'rgba(160,64,48,0.12)', color: '#A04030' },
};

type Size = 'sm' | 'md' | 'lg';
const SIZES: Record<Size, { w: number; fs: number }> = {
  sm: { w: 24, fs: 11 },
  md: { w: 30, fs: 13 },
  lg: { w: 40, fs: 18 },
};

export function NutriBadge({ grade, size = 'md' }: NutriBadgeProps): JSX.Element {
  const s = SIZES[size];
  const g = GRADE_STYLE[grade];
  return (
    <span
      title={`NutriScore ${grade}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: s.w,
        height: s.w,
        borderRadius: space.radius.md,
        background: g.bg,
        color: g.color,
        fontSize: s.fs,
        fontWeight: 700,
        border: `1px solid ${g.color}26`,
      }}
    >
      {grade}
    </span>
  );
}
