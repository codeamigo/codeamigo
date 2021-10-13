module.exports = {
  webpack: (config, { buildId, defaultLoaders, dev, isServer, webpack }) => {
    // Important: return the modified config
    config.experiments = { topLevelAwait: true };
    return config;
  },
};
