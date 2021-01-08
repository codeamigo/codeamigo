module.exports = {
  // or 'media' or 'class'
  darkMode: false,
  plugins: [require('@tailwindcss/forms')],
  purge: [
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    './modals/**/*.{js,ts,jsx,tsx}',
    './widgets/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      minHeight: {
        0: '0',
        '1/5': '20%',
        '2/5': '40%',
        24: '6rem',
        '3/5': '60%',
        '4/5': '80%',
        6: '1.5rem',
      },
      transition: {
        height: 'height',
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
