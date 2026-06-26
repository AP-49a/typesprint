/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dynamic colors linked to settings
        theme: {
          bg: 'rgb(var(--color-bg) / <alpha-value>)',
          main: 'rgb(var(--color-main) / <alpha-value>)',
          sub: 'rgb(var(--color-sub) / <alpha-value>)',
          text: 'rgb(var(--color-text) / <alpha-value>)',
          error: 'rgb(var(--color-error) / <alpha-value>)',
          correct: 'rgb(var(--color-correct) / <alpha-value>)',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'blink': 'blink 1s infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
