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
    backgroundColor: (theme) => ({
      ...theme('colors'),
    }),
    extend: {
      animation: {
        'ping-quick': 'ping 0.5s linear infinite',
      },
      colors: {
        primary: 'var(--color-primary)',
        'primary-bg': 'var(--color-primary-bg)',
        secondary: 'var(--color-secondary)',
        'secondary-bg': 'var(--color-secondary-bg)',
        ternary: 'var(--color-ternary)',
        'ternary-bg': 'var(--color-ternary-bg)',
      },
      maxHeight: {
        '3/5': '60%',
        6: '1.5rem',
      },
      minHeight: {
        0: '0',
        '1/5': '20%',
        16: '4rem',
        '2/5': '40%',
        24: '6rem',
        '3/5': '60%',
        '4/5': '80%',
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
