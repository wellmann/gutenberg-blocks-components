'use strict';

module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript'
  ],
  targets: 'defaults',
  plugins: [
    [
      '@babel/transform-react-jsx', {
        pragma: 'wp.element.createElement',
        pragmaFrag: 'wp.element.Fragment'
      }
    ]
  ]
};