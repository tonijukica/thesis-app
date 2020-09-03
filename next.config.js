const { parsed: localEnv } = require('dotenv').config()
const webpack = require('webpack')
const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')(['react-material-ui-carousel']);

const nextConfig = {
  webpack: (config) => {
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv))
    return config
  }
};

module.exports = withPlugins([withImages, withTM], nextConfig)
