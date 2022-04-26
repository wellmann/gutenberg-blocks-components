// WordPress dependencies.
const { addFilter } = wp.hooks;
const { hasBlockSupport } = wp.blocks;

// Local dependencies.
import { blockNameToBlockClassName, convertToBem } from './utils';

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
 * Convert class name for styles of custom blocks to BEM.
 */
addFilter('blocks.getBlockAttributes', __PREFIX__ + '/block/className', (attributes, block) => {
  if (block.name.indexOf(__PREFIX__ + '/') === 0 && attributes.className) {
    attributes.className = convertToBem(blockNameToBlockClassName(block.name), attributes.className);
  }

  return attributes;
})

/**
 * Change class names for custom blocks in editor to match front end.
 */
addFilter('blocks.getBlockDefaultClassName', __PREFIX__ + '/block/className', (className, blockName) => blockName.indexOf(__PREFIX__ + '/') === 0 ? 'block ' + blockNameToBlockClassName(blockName) : className);