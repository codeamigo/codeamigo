module.exports = {
  async headers() {
    return [
      {
        headers: [{ key: 'Cache-Control', value: 'stale-while-revalidate' }],
        source: '/',
      },
    ];
  },
  webpack: (config, { buildId, defaultLoaders, dev, isServer, webpack }) => {
    return config;
  },
};
