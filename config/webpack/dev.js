const webpack = require('webpack');
const express = require('express');
const { baseConfig, resolvePath } = require('./base');


const result = baseConfig({
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: {
      name: 'manifest',
    },
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  output: {
    publicPath: '/',
  },
  devServer: {
    open: true,
    port: process.env.PORT || 3000,
    hotOnly: true,
    overlay: true,
    historyApiFallback: true,
    before(app) {
      app.use('/static', express.static(resolvePath('public')));
    },
    proxy: {
      '/api': {
        target: process.env.API_URL,
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
      },
    },
  },
});
module.exports = result;
