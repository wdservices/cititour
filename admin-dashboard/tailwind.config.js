/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007BFF',
          50: '#E6F3FF',
          100: '#CCE7FF',
          200: '#99CFFF',
          300: '#66B7FF',
          400: '#339FFF',
          500: '#007BFF',
          600: '#0056CC',
          700: '#003D99',
          800: '#002966',
          900: '#001433'
        },
        sidebar: {
          DEFAULT: '#1e293b',
          foreground: '#f8fafc'
        }
      }
    },
  },
  plugins: [],
}