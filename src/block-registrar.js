// WordPress dependencies.
const { InnerBlocks } = wp.blockEditor;
const { registerBlockType } = wp.blocks;

// Local dependencies.
import Edit from './components/Wrapper/EditWrapper';

const requireContext = require.context(__BLOCKS_DIR__, true, /edit\.js$/);
requireContext.keys().forEach((key) => {
  const blockSlug = key.split('/')[1];
  const blockName = __PREFIX__ + '/' + blockSlug;
  const { default: editFunction } = requireContext(key);
  const { default: blockSettings } = requireContext(key.replace('edit.js', 'block.json'));

  blockSettings.supports = blockSettings.supports || {};
  blockSettings.supports.html = false; // Since save is returning null the blocks HTML can't be edited.

  registerBlockType(blockName, {
    apiVersion: 3,
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