import type { JSX } from 'preact';
import type { NutriGrade } from '../types';

interface NutriBadgeProps {
  grade: NutriGrade;
  size?: 'sm' | 'md' | 'lg';
}

const GRADE_COLORS: Record<NutriGrade, string> = {
  A: 'bg-[#038141] text-white',
  B: 'bg-[#85BB2F] text-black',
  C: 'bg-[#FECB02] text-black',
  D: 'bg-[#EE8100] text-white',
  E: 'bg-[#E63E11] text-white',
};

const SIZES: Record<NonNullable<NutriBadgeProps['size']>, string> = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-12 h-12 text-xl',
};

export function NutriBadge({ grade, size = 'md' }: NutriBadgeProps): JSX.Element {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-bold ${GRADE_COLORS[grade]} ${SIZES[size]}`}
      title={`NutriScore ${grade}`}
    >
      {grade}
    </span>
  );
}
