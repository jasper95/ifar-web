const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const DIST_PATH = path.join(process.cwd(), 'server.bundle/');

module.exports = (mode) => {
  const plugins = [
    new CleanWebpackPlugin([DIST_PATH], {
      root: process.cwd(),
      verbose: true,
      dry: false,
    }),
  ];
  const entry = [];
  const externals = ['@loadable/component', nodeExternals()];
  plugins.push(
    // new webpack.BannerPlugin({
    //   banner: 'require(\'source-map-support\').install({environment: \'node\'});\n\n',
    //   raw: true,
    //   entryOnly: true,
    // }),
    new webpack.NoEmitOnErrorsPlugin(),
  );
  entry.push(require.resolve('@babel/polyfill'), './server');
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
