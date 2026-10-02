/** @type {import('tailwindcss').Config} */
const c = (v) => `rgb(var(--${v}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: c('bg'),
        panel: c('panel'),
        line: c('line'),
        fg: c('fg'),
        muted: c('muted'),
        accent: c('accent'),
        ok: c('ok'),
        warn: c('warn'),
        key: c('key'),
        hot: c('hot'),
      },
      fontFamily: {
        mono: ['"Courier Prime"', '"Courier New"', 'Courier', 'monospace'],
        sans: ['"Courier Prime"', '"Courier New"', 'Courier', 'monospace'],
      },
    },
  },
  plugins: [],
}
