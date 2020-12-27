module.exports = {
  purge: ['./pages/**/*.js', './components/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      borderWidth: ['first'],
      margin: ['first'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
