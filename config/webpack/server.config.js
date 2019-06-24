const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const DotEnv = require('dotenv-webpack');

const DIST_PATH = path.join(process.cwd(), 'dist');

module.exports = (mode) => {
  const plugins = [
    new webpack.NoEmitOnErrorsPlugin(),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [DIST_PATH],
      root: process.cwd(),
      verbose: true,
      dry: false,
    }),
    new DotEnv({
      systemvars: true,
    }),
  ];
  const entry = ['./ssr'];
  const externals = ['@loadable/component', nodeExternals()];
  return {
    bail: true,
    target: 'node',
    entry,
    plugins,
    mode,
    externals,
    output: {
      path: DIST_PATH,
      filename: 'index.js',
      libraryTarget: 'commonjs2',
    },
    module: {
      rules: [
        {
          test: /\.(scss|sass|css)$/,
          exclude: /node_modules/,
          loader: require.resolve('ignore-loader'),
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: require.resolve('babel-loader'),
          options: {
            caller: { target: 'node' },
          },
        },
      ],
    },
    resolve: {
      modules: [
        path.join(process.cwd(), 'node_modules'),
        path.join(process.cwd(), 'src'),
      ],
      extensions: ['.json', '.js'],
    },
    stats: {
      colors: true,
    },
  };
};
