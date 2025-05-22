/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f8fa',
          100: '#e2edf3',
          200: '#c5dbe6',
          300: '#9bc0d4',
          400: '#699fb9',
          500: '#4d839d',
          600: '#3d6a84',
          700: '#33566c',
          800: '#2d4a5c',
          900: '#0a1929',
        },
        accent: {
          50: '#fffbeb',
          100: '#fff3c4',
          200: '#ffe985',
          300: '#ffd646',
          400: '#ffc107', // Main accent
          500: '#eaa900',
          600: '#cb8e00',
          700: '#a26b00',
          800: '#855500',
          900: '#6f4700',
        },
        highlight: {
          50: '#fff1f1',
          100: '#ffe1e1',
          200: '#ffc7c7',
          300: '#ff9e9e',
          400: '#ff6b6b',
          500: '#fa3e3e',
          600: '#e71d1d',
          700: '#c21515',
          800: '#a01616',
          900: '#841a1a',
        },
      },
      fontFamily: {
        'heading': ['"Playfair Display"', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};