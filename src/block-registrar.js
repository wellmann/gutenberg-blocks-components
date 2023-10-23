// WordPress dependencies.
const { InnerBlocks } = wp.blockEditor;
const { registerBlockType } = wp.blocks;

// Local dependencies.
import Edit from './components/Wrapper/EditWrapper';

const blocksToRegister = {};
const requireContext = require.context(__BLOCKS_DIR__, true, /(block\.json|edit\.js)$/);
requireContext.keys().forEach((key) => {
  const blockSlug = key.split('/')[1];

  if (!blocksToRegister[blockSlug]) {
    blocksToRegister[blockSlug] = {};
  }

  if (key.includes('block.json')) {
    blocksToRegister[blockSlug].blockSettings = requireContext(key);
    return;
  }

  if (key.includes('edit.js')) {
    blocksToRegister[blockSlug].editFunction = requireContext(key).default;
    return;
  }
});

Object.keys(blocksToRegister).forEach((blockSlug) => {
  const { blockSettings, editFunction } = blocksToRegister[blockSlug];
  const blockName = __PREFIX__ + '/' + blockSlug;

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