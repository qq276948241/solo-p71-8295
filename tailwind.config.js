/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        cream: {
          50: '#FFFBF5',
          100: '#FFF8F0',
          200: '#FFF0DF',
          300: '#FFE4C7',
        },
        orange: {
          50: '#FFF3EB',
          100: '#FFE4D1',
          200: '#FFC9A3',
          300: '#FFAF75',
          400: '#FF9457',
          500: '#FF8C42',
          600: '#F57C2E',
          700: '#E06A1C',
        },
        sage: {
          400: '#7FC49A',
          500: '#68B684',
          600: '#52A56F',
        },
        sky: {
          400: '#9CC8E0',
          500: '#7FB3D5',
          600: '#669FC4',
        },
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(255, 140, 66, 0.08)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
