const { parsed: localEnv } = require('dotenv').config()
const webpack = require('webpack')
const withImages = require('next-images');

module.exports = withImages({
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv))
    return config
  }
})