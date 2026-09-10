/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: Object.fromEntries(
        [
          'background',
          'surface',
          'border',
          'primary',
          'secondary',
          'accent',
          'hover',
          'subtle',
          'open',
          'progress',
          'resolved',
          'high',
          'on-accent',
        ].map((name) => [name, `rgb(var(--${name}) / <alpha-value>)`]),
      ),
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      boxShadow: { float: '0 12px 48px rgb(0 0 0 / 0.14)' },
    },
  },
  plugins: [],
};
