const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('webpack-merge');
const LoadableWebpackPlugin = require('@loadable/webpack-plugin');
const DotEnv = require('dotenv-webpack');

const configs = {
  development: {
    styleLoader: require.resolve('style-loader'),
  },
  production: {
    styleLoader: MiniCssExtractPlugin.loader,
  },
};

function baseConfig(options) {
  const { mode } = options;
  const {
    styleLoader,
  } = configs[mode];
  return merge(options, {
    entry: [
      './src/index.js',
    ],
    module: {
      rules: [
        {
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.eot$/, /\.svg$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
              },
            },
            {
              test: /\.(js|jsx)$/,
              exclude: /node_modules|bower_components/,
              loader: require.resolve('babel-loader'),
              options: {
                cacheDirectory: true,
                caller: {
                  target: 'web',
                },
              },
            },
            {
              test: /\.css$/,
              use: getStyleLoaders({ importLoaders: 1, url: false }, styleLoader),
            },
            {
              test: /\.(scss|sass)$/,
              use: getStyleLoaders({ importLoaders: 2, url: false }, styleLoader, 'sass-loader'),
            },
            {
              exclude: [/\.(js|mjs|jsx)$/, /\.html$/, /\.json$/],
              loader: require.resolve('file-loader'),
              options: {
                name: 'media/[name].[hash:8].[ext]',
              },
            },
          ],
        },
      ],
    },
    output: {
      path: path.join(process.cwd(), 'build'),
      filename: 'js/[name].js',
    },
    plugins: [
      new DotEnv({
        path: resolvePath('config/.env'),
        safe: true,
        defaults: false,
        systemvars: mode === 'production',
      }),
      new LoadableWebpackPlugin({ writeToDisk: true }),
    ],
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
    resolve: {
      modules: ['node_modules', 'src'],
      extensions: ['.mjs', '.js', '.json', '.jsx', '.css', '.scss'],
    },
  });
}

function resolvePath(relativePath) {
  return path.join(process.cwd(), relativePath);
}

function getStyleLoaders(cssOptions, mainLoader, preProcessor) {
  return [
    mainLoader,
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
        ],
      },
    },
    preProcessor,
  ].filter(Boolean);
}

module.exports = {
  baseConfig,
  resolvePath,
};
