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
      animation: {
        'ping-quick': 'ping 0.5s linear infinite',
      },
      colors: {
        accent: 'var(--accent)',
        'bg-nav': 'var(--bg-nav)',
        'bg-nav-offset': 'var(--bg-nav-offset)',
        'bg-primary': 'var(--bg-primary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
      },
      cursor: {
        'col-resize': 'col-resize',
      },
      fontSize: {
        xxs: '.5rem',
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
      cursor: ['disabled'],
      display: ['group-hover'],
      margin: ['first'],
      opacity: ['disabled'],
    },
  },
};
