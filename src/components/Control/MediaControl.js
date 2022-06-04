// WordPress dependencies.
const { useContext } = wp.element;
const { MediaUpload } = wp.blockEditor;
const { BaseControl, Button } = wp.components;
const { __ } = wp.i18n;
const { withInstanceId } = wp.compose;

const MediaControl = ({ label, value, onChange, ...restProps }) => {
  const id = 'inspector-media-control-' + restProps.instanceId;
  const buttonStyle = {
    display: 'block',
    width: 200,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  };

  return (
    <BaseControl>
      <label htmlFor={ id } className="components-base-control__label">{ label }</label>
      <div className="components-panel__row" style={ { marginTop: 0 } }>
        <MediaUpload
          onSelect={ ({ id, url }) => onChange({ id, url }) }
          render={ ({ open }) => (
            <>
              <Button
                id={ id }
                onClick={ open }
                style={ buttonStyle }
                isLink>{ value ? value.url.split(/[\\/]/).pop() : __('Media Library') }</Button>
                <Button
                  disabled={ !value }
                  icon="no-alt"
                  onClick={ () => onChange(null) }
                  label={ __('Remove') }
                />
            </>
          ) }
          value={ value ? value.id : null }
          { ...restProps }
        />
      </div>
    </BaseControl>
  );
};

export default withInstanceId(MediaControl);