// WordPress dependencies.
const { addFilter } = wp.hooks;
const { hasBlockSupport } = wp.blocks;

/**
 * Groups core blocks in custom category.
 */
addFilter('blocks.registerBlockType', __PREFIX__ + '/block/category', (settings, name) => {
  if (name.includes('core/')) {
    settings.category = 'wordpress-default';
  }

  return settings;
});

/**
 * Changes anchor options so that it is accesable via PHP.
 */
addFilter('blocks.registerBlockType', __PREFIX__ + '/anchor/attribute', (settings) => {
  if (hasBlockSupport(settings, 'anchor')) {
    settings.attributes.anchor = { type: 'string' };
  }

  return settings;
});

/**
 * Change class name for custom blocks in editor to match front end.
 */
addFilter('blocks.getBlockDefaultClassName', __PREFIX__ + '/block/className', (className, blockName) => {
  const blockNameParts = blockName.split('/');
  const blockNamespace = blockNameParts[0];
  const blockSlug = blockNameParts[1];

  return blockNamespace === __PREFIX__ ? 'block-' + blockSlug : className;
});