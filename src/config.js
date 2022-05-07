// External dependencies.
const { basename, dirname, join } = require('path');

// Local dependencies.
const packageJson = require(join(process.cwd(), 'package.json'));

export const BLOCKS_DIR = packageJson.config?.['blocksDir'] || 'blocks';
export const DEFAULT_BLOCK_CATEGORY = packageJson.config?.['defaultBlockCategory'] || '';
export const PLUGINS_DIR = packageJson.config?.['pluginsDir'] || 'plugins';
export const PREFIX = packageJson.config?.['prefix'] || basename(process.cwd()).replace('-gutenberg-blocks', '');
export const SCSS_DEFAULT_IMPORTS = packageJson.config?.['scssDefaultImports'] || [];
export const THEME_DIST_DIR = packageJson.config?.['themeDistDir'] || 'dist';
export const THEME_SCSS_INCLUDES_DIR = packageJson.config?.['themeScssIncludesDir'] || 'assets/scss/_includes';
export const THEME_SLUG = packageJson.config?.['themeSlug'] || basename(process.cwd()).replace('-gutenberg-blocks', '-theme');
export const WP_CONTENT_DIR = packageJson.config?.['wpContentDir'] || dirname(dirname(process.cwd()));