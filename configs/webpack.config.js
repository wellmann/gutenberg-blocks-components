// External dependencies.
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const glob = require('glob');
const { basename, dirname } = require('path');
const { DefinePlugin, SourceMapDevToolPlugin } = require('webpack');

const cwd = process.cwd();
const { config } = require(cwd + '/package.json');
const themeSlug = config.hasOwnProperty('themeSlug') ? config.themeSlug : basename(cwd).replace('-gutenberg-blocks', '-theme');
const wpContentDir = dirname(dirname(cwd));
const { themeAssetsDir, themeScssIncludesDir } = config;
const prefix = basename(cwd).replace('-gutenberg-blocks', '');

module.exports = {
  mode: 'production',
  entry: {
    'editor': [
      dirname(__dirname) + '/dist/editor.js',
      dirname(__dirname) + '/dist/hooks.js',
      dirname(__dirname) + '/dist/hooks/deviceVisibility.js',
      ...glob.sync(cwd + '/src/**/editor.scss')
    ],
    'critical': glob.sync(cwd + '/src/**/style.critical.scss'),
    'blocks': [
      ...glob.sync(cwd + '/src/**/style.scss'),
      ...glob.sync(cwd + '/src/**/script.js')
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new DefinePlugin({
      __BLOCKS_DIR__: JSON.stringify(cwd + '/src'),
      __PREFIX__: JSON.stringify(prefix),
      __TEXTDOMAIN__: JSON.stringify(prefix)
    }),
    new DependencyExtractionWebpackPlugin(),
    new ExtractTextPlugin({ filename: '[name].css' }),
    new SourceMapDevToolPlugin({
      include: ['editor', 'blocks'],
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
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' }
      },
      {
        test: /\.s?css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                url: false,
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  includePaths: [
                    cwd + '/src',
                    wpContentDir + '/themes/' + themeSlug + themeScssIncludesDir
                  ]
                },
                prependData:
                  `$assets-path: "../../../../themes/${themeSlug + themeAssetsDir}";` +
                  '@import "variables";' +
                  '@import "mixins";',
                sourceMap: true
              }
            }
          ]
        })
      }
    ]
  }
};