module.exports = {
  async redirects() {
    return [
      {
        destination: '/',
        permanent: true,
        source: '/lessons/:path*',
      },
      {
        destination: '/',
        permanent: true,
        source: '/v2',
      },
    ];
  },
  webpack: (config, { buildId, defaultLoaders, dev, isServer, webpack }) => {
    return config;
  },
};
