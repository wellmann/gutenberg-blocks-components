// External dependencies.
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const glob = require('glob');
const { basename, dirname } = require('path');
const webpack = require('webpack');

const cwd = process.cwd();
const { config } = require(cwd + '/package.json');
const themeSlug = config.hasOwnProperty('themeSlug') ? config.themeSlug : basename(cwd).replace('-gutenberg-blocks', '');
const wpContentDir = dirname(dirname(cwd));
const { themeAssetsDir, themeScssIncludesDir } = config;

module.exports = {
  mode: 'production',
  entry: {
    'editor': [
      dirname(__dirname) + '/dist/editor.js',
      dirname(__dirname) + '/dist/hooks.js',
      ...glob.sync(cwd + '/src/**/editor.scss')
    ],
    'critical': glob.sync(cwd + '/src/**/style.critical.scss'),
    'blocks': [
      ...glob.sync(cwd + '/src/**/style.scss'),
      ...glob.sync(cwd + '/src/**/script.js')
    ]
  },
  plugins: [
    new DependencyExtractionWebpackPlugin(),
    new CleanWebpackPlugin(),
    new webpack.SourceMapDevToolPlugin({
      include: ['editor', 'blocks'],
      filename: '[file].map'
    }),
    new ExtractTextPlugin({ filename: '[name].css' })
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
        use: {
          loader: 'babel-loader',
          options: require(dirname(__dirname) + '/configs/babel.config.js')
        }
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