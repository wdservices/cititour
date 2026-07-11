/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF7F1',
        ink: '#1C1710',
        marigold: {
          DEFAULT: '#D9891F',
          light: '#F2A93B',
          dark: '#A9670F',
        },
        coral: {
          DEFAULT: '#D9422E',
          light: '#E85B45',
        },
        palm: {
          DEFAULT: '#146B5E',
          light: '#1B7A6E',
        },
        sand: {
          50: '#FAF7F1',
          100: '#F2EDE1',
          200: '#E8E0D4',
          300: '#D6CAB6',
          400: '#B8A889',
          500: '#8F7F5F',
        },
        // Semantic aliases for legacy classes
        primary: {
          DEFAULT: '#D9891F',
          50:  '#FBF3E4',
          100: '#F7E5C4',
          200: '#F0CB88',
          300: '#E9B14D',
          400: '#DE9B2C',
          500: '#D9891F',
          600: '#B6711A',
          700: '#8C5713',
          800: '#63400D',
          900: '#3B2607',
        },
        sidebar: {
          DEFAULT: '#1C1710',
          foreground: '#F4EFE6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'Fraunces', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 24px rgba(28, 23, 16, 0.08)',
        soft: '0 4px 20px rgba(28, 23, 16, 0.06)',
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
