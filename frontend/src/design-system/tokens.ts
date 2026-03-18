/* Design Tokens — TypeScript reference to CSS variables */

export const tokens = {
  colors: {
    main: 'var(--MainColor)',
    contrast: 'var(--ContrastColor)',
    flatWhite: 'var(--flat-white)',
    accent: {
      green: 'var(--color-accent-green)',
      orange: 'var(--color-accent-orange)',
      red: 'var(--color-accent-red)',
    },
    nutriscore: {
      a: 'var(--nutriscore-a)',
      b: 'var(--nutriscore-b)',
      c: 'var(--nutriscore-c)',
      d: 'var(--nutriscore-d)',
      e: 'var(--nutriscore-e)',
    },
    glass: {
      bg: 'var(--FakeGlassBg)',
      border: 'var(--FakeGlassBorder)',
      overlay: 'var(--GlassOverlayColor)',
    },
  },
  typography: {
    fontDisplay: 'var(--font-display)',
    fontBody: 'var(--font-body)',
  },
  spacing: {
    xs: 'var(--spacing-xs)',
    sm: 'var(--spacing-sm)',
    md: 'var(--spacing-md)',
    lg: 'var(--spacing-lg)',
    xl: 'var(--spacing-xl)',
    '2xl': 'var(--spacing-2xl)',
  },
  radius: {
    corner: 'var(--CornerRadius)',
    button: 'var(--ButtonRadius)',
  },
  shadow: {
    glass: 'var(--FakeGlassShadow)',
  },
} as const;

export type NutriScoreGrade = 'A' | 'B' | 'C' | 'D' | 'E';
export type NovaGroup = 1 | 2 | 3 | 4;
export type UserGoal = 'cut' | 'bulk' | 'maintain' | 'recomp';
export type ListStatus = 'draft' | 'active' | 'completed';
export type SwapReason = 'better_nutriscore' | 'better_price' | 'best_overall';
export type ButtonVariant = 'light' | 'green' | 'red' | 'dark';

export const NUTRISCORE_COLORS: Record<NutriScoreGrade, string> = {
  A: '#038141',
  B: '#85bb2f',
  C: '#fecb02',
  D: '#ee8100',
  E: '#e63e11',
};

export const NUTRISCORE_TEXT_COLOR: Record<NutriScoreGrade, 'white' | 'black'> = {
  A: 'white',
  B: 'white',
  C: 'black',
  D: 'white',
  E: 'white',
};

export const STORE_OPTIONS = [
  { id: 'pyaterochka', label: 'Пятёрочка' },
  { id: 'perekrestok', label: 'Перекрёсток' },
  { id: 'vkusvill', label: 'ВкусВилл' },
  { id: 'magnit', label: 'Магнит' },
] as const;

export const GOAL_OPTIONS: Array<{ id: UserGoal; label: string; description: string }> = [
  { id: 'cut', label: 'Сушка', description: 'Снижение жира при сохранении мышц' },
  { id: 'bulk', label: 'Масса', description: 'Набор мышечной массы' },
  { id: 'maintain', label: 'Поддержание', description: 'Удержание текущего веса и состава' },
  { id: 'recomp', label: 'Рекомпозиция', description: 'Одновременное снижение жира и набор мышц' },
];
