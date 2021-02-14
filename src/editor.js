// WordPress dependencies.
const { InnerBlocks } = wp.blockEditor;
const { registerBlockType } = wp.blocks;

// Local dependencies.
import { buildExamplePreview } from './utils';
import getEdit from './components/Wrapper/EditWrapper';

const requireContext = require.context('./blocks', true, /block\.js$/);
requireContext.keys().forEach((key) => {
  let blockName = key.split('/')[1];
  let blockNamespace = __PREFIX__ + '/' + blockName;
  let { default: blockSettings } = requireContext(key);
  let editFunction = blockSettings.edit;

  delete blockSettings.edit;

  registerBlockType(blockNamespace, {
    category: __PREFIX__,
    example: { attributes: buildExamplePreview(blockSettings.attributes) },
    edit: getEdit({ blockNamespace, editFunction }),
    save: () => InnerBlocks.Content ? InnerBlocks.Content : null,
    ...blockSettings
  });
});