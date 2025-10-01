module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Ignore source map warnings
      webpackConfig.ignoreWarnings = [
        {
          module: /stylis-plugin-rtl/,
        },
        /Failed to parse source map/,
      ];
      return webpackConfig;
    },
  },
};