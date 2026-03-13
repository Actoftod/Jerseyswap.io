/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.{html,tsx,ts}',
    './components/**/*.{tsx,ts}',
    './services/**/*.{tsx,ts}',
  ],
  theme: {
    extend: {
      letterSpacing: {
        mega:  '0.4em',
        ultra: '-0.05em',
      },
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'],
        inter:  ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
