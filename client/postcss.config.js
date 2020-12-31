module.exports = {
  plugins: [
    'tailwindcss',
    'postcss-import',
    'postcss-flexbugs-fixes',
    [
      'postcss-preset-env',
      {
        autoprefixer: {
          flexbox: 'no-2009',
        },
        features: {
          'custom-properties': false,
        },
        stage: 3,
      },
    ],
  ],
};
