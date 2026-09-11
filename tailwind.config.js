/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050608',
          900: '#090B10',
          800: '#12151C',
          700: '#1B1F29',
          600: '#282E3B',
        },
        mist: {
          400: '#5C637A',
          300: '#8890A3',
          200: '#B4B9C7',
          100: '#E8EAF0',
        },
        signal: {
          DEFAULT: '#7C5CFF',
          dim: '#5F42D9',
          glow: '#A896FF',
        },
        amber: {
          DEFAULT: '#FFB454',
          dim: '#E0993D',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
