// External dependencies.
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const fastGlob = require('fast-glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { basename, dirname, join } = require('path');
const { DefinePlugin, SourceMapDevToolPlugin } = require('webpack');

// Local dependencies.
const {
  BLOCKS_DIR,
  DEFAULT_BLOCK_CATEGORY,
  PREFIX,
  SCSS_DEFAULT_IMPORTS,
  THEME_DIST_DIR,
  THEME_SCSS_INCLUDES_DIR,
  THEME_SLUG,
  WP_CONTENT_DIR
} = require('../dist/config');
const { getLocalIdent } = require('../dist/utils');

const blocksDirPath = join(process.cwd(), BLOCKS_DIR);

const cssLoaderOptions = {
  url: false,
  sourceMap: true
};

const sassLoaderOptions = {
  sassOptions: {
    includePaths: [
      blocksDirPath,
      join(WP_CONTENT_DIR, 'themes', THEME_SLUG, THEME_SCSS_INCLUDES_DIR)
    ]
  },
  additionalData:
    '$assets-path: "../../../../themes/${join(THEME_SLUG, THEME_DIST_DIR)}";' +
    (SCSS_DEFAULT_IMPORTS ? SCSS_DEFAULT_IMPORTS.map((file) => `@use "${file}" as *;`) : ''),
  sourceMap: true
};

const sharedConfig = {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new DefinePlugin({
      __BLOCKS_DIR__: JSON.stringify(blocksDirPath),
      __DEFAULT_BOCK_CAT__: JSON.stringify(DEFAULT_BLOCK_CATEGORY),
      __PREFIX__: JSON.stringify(PREFIX)
    }),
    new MiniCssExtractPlugin(),
    new SourceMapDevToolPlugin({
      exclude: ['critical'],
      filename: '[file].map'
    })
  ],
  output: {
    filename: '[name].js',
    path: process.cwd() + '/dist'
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

let editorConfig = {
  ...sharedConfig,
  entry: {
    editor: [
      join(dirname(__dirname), 'dist/block-registrar.js'),
      join(dirname(__dirname), 'dist/block-attribute-hooks.js')
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

const blocksDirPathGlob = join(blocksDirPath, '**');

const editorStyles = fastGlob.sync([join(blocksDirPathGlob, 'editor.scss')]);
if (editorStyles) {
  editorConfig.entry.editor = [
    ...editorConfig.entry.editor,
    ...editorStyles
  ];
}

let frontendConfig = {
  ...sharedConfig,
  entry: {}
};

const criticalFrontendStyles = fastGlob.sync([join(blocksDirPathGlob, 'style.critical.scss')]);
if (criticalFrontendStyles) {
  frontendConfig.entry.critical = criticalFrontendStyles;
}

const frontendStyles = fastGlob.sync([join(blocksDirPathGlob, 'style.scss')]);
if (frontendStyles) {
  frontendConfig.entry.blocks = frontendStyles;
}

const frontendScripts = fastGlob.sync([join(blocksDirPathGlob, 'script.js')]);
if (frontendScripts) {
  frontendConfig.entry.blocks = frontendConfig.entry.blocks ? [...frontendConfig.entry.blocks, ...frontendScripts] : frontendScripts;
}

module.exports = [editorConfig, frontendConfig];