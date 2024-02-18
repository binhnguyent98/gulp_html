/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    colors: {
      primary: '#00abc5',
      white: '#ffffff',
      error: '#FF3333',
      black: '#333333',
      text: {
        primary: '#333333',
        secondary: '#dddddd',
      },
    },
    screens: {
      xl: { max: '1367px' },
      lg: { max: '1023px' },
      md: { max: '767px' },
      sm: { max: '639px' },
      xs: { max: '576px' },
    },
  },
  plugins: [],
};
