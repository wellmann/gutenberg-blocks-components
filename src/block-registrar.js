// WordPress dependencies.
const { registerBlockType, registerBlockCollection } = wp.blocks;

// Local dependencies.
import Edit from './components/Wrapper/EditWrapper';

const requireContext = require.context(__BLOCKS_DIR__, true, /block\.js$/);
requireContext.keys().forEach((key) => {
  let blockSlug = key.split('/')[1];
  let blockName = __PREFIX__ + '/' + blockSlug;
  let { default: blockSettings } = requireContext(key);
  let editFunction = blockSettings.edit;

  delete blockSettings.edit;

  blockSettings.supports.html = false; // Since save is returning null the blocks HTML can't be edited.

  registerBlockType(blockName, {
    apiVersion: 2,
    category: __DEFAULT_BOCK_CAT__,
    edit: Edit({ blockName, editFunction }),
    save({ attributes }) {
      if (attributes.content) {
        return attributes.content;
      }

      return null;
    },
    ...blockSettings
  });
});