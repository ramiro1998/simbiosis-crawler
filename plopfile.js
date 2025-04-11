const { configBuilder, ConfigTypes } = require('./libs/_templates/config');

module.exports = function (
  /** @type {import('plop').NodePlopAPI} */
  plop
) {
  plop.setGenerator(ConfigTypes.Crawler, configBuilder(ConfigTypes.Crawler));
};
