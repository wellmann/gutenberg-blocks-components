// External dependencies.
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { createHash } = require('crypto');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const fastGlob = require('fast-glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { basename, dirname } = require('path');
const { DefinePlugin, SourceMapDevToolPlugin } = require('webpack');

const cwd = process.cwd();
const { config } = require(cwd + '/package.json');
const themeSlug = config.themeSlug || basename(cwd).replace('-gutenberg-blocks', '-theme');
const wpContentDir = dirname(dirname(cwd));
const { themeAssetsDir, themeScssIncludesDir } = config;
const blocksDir = config.blocksDir || '/blocks';
const prefix = basename(cwd).replace('-gutenberg-blocks', '');

const getLocalIdent = ({ resourcePath, mode }, localIdentName, localName) => {
  const hash = createHash('sha256')
    .update(resourcePath + localName)
    .digest('hex')
    .slice(0, 5);
  localIdentName = basename(resourcePath, '.module.scss');

  return mode === 'production' ? `_${hash}` : `${localIdentName}__${localName}_${hash}`;
};

const cssLoaderOptions = {
  url: false,
  sourceMap: true
};
const sassLoaderOptions = {
  sassOptions: {
    includePaths: [
      cwd + '/src',
      wpContentDir + '/themes/' + themeSlug + themeScssIncludesDir
    ]
  },
  additionalData:
    '$assets-path: "../../../../themes/${themeSlug + themeAssetsDir}";' +
    (config.scssDefaultImports ? config.scssDefaultImports.map((file) => `@use "${file}" as *;`) : ''),
  sourceMap: true
};
const sharedConfig = {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new DefinePlugin({
      __BLOCKS_DIR__: JSON.stringify(cwd + blocksDir),
      __DEFAULT_BOCK_CAT__: JSON.stringify(config.defaultBlockCategory || ''),
      __PREFIX__: JSON.stringify(prefix)
    }),
    new MiniCssExtractPlugin(),
    new SourceMapDevToolPlugin({
      exclude: ['critical'],
      filename: '[file].map'
    })
  ],
  output: {
    filename: '[name].js',
    path: cwd + '/dist'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' }
      },
      {
        test: /\.s?css$/,
        exclude: [/node_modules/, /\.module\.s?css$/],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: cssLoaderOptions
          },
          {
            loader: 'sass-loader',
            options: sassLoaderOptions
          }
        ]
      },
      {
        test: /\.module.s?css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                getLocalIdent,
                exportLocalsConvention: 'camelCaseOnly',
                mode: (resourcePath) => resourcePath.includes('node_modules') ? 'global' : 'local' // Do not transform class names of external scripts.
              },
              ...cssLoaderOptions
            }
          },
          {
            loader: 'sass-loader',
            options: sassLoaderOptions
          }
        ]
      }
    ]
  }
};
const editorConfig = {
  ...sharedConfig,
  entry: {
    editor: [
      dirname(__dirname) + '/dist/block-registrar.js',
      dirname(__dirname) + '/dist/block-attribute-hooks.js',
      ...fastGlob.sync([cwd + blocksDir + '/**/editor.scss'])
    ]
  },
  plugins: [
    ...sharedConfig.plugins,
    new DependencyExtractionWebpackPlugin()
  ],
  module: {
    rules: [
      ...sharedConfig.module.rules,
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      }
    ]
  }
};
const frontendConfig = {
  ...sharedConfig,
  entry: {
    critical: fastGlob.sync([cwd + blocksDir + '/**/style.critical.scss']),
    blocks: [
      ...fastGlob.sync([cwd + blocksDir + '/**/style.scss']),
      ...fastGlob.sync([cwd + blocksDir + '/**/script.js'])
    ]
  }
};

module.exports = [editorConfig, frontendConfig];