module.exports = {
  experimental: {
    concurrentFeatures: true,
    serverComponents: true,
  },
  webpack: (config, { buildId, defaultLoaders, dev, isServer, webpack }) => {
    return config;
  },
};
