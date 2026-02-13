/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8ff',
          100: '#d9eeff',
          200: '#bce2ff',
          300: '#8ed0ff',
          400: '#59b4ff',
          500: '#3b93ff',
          600: '#1e6ff5',
          700: '#1a5ae1',
          800: '#1c49b6',
          900: '#1c418f',
          950: '#162957',
        },
        surface: {
          50: '#f6f6f8',
          100: '#ececf1',
          200: '#d5d6e0',
          300: '#b1b3c5',
          400: '#878aa5',
          500: '#686c8b',
          600: '#535572',
          700: '#44465d',
          800: '#3b3c4f',
          900: '#343544',
          950: '#0e0e14',
        },
        accent: {
          purple: '#a855f7',
          pink: '#ec4899',
          cyan: '#06b6d4',
          green: '#10b981',
          orange: '#f97316',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 147, 255, 0.15)' },
          '100%': { boxShadow: '0 0 30px rgba(59, 147, 255, 0.3)' },
        },
      },
    },
  },
  plugins: [],
};
