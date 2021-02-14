'use strict';

module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [
    [
      '@babel/transform-react-jsx', {
        pragma: 'wp.element.createElement',
        pragmaFrag: 'wp.element.Fragment'
      }
    ]
  ]
};