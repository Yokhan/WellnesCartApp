export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        main: 'var(--MainColor)',
        contrast: 'var(--ContrastColor)',
        'flat-white': 'var(--flat-white)',
        text: {
          primary: 'var(--ContrastColor)',
          white: 'var(--flat-white)',
        },
        green: {
          accent: 'var(--color-accent-green)',
        },
        orange: {
          accent: 'var(--color-accent-orange)',
        },
        red: {
          accent: 'var(--color-accent-red)',
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
        },
      },
      fontFamily: {
        unbounded: ['Unbounded', 'sans-serif'],
        golos: ['Golos Text', 'sans-serif'],
      },
      borderRadius: {
        glass: 'var(--CornerRadius, 24px)',
      },
    },
  },
  plugins: [],
};
