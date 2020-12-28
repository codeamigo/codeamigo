module.exports = {
  darkMode: false,
  plugins: [require('@tailwindcss/forms')],
  purge: ['./pages/**/*.js', './components/**/*.js'],
  // or 'media' or 'class'
  theme: {
    extend: {
      minHeight: {
        0: '0',
        '1/5': '20%',
        '2/5': '40%',
        '3/5': '60%',
        '4/5': '80%',
      },
    },
  },
  variants: {
    extend: {
      borderWidth: ['first'],
      margin: ['first'],
      opacity: ['disabled'],
    },
  },
};
