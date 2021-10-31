module.exports = {
  async headers() {
    return [
      {
        headers: [
          {
            key: 'cache-control',
            value: 's-maxage=1, stale-while-revalidate=59',
          },
        ],
        source: '/',
      },
    ];
  },
  webpack: (config, { buildId, defaultLoaders, dev, isServer, webpack }) => {
    return config;
  },
};
