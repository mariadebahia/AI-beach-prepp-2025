/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'beach-pink': '#ffe5fb',
        'beach-yellow': '#ffd93a',
        'beach-purple': '#6d1862',
        'deep-purple': '#2D1B69',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['League Spartan', 'sans-serif'],
        heading: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
        bitter: ['Bitter', 'serif'],
        gloock: ['Gloock', 'serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      fontSize: {
        'h1': ['5rem', { lineHeight: '1.2' }], // 80px
        'h2': ['3.75rem', { lineHeight: '1.2' }], // 60px
        'h3': ['2.5rem', { lineHeight: '1.2' }], // 40px
        'h5': ['1.375rem', { lineHeight: '1.5' }], // 22px
        'body': ['1.125rem', { lineHeight: '1.5' }], // 18px
      }
    },
  },
  plugins: [],
};