module.exports = {
  async redirects() {
    return [
      {
        destination: '/',
        permanent: true,
        source: '/lessons/:path*',
      },
    ];
  },
  webpack: (config, { buildId, defaultLoaders, dev, isServer, webpack }) => {
    return config;
  },
};
