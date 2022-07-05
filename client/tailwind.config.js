module.exports = {
  // or 'media' or 'class'
  darkMode: false,
  plugins: [require('tailwindcss-named-groups'), require('@tailwindcss/forms')],
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
        'accent-faded': 'var(--accent-faded)',
        'bg-nav': 'var(--bg-nav)',
        'bg-nav-faded': 'var(--bg-nav-faded)',
        'bg-nav-offset': 'var(--bg-nav-offset)',
        'bg-nav-offset-faded': 'var(--bg-nav-offset-faded)',
        'bg-primary': 'var(--bg-primary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
      },
      cursor: {
        'col-resize': 'col-resize',
        'e-resize': 'e-resize',
      },
      fontSize: {
        xxs: '.5rem',
      },
      height: {
        'fit-content': 'fit-content',
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
      minWidth: {
        '3/6': '50%',
      },
      transition: {
        height: 'height',
      },
    },
    namedGroups: ['inner-1'],
  },
  variants: {
    extend: {
      borderWidth: ['first'],
      cursor: ['disabled'],
      display: ['group-hover'],
      margin: ['first', 'group-hover'],
      opacity: ['disabled'],
      visibility: ['group-hover'],
      width: ['hover'],
    },
  },
};
