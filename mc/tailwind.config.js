/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ✅ Enables dark mode via class
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // ✅ Covers all your components/pages
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 1.2s ease-out',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
