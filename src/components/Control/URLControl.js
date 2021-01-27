// WordPress dependencies.
const { BaseControl } = wp.components;
const { URLInput } = wp.blockEditor;
const { withInstanceId } = wp.compose;

const URLControl = ({ label = 'URL', ...props }) => {
  const id = 'inspector-url-control-' + props.instanceId;

  return (
    <BaseControl
      id={ id }
      label={ label }
    >
      <URLInput
        id={ id }
        isFullWidth={ true }
        autoFocus={ false }
        { ...props } />
    </BaseControl>
  );
};

export default withInstanceId(URLControl);