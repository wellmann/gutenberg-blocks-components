// WordPress dependencies.
const { addFilter } = wp.hooks;
const { hasBlockSupport } = wp.blocks;
const { createHigherOrderComponent } = wp.compose;
const { InspectorAdvancedControls } = wp.blockEditor;
const { ToggleControl } = wp.components;
const { __ } = wp.i18n;

/**
 * Adds attributes to hide block on specified devices.
 * (All blocks of this plugin have this support option enabled by default.)
 */
addFilter('blocks.registerBlockType', __PREFIX__ + '/device-visibility/attribute', (settings) => {
  const hasSupport = hasBlockSupport(settings, 'deviceVisibility');
  const isOwnBlock = settings.name.indexOf(__PREFIX__ + '/') >= 0;

  if (hasSupport || isOwnBlock) {
    settings.attributes = {
      hideMobile: {
        type: 'bool',
        default: false
      },
      hideDesktop: {
        type: 'bool',
        default: false
      },
      ...settings.attributes
    };
  }

  return settings;
});

/**
 * Adds divice visibility opttons to inspector advanced control panel.
 */
const withInspectorControl = createHigherOrderComponent((BlockEdit) => {

  // eslint-disable-next-line react/display-name
  return (props) => {
    const { name, isSelected, setAttributes } = props;
    const hasSupport = hasBlockSupport(name, 'deviceVisibility');
    const isOwnBlock = name.indexOf(__PREFIX__ + '/') >= 0;
    const { hideMobile, hideDesktop } = props.attributes;

    if ((hasSupport || isOwnBlock) && isSelected) {
      return (
        <>
          <BlockEdit { ...props } />
          <InspectorAdvancedControls>
            <p>{ __('Hide on...', __TEXTDOMAIN__) }</p>
            <ToggleControl
              label={ __('Mobile', __TEXTDOMAIN__) }
              checked={ hideMobile }
              onChange={ (hideMobile) => setAttributes({ hideMobile }) }
            />
            <ToggleControl
              label={ __('Desktop', __TEXTDOMAIN__) }
              checked={ hideDesktop }
              onChange={ (hideMobile) => setAttributes({ hideMobile }) }
            />
          </InspectorAdvancedControls>
        </>
      );
    }

    return <BlockEdit { ...props } />;
  };
}, 'withInspectorControl');
addFilter('editor.BlockEdit', __PREFIX__ + '/editor/device-visibility/with-inspector-control', withInspectorControl);