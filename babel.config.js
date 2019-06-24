function isWebTarget(caller) {
  return Boolean(caller && caller.target === 'web');
}

module.exports = (api) => {
  const isWeb = api.caller(isWebTarget);
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          loose: true,
          targets: !isWeb ? {
            node: 'current',
          } : {
            esmodules: true,
          },
          modules: isWeb ? false : 'commonjs',
        },
      ],
      '@babel/preset-react',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@loadable/babel-plugin',
      isWeb && 'react-hot-loader/babel',
      ['@babel/plugin-transform-runtime',
        {
          corejs: false,
          helpers: true,
          regenerator: true,
          useESModules: isWeb,
        },
      ],
    ].filter(Boolean),
  };
};
