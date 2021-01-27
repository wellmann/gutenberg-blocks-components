'use strict';

// External dependencies.
const { basename } = require('path');

const prefix = basename(process.cwd()).replace('-gutenberg-blocks', '');

module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [
    ['inline-replace-variables', { __PREFIX__: prefix }],
    [
      '@babel/transform-react-jsx', {
        pragma: 'wp.element.createElement',
        pragmaFrag: 'wp.element.Fragment'
      }
    ]
  ]
};