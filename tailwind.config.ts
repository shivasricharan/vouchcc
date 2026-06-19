import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a0f1e',
          800: '#0d1530',
          700: '#111d40',
          600: '#162050',
        },
        accent: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
          light: '#3b82f6',
        },
        gold: '#f59e0b',
        'th-page':     'var(--th-page)',
        'th-surface':  'var(--th-surface)',
        'th-elevated': 'var(--th-elevated)',
        'th-heading':  'var(--th-heading)',
        'th-body':     'var(--th-body)',
        'th-muted':    'var(--th-muted)',
        'th-faint':    'var(--th-faint)',
        'th-border':   'var(--th-border)',
        'th-hover':    'var(--th-hover)',
        'th-input':    'var(--th-input)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
