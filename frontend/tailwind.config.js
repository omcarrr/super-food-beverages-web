/** @type {import('tailwindcss').Config} */
//
// Brand theme tokens for Super Foods & Beverages.
// NOTE: The project uses Tailwind CSS v4 (CSS-first config). The canonical
// token definitions live in `src/index.css` under `@theme`. This file mirrors
// those tokens so the palette stays documented/discoverable in one place and
// remains compatible with editors/tooling that read `tailwind.config.js`.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FFF8EC', // base site background (off-white / cream)
          dark: '#F5EBD7', // alt section background
        },
        ink: {
          DEFAULT: '#211915', // near-black body text
          soft: '#5C554D', // muted body text
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
