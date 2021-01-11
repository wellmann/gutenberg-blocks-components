// External dependencies.
import BEMHelper from 'react-bem-helper';

// WordPress dependencies.
const { useContext } = wp.element;
const { MediaPlaceholder, MediaUpload } = wp.blockEditor;
const { IconButton, Button, Icon } = wp.components;
const { __ } = wp.i18n;

// Local dependencies.
import { EditContext } from 'components';

const allowedTypes = ['image'];
const deleteStyle = {
  position: 'absolute',
  top: 20,
  right: 20,
  padding: 2,
  background: '#fff',
  border: '1px solid rgba(66,88,99,.4)',
  borderRadius: 4
};

const MediaPlaceholderWrapper = ({ name, label = __('Image'), width = '100%', height, ...props }) => {
  const { attributes, setAttributes, className, isSelected } = useContext(EditContext);
  const value = attributes[name];
  const bem = new BEMHelper(className.split(' ')[0]);
  const onSelect = ({ id, url }) => setAttributes({ [name]: { id, url } });
  const onDelete = (event) => {
    event.stopPropagation();
    setAttributes({ [name]: null });
  };
  const DeleteButton = () => (
    <IconButton
      icon="no-alt"
      style={ deleteStyle }
      onClick={ onDelete }
      label={ __('Remove image') }
    />
  );
  const previewStyle = {
    position: 'relative',
    width,
    height,
    backgroundImage: value ? `url(${value.url})` : null,
    backgroundPosition: 'center',
    backgroundSize: 'cover'
  };
  const Preview = () => (
    <MediaUpload
      onSelect={ onSelect }
      allowedTypes={ allowedTypes }
      value={ value.id }
      render={ ({ open }) => (
        isSelected ? <Button
          onClick={ open }
          { ...bem(name) }
          style={ previewStyle }><DeleteButton /></Button> : <div { ...bem(name) } style={ previewStyle } />
      ) }
    />
  );

  return value ? <Preview /> : <div style={ { width, height } }><MediaPlaceholder
    { ...bem(name) }
    icon={ <Icon icon="format-image" /> }
    labels={ { title: label, instructions: '' } }
    onSelect={ onSelect }
    accept="image/*"
    allowedTypes={ allowedTypes }
    { ...props }
  /></div>;
};

export default MediaPlaceholderWrapper;