/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'outfit': ['Outfit', 'sans-serif'],
        'gloock': ['Gloock', 'serif'],
        'bricolage': ['Bricolage Grotesque', 'sans-serif'],
        'special-elite': ['"Special Elite"', 'cursive'],
        'roboto': ['Roboto', 'sans-serif'],
        'permanent-marker': ['"Permanent Marker"', 'cursive'],
        'playfair': ['"Playfair Display"', 'serif']
      },
      colors: {
        'beach-yellow': '#FFE664',
        'beach-pink': '#FFF5F5',
        'beach-purple': '#201258',
        'beach-mint': '#dcfce7',
        'deep-purple': '#2D1B69',
        'neon-green': '#ADFF00'
      }
    },
  },
  plugins: [],
}