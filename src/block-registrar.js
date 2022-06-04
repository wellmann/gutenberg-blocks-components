// WordPress dependencies.
const { InnerBlocks } = wp.blockEditor;
const { registerBlockType } = wp.blocks;

// Local dependencies.
import Edit from './components/Wrapper/EditWrapper';

const requireContext = require.context(__BLOCKS_DIR__, true, /block\.js$/);
requireContext.keys().forEach((key) => {
  let blockSlug = key.split('/')[1];
  let blockName = __PREFIX__ + '/' + blockSlug;
  let { default: blockSettings } = requireContext(key);
  let editFunction = blockSettings.edit;

  delete blockSettings.edit;

  blockSettings.supports = blockSettings.supports || {};
  blockSettings.supports.html = false; // Since save is returning null the blocks HTML can't be edited.

  registerBlockType(blockName, {
    apiVersion: 2,
    category: __DEFAULT_BOCK_CAT__,
    edit: Edit({ blockName, editFunction }),
    save({ attributes }) {
      if (<InnerBlocks.Content />) {
        return <InnerBlocks.Content />;
      }

      return null;
    },
    ...blockSettings
  });
});