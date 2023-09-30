// External dependencies.
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { createHash } = require('crypto');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const fastGlob = require('fast-glob');
const { existsSync } = require('fs');
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

const getLocalIdent = ({ resourcePath, mode }, localIdentName, localName) => {
  const hash = createHash('sha256')
    .update(resourcePath + localName)
    .digest('hex')
    .slice(0, 5);
  localIdentName = basename(resourcePath, '.module.scss');

  return mode === 'production' ? `_${hash}` : `${localIdentName}__${localName}_${hash}`;
};

const isDev = process.argv.indexOf('--mode=development') > -1;
const blocksDirPath = join(process.cwd(), BLOCKS_DIR);

const cssLoaderOptions = {
  url: false,
  sourceMap: isDev,
  modules: {
    mode: 'icss'
  }
};

const sassLoaderOptions = {
  sassOptions: {
    includePaths: [
      blocksDirPath,
      join(WP_CONTENT_DIR, 'themes', THEME_SLUG, THEME_SCSS_INCLUDES_DIR)
    ],
    importer: require('node-sass-json-importer')()
  },
  additionalData: (SCSS_DEFAULT_IMPORTS ? SCSS_DEFAULT_IMPORTS.map((file) => `@use "${file}" as *;`).join('\n') : ''),
  sourceMap: isDev
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
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: process.cwd() + '/dist'
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' }
      },
      {
        test: /\.s?css$/,
        exclude: [/\.(inline|module)\.s?css$/],
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
              ...cssLoaderOptions,
              modules: {
                getLocalIdent,
                exportLocalsConvention: 'camelCaseOnly',
                mode: (resourcePath) => resourcePath.includes('node_modules') ? 'global' : 'local' // Do not transform class names of external scripts.
              }
            }
          },
          {
            loader: 'sass-loader',
            options: sassLoaderOptions
          }
        ]
      },
      {
        test: /\.inline.s?css$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              ...cssLoaderOptions,
              sourceMap: false
            }
          },
          {
            loader: 'sass-loader',
            options: {
              ...sassLoaderOptions,
              sourceMap: false
            }
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

// Additional CSS for the Gutenberg editor.
const editorStyles = fastGlob.sync([join(blocksDirPath, '**', 'editor.scss')]);
if (editorStyles) {
  editorConfig.entry.editor = [
    ...editorConfig.entry.editor,
    ...editorStyles
  ];
}

// For block related hooks.
const editorHooks = fastGlob.sync([join(blocksDirPath, '**', 'hook.js')]);
if (editorHooks) {
  editorConfig.entry.editor = [
    ...editorConfig.entry.editor,
    ...editorHooks
  ];
}

let frontendConfig = {
  ...sharedConfig,
  entry: {}
};

// CSS that will be inlined on every page (for above the fold blocks).
const criticalFrontendStyles = fastGlob.sync([join(blocksDirPath, '**', 'style.critical.scss')]);
if (criticalFrontendStyles) {
  frontendConfig.entry.critical = criticalFrontendStyles;
}

// CSS that will be lazy loaded (for below the fold blocks).
const frontendStyles = fastGlob.sync([join(blocksDirPath, '**', 'style.scss')]);
if (frontendStyles) {
  frontendConfig.entry.blocks = frontendStyles;
}

// Public JavaScript for the block.
const frontendScripts = fastGlob.sync([join(blocksDirPath, '**', 'view.js')]);
if (frontendScripts) {
  frontendConfig.entry.blocks = frontendConfig.entry.blocks ? [...frontendConfig.entry.blocks, ...frontendScripts] : frontendScripts;
}

// Public CSS and Javascript that needs to be manually enququed.
const standaloneAssets = fastGlob.sync([join(blocksDirPath, '**', '*.standalone.(scss|js)')]);
standaloneAssets.forEach((path) => {
  let blockDirName = basename(dirname(path));
  if (typeof frontendConfig.entry['block-' + blockDirName] === 'undefined') {
    frontendConfig.entry['block-' + blockDirName] = [];
  }

  frontendConfig.entry['block-' + blockDirName].push(path);
});

module.exports = [editorConfig, frontendConfig];