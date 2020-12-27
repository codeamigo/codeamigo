module.exports = {
  darkMode: false,
  plugins: [require('@tailwindcss/forms')],
  purge: ['./pages/**/*.js', './components/**/*.js'],
  // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      borderWidth: ['first'],
      margin: ['first'],
      opacity: ['disabled'],
    },
  },
};
